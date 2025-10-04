
'use client';

import React, { useState, useEffect, useCallback } from 'react';
import { notFound, useSearchParams, useRouter } from 'next/navigation';
import Confetti from 'react-confetti';
import { Card, CardContent, CardDescription, CardHeader, CardTitle, CardFooter } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { RadioGroup, RadioGroupItem } from '@/components/ui/radio-group';
import { Label } from '@/components/ui/label';
import { Progress } from '@/components/ui/progress';
import { CheckCircle2, XCircle, Loader2, Award, Zap } from 'lucide-react';
import { generateQuizContent, GenerateQuizContentOutput } from '@/ai/flows/generate-quiz-content';
import { useStudentData } from '@/hooks/use-student-data';
import { doc, updateDoc, increment, arrayUnion } from 'firebase/firestore';
import { getDb } from '@/lib/firebase';
import { useToast } from '@/hooks/use-toast';
import { errorEmitter } from '@/firebase/error-emitter';
import { FirestorePermissionError } from '@/firebase/errors';
import { allBadges } from '@/app/student/badges/page';
import { useWindowSize } from '@/hooks/use-window-size';
import { QuizAttempt } from '@/lib/types';
type UserAnswers = { [key: number]: number | null };

const difficultyXpMap = {
  easy: 25,
  medium: 50,
  hard: 100,
};

export default function QuizTakingClientPage() {
  const router = useRouter();
  const searchParams = useSearchParams();
  const { toast } = useToast();
  const { student } = useStudentData();
  const { width, height } = useWindowSize();

  const subject = searchParams.get('subject');
  const difficulty = searchParams.get('difficulty') as 'easy' | 'medium' | 'hard' | null;

  const [quizData, setQuizData] = useState<GenerateQuizContentOutput | null>(null);
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  const [currentQuestionIndex, setCurrentQuestionIndex] = useState(0);
  const [userAnswers, setUserAnswers] = useState<UserAnswers>({});
  const [isSubmitted, setIsSubmitted] = useState(false);
  const [score, setScore] = useState(0);
  const [showConfetti, setShowConfetti] = useState(false);


  const fetchQuiz = useCallback(() => {
    if (subject && difficulty) {
      setIsLoading(true);
      setError(null);
      generateQuizContent({ subject, difficulty, numberOfQuestions: 10 })
        .then(data => {
          if (!data || !data.quiz || data.quiz.length === 0) {
            setError('The AI failed to generate a quiz for this topic. Please try a different one.');
          } else {
            setQuizData(data);
          }
        })
        .catch(err => {
          console.error('Error generating quiz:', err);
           if (err.message && (err.message.includes('429') || err.message.includes('Too Many Requests') || err.message.includes('503'))) {
             setError('The AI is a bit busy right now due to high traffic. Please wait a moment and try again.');
          } else {
            setError('Failed to generate the quiz. Please try again.');
          }
        })
        .finally(() => {
          setIsLoading(false);
        });
    }
  }, [subject, difficulty]);

  useEffect(() => {
    fetchQuiz();
  }, [fetchQuiz]);

  const handleAnswerSelect = (answerIndex: number) => {
    setUserAnswers({
      ...userAnswers,
      [currentQuestionIndex]: answerIndex,
    });
  };

  const handleNext = () => {
    if (quizData && currentQuestionIndex < quizData.quiz.length - 1) {
      setCurrentQuestionIndex(currentQuestionIndex + 1);
    }
  };

  const handleBack = () => {
    if (currentQuestionIndex > 0) {
      setCurrentQuestionIndex(currentQuestionIndex - 1);
    }
  };

  const handleSubmit = async () => {
    const db = getDb();
    if (!quizData || !student || !difficulty || !subject) return;

    let correctAnswers = 0;
    quizData.quiz.forEach((q, index) => {
      if (userAnswers[index] === q.correctAnswerIndex) {
        correctAnswers++;
      }
    });

    const finalScore = (correctAnswers / quizData.quiz.length) * 100;
    setScore(finalScore);
    setIsSubmitted(true);
    if(finalScore >= 80) {
      setShowConfetti(true);
    }

    let xpGained = difficultyXpMap[difficulty];
    
    // In a real app, you would have more robust logic for streak calculation
    // For now, we'll just increment it.
    const newStreak = (student.streak || 0) + 1;

    try {
      const studentDocRef = doc(db, 'users', student.id);
      const updates: { [key: string]: any } = {
        streak: newStreak
      };

      // Badge check logic
      const newlyEarnedBadges: string[] = [];
      const studentBadges = student.badges || [];

      // First Quiz
      if(!studentBadges.includes('first-quiz')) {
        newlyEarnedBadges.push('first-quiz');
      }

      if(finalScore === 100 && !studentBadges.includes('perfectionist')) {
        newlyEarnedBadges.push('perfectionist');
      }
      if(subject?.toLowerCase() === 'python' && !studentBadges.includes('python-pioneer')) {
        newlyEarnedBadges.push('python-pioneer');
      }
      if(subject?.toLowerCase() === 'java' && !studentBadges.includes('java-journeyman')) {
        newlyEarnedBadges.push('java-journeyman');
      }
        if(subject?.toLowerCase() === 'javascript' && !studentBadges.includes('javascript-journeyman')) {
        newlyEarnedBadges.push('javascript-journeyman');
      }
      if(subject?.toLowerCase() === 'c++' && !studentBadges.includes('cpp-captain')) {
        newlyEarnedBadges.push('cpp-captain');
      }
      if(subject?.toLowerCase() === 'biology' && !studentBadges.includes('biologist')) {
        newlyEarnedBadges.push('biologist');
      }
       if(subject?.toLowerCase() === 'tech' && !studentBadges.includes('techie')) {
        newlyEarnedBadges.push('techie');
      }
      if(newStreak >= 3 && !studentBadges.includes('streak-starter')) {
          newlyEarnedBadges.push('streak-starter');
      }
      if(subject?.toLowerCase() === 'maths' && !studentBadges.includes('math-whiz')) {
        newlyEarnedBadges.push('math-whiz');
      }
      
      let badgeXp = 0;
      if(newlyEarnedBadges.length > 0) {
        updates.badges = arrayUnion(...newlyEarnedBadges);
        newlyEarnedBadges.forEach(badgeId => {
            const badgeInfo = allBadges.find(b => b.id === badgeId);
            if(badgeInfo) {
                badgeXp += badgeInfo.xp;
            }
        });
      }
      
      updates.xp = increment(xpGained + badgeXp);

      const newQuizAttempt: QuizAttempt = {
        subject: subject,
        difficulty: difficulty,
        score: finalScore,
        timestamp: Date.now(),
      };
      updates.quizHistory = arrayUnion(newQuizAttempt);

      const totalXpGained = xpGained + badgeXp;

      await updateDoc(studentDocRef, updates)
        .catch(serverError => {
            const permissionError = new FirestorePermissionError({
              path: studentDocRef.path,
              operation: 'update',
              requestResourceData: updates,
            });
            errorEmitter.emit('permission-error', permissionError);
        });
      
      toast({
          title: (
            <div className="flex items-center">
              <Zap className="mr-2 h-5 w-5 text-yellow-500" />
              <span className="font-bold">+{totalXpGained} XP Gained!</span>
            </div>
          ),
          description: `You scored ${finalScore.toFixed(0)}% and your streak is now ${newStreak} days!`,
      });

      newlyEarnedBadges.forEach(badgeId => {
          const badgeInfo = allBadges.find(b => b.id === badgeId);
          if (badgeInfo) {
              toast({
                title: (
                    <div className="flex items-center">
                        <Award className="mr-2 h-5 w-5 text-accent" />
                        <span className="font-bold">Badge Unlocked: {badgeInfo.title}!</span>
                    </div>
                ),
                description: `+${badgeInfo.xp} for this achievement!`,
              })
          }
      })

    } catch (err) {
      console.error("Error updating student data: ", err);
      toast({
        title: 'Update Failed',
        description: 'Could not save your progress, but your score is recorded here.',
        variant: 'destructive',
      });
    }
  };
  
  if (!subject || !difficulty) {
    return notFound();
  }

  if (isLoading) {
    return (
      <div className="flex flex-col items-center justify-center h-full gap-4">
        <Loader2 className="h-12 w-12 animate-spin text-primary" />
        <p className="text-muted-foreground">Generating your {subject} quiz...</p>
      </div>
    );
  }

  if (error) {
    return (
      <div className="flex flex-col items-center justify-center h-full gap-4 text-center">
        <XCircle className="h-12 w-12 text-destructive" />
        <p className="text-destructive font-semibold">Oops! Something went wrong.</p>
        <p className="text-muted-foreground max-w-md">{error}</p>
        <Button onClick={fetchQuiz}>Try Again</Button>
      </div>
    );
  }

  if (!quizData || !quizData.quiz.length) {
    return (
      <div className="flex flex-col items-center justify-center h-full gap-4 text-center">
        <p className="text-muted-foreground">Could not load quiz content.</p>
      </div>
    );
  }

  const currentQuestion = quizData.quiz[currentQuestionIndex];
  const progress = ((currentQuestionIndex + 1) / quizData.quiz.length) * 100;


  if (isSubmitted) {
    return (
        <>
        {showConfetti && <Confetti width={width} height={height} recycle={false} onConfettiComplete={() => setShowConfetti(false)} />}
        <Card className="w-full max-w-2xl mx-auto">
            <CardHeader className="text-center items-center">
                {score >= 80 ? (
                    <>
                         <div className="animate-bounce text-8xl">👍</div>
                        <CardTitle className="text-3xl mt-2">Excellent Work!</CardTitle>
                    </>
                ) : (
                    <CardTitle>Quiz Results: {subject}</CardTitle>
                )}
                <CardDescription>
                    You scored {score.toFixed(0)}%!
                </CardDescription>
            </CardHeader>
            <CardContent className="space-y-6">
            {quizData.quiz.map((q, index) => (
                <div key={index} className={`p-4 rounded-lg ${userAnswers[index] === q.correctAnswerIndex ? 'bg-green-100/50 dark:bg-green-900/20' : 'bg-red-100/50 dark:bg-red-900/20'}`}>
                <p className="font-semibold">{index + 1}. {q.question}</p>
                <div className="mt-2 text-sm">
                    <p className={`flex items-center gap-2 ${userAnswers[index] === q.correctAnswerIndex ? 'text-green-600 dark:text-green-400' : 'text-red-600 dark:text-red-400'}`}>
                    {userAnswers[index] === q.correctAnswerIndex ? <CheckCircle2 size={16} /> : <XCircle size={16} />}
                    Your answer: {q.answers[userAnswers[index] ?? -1] ?? "Not answered"}
                    </p>
                    {userAnswers[index] !== q.correctAnswerIndex && (
                    <p className="flex items-center gap-2 mt-1 text-green-600 dark:text-green-400">
                        <CheckCircle2 size={16} /> Correct answer: {q.answers[q.correctAnswerIndex]}
                    </p>
                    )}
                </div>
                <p className="mt-2 text-xs text-muted-foreground p-2 bg-background/50 rounded-md">{q.explanation}</p>
                </div>
            ))}
            </CardContent>
            <CardFooter>
                <Button onClick={() => router.push('/student/quizzes')}>Take Another Quiz</Button>
            </CardFooter>
        </Card>
      </>
    );
  }

  return (
    <Card className="w-full max-w-2xl mx-auto">
      <CardHeader>
        <CardTitle className="capitalize">{subject} Quiz</CardTitle>
        <CardDescription>Question {currentQuestionIndex + 1} of {quizData.quiz.length}</CardDescription>
        <Progress value={progress} className="mt-2" />
      </CardHeader>
      <CardContent>
        <h2 className="text-lg font-semibold mb-4">{currentQuestion.question}</h2>
        <RadioGroup
          key={`${subject}-${difficulty}-${currentQuestionIndex}`}
          value={userAnswers[currentQuestionIndex]?.toString()}
          onValueChange={(value) => handleAnswerSelect(parseInt(value, 10))}
          className="space-y-2"
        >
          {currentQuestion.answers.map((answer, index) => (
             <Label key={`${quizData.quiz.length}-${currentQuestionIndex}-${index}`} htmlFor={`q${currentQuestionIndex}-a${index}`} className="flex items-center space-x-2 p-3 rounded-md border border-transparent hover:border-primary/50 hover:bg-primary/5 has-[>[data-state=checked]]:border-primary has-[>[data-state=checked]]:bg-primary/10 cursor-pointer">
              <RadioGroupItem value={index.toString()} id={`q${currentQuestionIndex}-a${index}`} />
               <span className="flex-1">
                {answer}
              </span>
            </Label>
          ))}
        </RadioGroup>
      </CardContent>
      <CardFooter className="flex justify-between">
        <Button variant="outline" onClick={handleBack} disabled={currentQuestionIndex === 0}>
          Back
        </Button>
        {currentQuestionIndex === quizData.quiz.length - 1 ? (
          <Button onClick={handleSubmit} disabled={userAnswers[currentQuestionIndex] === undefined}>
            Submit Quiz
          </Button>
        ) : (
          <Button onClick={handleNext} disabled={userAnswers[currentQuestionIndex] === undefined}>
            Next
          </Button>
        )}
      </CardFooter>
    </Card>
  );
}

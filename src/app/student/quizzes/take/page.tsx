'use client';

import React, { useState, useEffect, use } from 'react';
import { notFound, useSearchParams } from 'next/navigation';
import { Card, CardContent, CardDescription, CardHeader, CardTitle, CardFooter } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { RadioGroup, RadioGroupItem } from '@/components/ui/radio-group';
import { Label } from '@/components/ui/label';
import { Progress } from '@/components/ui/progress';
import { CheckCircle2, XCircle, Loader2 } from 'lucide-react';
import { generateQuizContent, GenerateQuizContentOutput } from '@/ai/flows/generate-quiz-content';

type UserAnswers = { [key: number]: number | null };

export default function QuizTakingPage() {
  const searchParams = useSearchParams();
  const subject = searchParams.get('subject');
  const difficulty = searchParams.get('difficulty') as 'easy' | 'medium' | 'hard' | null;
  
  const [quizData, setQuizData] = useState<GenerateQuizContentOutput | null>(null);
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  const [currentQuestionIndex, setCurrentQuestionIndex] = useState(0);
  const [userAnswers, setUserAnswers] = useState<UserAnswers>({});
  const [isSubmitted, setIsSubmitted] = useState(false);
  const [score, setScore] = useState(0);
  
  useEffect(() => {
    if (subject && difficulty) {
      setIsLoading(true);
      setError(null);
      generateQuizContent({ subject, difficulty, numberOfQuestions: 10 })
        .then(data => {
          setQuizData(data);
        })
        .catch(err => {
          console.error('Error generating quiz:', err);
          setError('Failed to generate the quiz. Please try again.');
        })
        .finally(() => {
          setIsLoading(false);
        });
    }
  }, [subject, difficulty]);

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
        <p className="text-muted-foreground">{error}</p>
        <Button onClick={() => window.location.reload()}>Try Again</Button>
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

  const handleAnswerSelect = (answerIndex: number) => {
    setUserAnswers({
      ...userAnswers,
      [currentQuestionIndex]: answerIndex,
    });
  };

  const handleNext = () => {
    if (currentQuestionIndex < quizData.quiz.length - 1) {
      setCurrentQuestionIndex(currentQuestionIndex + 1);
    }
  };

  const handleBack = () => {
    if (currentQuestionIndex > 0) {
      setCurrentQuestionIndex(currentQuestionIndex - 1);
    }
  };

  const handleSubmit = () => {
    let calculatedScore = 0;
    quizData.quiz.forEach((q, index) => {
      if (userAnswers[index] === q.correctAnswerIndex) {
        calculatedScore++;
      }
    });
    setScore((calculatedScore / quizData.quiz.length) * 100);
    setIsSubmitted(true);
  };

  if (isSubmitted) {
    return (
      <Card className="w-full max-w-2xl mx-auto">
        <CardHeader>
          <CardTitle>Quiz Results: {subject}</CardTitle>
          <CardDescription>
            You scored {score.toFixed(0)}%!
          </CardDescription>
        </CardHeader>
        <CardContent className="space-y-6">
          {quizData.quiz.map((q, index) => (
            <div key={index} className={`p-4 rounded-lg ${userAnswers[index] === q.correctAnswerIndex ? 'bg-green-100/50' : 'bg-red-100/50'}`}>
              <p className="font-semibold">{index + 1}. {q.question}</p>
              <div className="mt-2 text-sm">
                <p className={`flex items-center gap-2 ${userAnswers[index] === q.correctAnswerIndex ? 'text-green-600' : 'text-red-600'}`}>
                  {userAnswers[index] === q.correctAnswerIndex ? <CheckCircle2 size={16} /> : <XCircle size={16} />}
                  Your answer: {q.answers[userAnswers[index] ?? -1] ?? "Not answered"}
                </p>
                {userAnswers[index] !== q.correctAnswerIndex && (
                  <p className="flex items-center gap-2 mt-1 text-green-600">
                    <CheckCircle2 size={16} /> Correct answer: {q.answers[q.correctAnswerIndex]}
                  </p>
                )}
              </div>
              <p className="mt-2 text-xs text-muted-foreground p-2 bg-background rounded-md">{q.explanation}</p>
            </div>
          ))}
        </CardContent>
        <CardFooter>
            <Button onClick={() => router.push('/student/quizzes')}>Take Another Quiz</Button>
        </CardFooter>
      </Card>
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
          value={userAnswers[currentQuestionIndex]?.toString()}
          onValueChange={(value) => handleAnswerSelect(parseInt(value, 10))}
          className="space-y-2"
        >
          {currentQuestion.answers.map((answer, index) => (
            <div key={index} className="flex items-center space-x-2">
              <RadioGroupItem value={index.toString()} id={`q${currentQuestionIndex}-a${index}`} />
              <Label htmlFor={`q${currentQuestionIndex}-a${index}`} className="flex-1 cursor-pointer">
                {answer}
              </Label>
            </div>
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

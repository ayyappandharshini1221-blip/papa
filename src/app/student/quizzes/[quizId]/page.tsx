'use client';

import { useState } from 'react';
import { Card, CardContent, CardDescription, CardHeader, CardTitle, CardFooter } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { RadioGroup, RadioGroupItem } from '@/components/ui/radio-group';
import { Label } from '@/components/ui/label';
import { Progress } from '@/components/ui/progress';
import { CheckCircle2, XCircle } from 'lucide-react';

// This is mock data. In a real app, you would fetch this from your backend/AI service.
const quizData = {
  title: 'Algebra Basics',
  questions: [
    {
      question: 'What is the value of x in the equation 2x + 3 = 11?',
      answers: ['3', '4', '5', '8'],
      correctAnswerIndex: 1,
      explanation: 'Subtract 3 from both sides to get 2x = 8, then divide by 2 to get x = 4.',
    },
    {
      question: 'Simplify the expression: 3(x + 4) - 2x',
      answers: ['x + 12', '5x + 4', 'x + 4', 'x - 12'],
      correctAnswerIndex: 0,
      explanation: 'Distribute the 3 to get 3x + 12 - 2x. Combine like terms (3x - 2x) to get x + 12.',
    },
    {
      question: 'What is the slope of the line y = -2x + 5?',
      answers: ['5', '2', '-2', '1/2'],
      correctAnswerIndex: 2,
      explanation: 'The equation is in slope-intercept form (y = mx + b), where m is the slope. So, the slope is -2.',
    },
  ],
};

type UserAnswers = { [key: number]: number | null };

export default function QuizTakingPage({ params }: { params: { quizId: string } }) {
  const [currentQuestionIndex, setCurrentQuestionIndex] = useState(0);
  const [userAnswers, setUserAnswers] = useState<UserAnswers>({});
  const [isSubmitted, setIsSubmitted] = useState(false);
  const [score, setScore] = useState(0);

  const currentQuestion = quizData.questions[currentQuestionIndex];
  const progress = ((currentQuestionIndex + 1) / quizData.questions.length) * 100;

  const handleAnswerSelect = (answerIndex: number) => {
    setUserAnswers({
      ...userAnswers,
      [currentQuestionIndex]: answerIndex,
    });
  };

  const handleNext = () => {
    if (currentQuestionIndex < quizData.questions.length - 1) {
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
    quizData.questions.forEach((q, index) => {
      if (userAnswers[index] === q.correctAnswerIndex) {
        calculatedScore++;
      }
    });
    setScore((calculatedScore / quizData.questions.length) * 100);
    setIsSubmitted(true);
  };

  if (isSubmitted) {
    return (
      <Card className="w-full max-w-2xl mx-auto">
        <CardHeader>
          <CardTitle>Quiz Results: {quizData.title}</CardTitle>
          <CardDescription>
            You scored {score.toFixed(0)}%!
          </CardDescription>
        </CardHeader>
        <CardContent className="space-y-6">
          {quizData.questions.map((q, index) => (
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
            <Button onClick={() => window.location.reload()}>Take Another Quiz</Button>
        </CardFooter>
      </Card>
    );
  }

  return (
    <Card className="w-full max-w-2xl mx-auto">
      <CardHeader>
        <CardTitle>{quizData.title}</CardTitle>
        <CardDescription>Question {currentQuestionIndex + 1} of {quizData.questions.length}</CardDescription>
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
        {currentQuestionIndex === quizData.questions.length - 1 ? (
          <Button onClick={handleSubmit}>
            Submit Quiz
          </Button>
        ) : (
          <Button onClick={handleNext}>
            Next
          </Button>
        )}
      </CardFooter>
    </Card>
  );
}

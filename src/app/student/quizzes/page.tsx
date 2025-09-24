'use client';

import { Badge } from '@/components/ui/badge';
import { Button } from '@/components/ui/button';
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from '@/components/ui/card';
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuLabel,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
} from '@/components/ui/dropdown-menu';
import { allQuizzes } from '@/lib/quiz-data';
import { ListFilter, Swords } from 'lucide-react';
import Link from 'next/link';

export default function QuizzesPage() {
  return (
    <div className="flex flex-col gap-6">
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-3xl font-bold tracking-tight">My Quizzes</h1>
          <p className="text-muted-foreground">
            View, filter, and start your assigned quizzes.
          </p>
        </div>
        <div className="flex items-center gap-2">
          <DropdownMenu>
            <DropdownMenuTrigger asChild>
              <Button variant="outline" size="sm" className="h-8 gap-1">
                <ListFilter className="h-3.5 w-3.5" />
                <span className="sr-only sm:not-sr-only sm:whitespace-nowrap">
                  Filter
                </span>
              </Button>
            </DropdownMenuTrigger>
            <DropdownMenuContent align="end">
              <DropdownMenuLabel>Filter by</DropdownMenuLabel>
              <DropdownMenuSeparator />
              <DropdownMenuItem>Subject</DropdownMenuItem>
              <DropdownMenuItem>Difficulty</DropdownMenuItem>
              <DropdownMenuItem>Status</DropdownMenuItem>
            </DropdownMenuContent>
          </DropdownMenu>
        </div>
      </div>

      <div className="grid grid-cols-1 gap-6 sm:grid-cols-2 lg:grid-cols-3">
        {allQuizzes.map((quiz) => (
          <Card key={quiz.id}>
            <CardHeader>
              <div className="flex items-center justify-between">
                <CardTitle className="text-xl">{quiz.title}</CardTitle>
                <Swords className="h-6 w-6 text-primary" />
              </div>
              <CardDescription>
                {quiz.subject} - {quiz.questions} questions
              </CardDescription>
            </CardHeader>
            <CardContent className="flex flex-col justify-between">
              <div className="mb-4 flex items-center gap-2">
                <Badge
                  variant={
                    quiz.difficulty === 'easy'
                      ? 'secondary'
                      : quiz.difficulty === 'medium'
                      ? 'outline'
                      : 'destructive'
                  }
                  className="capitalize"
                >
                  {quiz.difficulty}
                </Badge>
                <Badge
                   variant={
                    quiz.status === 'new'
                      ? 'default'
                      : quiz.status === 'in-progress'
                      ? 'accent'
                      : 'secondary'
                  }
                  className="capitalize"
                >
                  {quiz.status}
                </Badge>
              </div>
              <Button asChild disabled={quiz.status === 'completed'}>
                <Link href={`/student/quizzes/${quiz.id}`}>
                  {quiz.status === 'in-progress'
                    ? 'Continue Quiz'
                    : quiz.status === 'completed'
                    ? 'Completed'
                    : 'Start Quiz'}
                </Link>
              </Button>
            </CardContent>
          </Card>
        ))}
      </div>
    </div>
  );
}

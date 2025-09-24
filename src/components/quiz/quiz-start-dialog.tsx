'use client';

import { useRouter } from 'next/navigation';
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogDescription,
} from '@/components/ui/dialog';
import { Button } from '@/components/ui/button';
import type { Subject } from '@/app/student/quizzes/page';
import { Swords, Shield, Brain } from 'lucide-react';

type Difficulty = 'Easy' | 'Normal' | 'Hard';

const difficultyOptions: {
  level: Difficulty;
  xp: string;
  icon: React.ReactNode;
}[] = [
  {
    level: 'Easy',
    xp: '+25 XP',
    icon: <Shield className="h-6 w-6 text-green-500" />,
  },
  {
    level: 'Normal',
    xp: '+50 XP',
    icon: <Swords className="h-6 w-6 text-yellow-500" />,
  },
  {
    level: 'Hard',
    xp: '+100 XP',
    icon: <Brain className="h-6 w-6 text-red-500" />,
  },
];

export function QuizStartDialog({
  subject,
  open,
  onClose,
}: {
  subject: Subject;
  open: boolean;
  onClose: () => void;
}) {
  const router = useRouter();

  const handleStartQuiz = (difficulty: Difficulty) => {
    onClose();
    // A real implementation would use a unique ID from the backend.
    const quizId = `${subject.name.toLowerCase()}-${difficulty.toLowerCase()}`;
    router.push(`/student/quizzes/${quizId}`);
  };

  return (
    <Dialog open={open} onOpenChange={onClose}>
      <DialogContent>
        <DialogHeader>
          <DialogTitle className="flex items-center gap-3 text-2xl">
            <div className="rounded-lg bg-primary/10 p-3 text-primary">
              {subject.icon}
            </div>
            {subject.name}
          </DialogTitle>
          <DialogDescription className="pt-2 text-base">
            Choose your challenge level. Higher difficulty means more XP!
          </DialogDescription>
        </DialogHeader>
        <div className="mt-4 space-y-4">
          {difficultyOptions.map(({ level, xp, icon }) => (
            <Button
              key={level}
              variant="outline"
              size="lg"
              className="w-full justify-start h-20 text-left"
              onClick={() => handleStartQuiz(level)}
            >
              <div className="flex items-center w-full">
                <div className="mr-4">{icon}</div>
                <div className="flex-1">
                  <p className="text-lg font-semibold">{level}</p>
                  <p className="text-sm text-muted-foreground">
                    Recommended for a solid challenge.
                  </p>
                </div>
                <div className="ml-4 font-bold text-primary">{xp}</div>
              </div>
            </Button>
          ))}
        </div>
      </DialogContent>
    </Dialog>
  );
}
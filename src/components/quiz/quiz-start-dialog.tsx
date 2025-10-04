
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
import { useLanguage } from '@/context/language-context';
import { getTranslation } from '@/lib/translations';

type Difficulty = 'easy' | 'medium' | 'hard';

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
  const { language } = useLanguage();
  const t = (key: string) => getTranslation(language, key);

  const difficultyOptions: {
    level: Difficulty;
    label: string;
    xp: string;
    icon: React.ReactNode;
  }[] = [
    {
      level: 'easy',
      label: t('easy'),
      xp: '+25 XP',
      icon: <Shield className="h-6 w-6 text-green-500" />,
    },
    {
      level: 'medium',
      label: t('normal'),
      xp: '+50 XP',
      icon: <Swords className="h-6 w-6 text-yellow-500" />,
    },
    {
      level: 'hard',
      label: t('hard'),
      xp: '+100 XP',
      icon: <Brain className="h-6 w-6 text-red-500" />,
    },
  ];

  const handleStartQuiz = (difficulty: Difficulty) => {
    onClose();
    router.push(`/student/quizzes/take?subject=${encodeURIComponent(subject.name)}&difficulty=${difficulty}&lang=${language}`);
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
            {t('chooseChallengeLevel')}
          </DialogDescription>
        </DialogHeader>
        <div className="mt-4 space-y-4">
          {difficultyOptions.map(({ level, label, xp, icon }) => (
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
                  <p className="text-lg font-semibold">{label}</p>
                  <p className="text-sm text-muted-foreground">
                    {t('recommendedSolid')}
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

'use client';

import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from '@/components/ui/card';
import { Progress } from '@/components/ui/progress';
import {
  Award,
  Brain,
  Flame,
  Lock,
  Star,
  Swords,
  Target,
  Trophy,
} from 'lucide-react';
import { Badge } from '@/components/ui/badge';
import { cn } from '@/lib/utils';

const allBadges = [
  {
    id: 'math-whiz',
    title: 'Math Whiz',
    description: 'Master the basics of Algebra.',
    icon: <Trophy className="h-10 w-10" />,
    unlocked: true,
    xp: 100,
  },
  {
    id: 'python-pioneer',
    title: 'Python Pioneer',
    description: 'Complete your first Python quiz.',
    icon: <Brain className="h-10 w-10" />,
    unlocked: true,
    xp: 50,
  },
  {
    id: 'streak-starter',
    title: 'Streak Starter',
    description: 'Maintain a 3-day streak.',
    icon: <Flame className="h-10 w-10" />,
    unlocked: true,
    xp: 75,
  },
  {
    id: 'perfectionist',
    title: 'Perfectionist',
    description: 'Get a 100% score on any quiz.',
    icon: <Target className="h-10 w-10" />,
    unlocked: true,
    xp: 150,
  },
  {
    id: 'quiz-master',
    title: 'Quiz Master',
    description: 'Complete 10 quizzes.',
    icon: <Award className="h-10 w-10" />,
    unlocked: false,
    progress: '4/10',
    xp: 200,
  },
  {
    id: 'hardcore-learner',
    title: 'Hardcore Learner',
    description: 'Complete 5 hard quizzes.',
    icon: <Swords className="h-10 w-10" />,
    unlocked: false,
    progress: '1/5',
    xp: 250,
  },
  {
    id: 'star-student',
    title: 'Star Student',
    description: 'Achieve a 90% average score.',
    icon: <Star className="h-10 w-10" />,
    unlocked: false,
    progress: '85%',
    xp: 300,
  },
];

export default function BadgesPage() {
  const unlockedBadges = allBadges.filter((b) => b.unlocked);
  const lockedBadges = allBadges.filter((b) => !b.unlocked);
  const progressValue = (unlockedBadges.length / allBadges.length) * 100;

  return (
    <div className="flex flex-col gap-8">
      <div>
        <h1 className="text-3xl font-bold tracking-tight">Badges Collection</h1>
        <p className="text-muted-foreground">
          Celebrate your achievements and unlock new ones!
        </p>
      </div>

      <Card>
        <CardHeader>
          <CardTitle>Your Progress</CardTitle>
        </CardHeader>
        <CardContent>
          <div className="flex items-center gap-4">
            <Progress value={progressValue} className="h-3 flex-1" />
            <p className="font-semibold">
              {unlockedBadges.length} / {allBadges.length} Unlocked
            </p>
          </div>
        </CardContent>
      </Card>

      <div>
        <h2 className="text-2xl font-semibold tracking-tight mb-4">
          Earned Badges
        </h2>
        <div className="grid grid-cols-1 gap-4 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4">
          {unlockedBadges.map((badge) => (
            <Card
              key={badge.id}
              className="group transform-gpu transition-all duration-300 ease-in-out hover:-translate-y-2 hover:shadow-lg hover:shadow-accent/40"
            >
              <CardContent className="flex flex-col items-center justify-center p-6 text-center">
                <div className="mb-4 rounded-full bg-accent/10 p-4 text-accent drop-shadow-[0_0_8px_hsl(var(--accent))]">
                  {badge.icon}
                </div>
                <p className="font-bold text-lg">{badge.title}</p>
                <p className="text-sm text-muted-foreground mt-1">
                  {badge.description}
                </p>
                <Badge variant="secondary" className="mt-4 bg-accent/20 text-accent">
                  +{badge.xp} XP
                </Badge>
              </CardContent>
            </Card>
          ))}
        </div>
      </div>

      <div>
        <h2 className="text-2xl font-semibold tracking-tight mb-4">
          Locked Badges
        </h2>
        <div className="grid grid-cols-1 gap-4 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4">
          {lockedBadges.map((badge) => (
            <Card
              key={badge.id}
              className="bg-secondary/50 opacity-60"
            >
               <CardContent className="relative flex flex-col items-center justify-center p-6 text-center">
                <div className="absolute top-4 right-4 text-muted-foreground">
                    <Lock className="h-5 w-5" />
                </div>
                <div className="mb-4 rounded-full bg-muted-foreground/20 p-4 text-muted-foreground">
                  {badge.icon}
                </div>
                <p className="font-bold text-lg text-muted-foreground">{badge.title}</p>
                <p className="text-sm text-muted-foreground mt-1">
                  {badge.description}
                </p>
                 <div className="mt-4 font-semibold text-primary text-sm">
                    {badge.progress} Complete
                </div>
              </CardContent>
            </Card>
          ))}
        </div>
      </div>
    </div>
  );
}

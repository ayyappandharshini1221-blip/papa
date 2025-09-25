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
  BookOpen,
  Brain,
  Calculator,
  Code,
  Crown,
  Feather,
  FlaskConical,
  Flame,
  Globe,
  History,
  Library,
  Lightbulb,
  Lock,
  Mountain,
  Rocket,
  Sparkles,
  Star,
  Swords,
  Target,
  Trophy,
  Wind,
  Loader2,
} from 'lucide-react';
import { Badge } from '@/components/ui/badge';
import { useStudentData } from '@/hooks/use-student-data';

export const allBadges = [
  {
    id: 'math-whiz',
    title: 'Math Whiz',
    description: 'Master the basics of Algebra.',
    icon: <Trophy className="h-10 w-10" />,
    xp: 100,
  },
  {
    id: 'python-pioneer',
    title: 'Python Pioneer',
    description: 'Complete your first Python quiz.',
    icon: <Brain className="h-10 w-10" />,
    xp: 50,
  },
  {
    id: 'streak-starter',
    title: 'Streak Starter',
    description: 'Maintain a 3-day streak.',
    icon: <Flame className="h-10 w-10" />,
    xp: 75,
  },
  {
    id: 'perfectionist',
    title: 'Perfectionist',
    description: 'Get a 100% score on any quiz.',
    icon: <Target className="h-10 w-10" />,
    xp: 150,
  },
  {
    id: 'quiz-master',
    title: 'Quiz Master',
    description: 'Complete 10 quizzes.',
    icon: <Award className="h-10 w-10" />,
    progress: '4/10',
    xp: 200,
  },
  {
    id: 'hardcore-learner',
    title: 'Hardcore Learner',
    description: 'Complete 5 hard quizzes.',
    icon: <Swords className="h-10 w-10" />,
    progress: '1/5',
    xp: 250,
  },
  {
    id: 'star-student',
    title: 'Star Student',
    description: 'Achieve a 90% average score.',
    icon: <Star className="h-10 w-10" />,
    progress: '85%',
    xp: 300,
  },
  {
    id: 'quick-learner',
    title: 'Quick Learner',
    description: 'Complete a quiz in under 5 minutes.',
    icon: <Rocket className="h-10 w-10" />,
    xp: 125,
  },
  {
    id: 'knowledge-explorer',
    title: 'Knowledge Explorer',
    description: 'Try a quiz in 5 different subjects.',
    icon: <Globe className="h-10 w-10" />,
    progress: '2/5',
    xp: 175,
  },
  {
    id: 'streak-champion',
    title: 'Streak Champion',
    description: 'Maintain a 7-day streak.',
    icon: <Crown className="h-10 w-10" />,
    progress: '3/7',
    xp: 250,
  },
  {
    id: 'historian',
    title: 'Historian',
    description: 'Complete 5 history quizzes.',
    icon: <History className="h-10 w-10" />,
    progress: '0/5',
    xp: 150,
  },
  {
    id: 'scientist',
    title: 'Scientist',
    description: 'Ace 3 chemistry quizzes.',
    icon: <FlaskConical className="h-10 w-10" />,
    progress: '1/3',
    xp: 150,
  },
  {
    id: 'coder',
    title: 'Coder',
    description: 'Complete your first Tech quiz.',
    icon: <Code className="h-10 w-10" />,
    xp: 50,
  },
  {
    id: 'persistent-achiever',
    title: 'Persistent Achiever',
    description: 'Complete 25 quizzes.',
    icon: <Mountain className="h-10 w-10" />,
    progress: '4/25',
    xp: 500,
  },
  {
    id: 'genius',
    title: 'Genius',
    description: 'Get a 100% score on a hard quiz.',
    icon: <Lightbulb className="h-10 w-10" />,
    progress: '0/1',
    xp: 400,
  },
  {
    id: 'bookworm',
    title: 'Bookworm',
    description: 'Complete 5 literature quizzes.',
    icon: <BookOpen className="h-10 w-10" />,
    progress: '2/5',
    xp: 150,
  },
  {
    id: 'calculator',
    title: 'Calculator',
    description: 'Score over 90% in 5 math quizzes.',
    icon: <Calculator className="h-10 w-10" />,
    progress: '3/5',
    xp: 225,
  },
  {
    id: 'polyglot',
    title: 'Polyglot',
    description: 'Complete quizzes in 3 programming languages.',
    icon: <Library className="h-10 w-10" />,
    progress: '1/3',
    xp: 200,
  },
  {
    id: 'weekend-warrior',
    title: 'Weekend Warrior',
    description: 'Complete a quiz on a Saturday or Sunday.',
    icon: <Sparkles className="h-10 w-10" />,
    xp: 25,
  },
  {
    id: 'breeze',
    title: 'Breeze',
    description: 'Complete 10 easy quizzes.',
    icon: <Wind className="h-10 w-10" />,
    progress: '8/10',
    xp: 100,
  },
  {
    id: 'writer',
    title: 'Writer',
    description: 'Complete your first literature quiz.',
    icon: <Feather className="h-10 w-10" />,
    xp: 50,
  },
  {
    id: 'over-9000',
    title: 'Over 9000!',
    description: 'Earn over 9000 XP points in total.',
    icon: <Award className="h-10 w-10" />,
    progress: '4250/9001',
    xp: 1000,
  },
  {
    id: 'grandmaster',
    title: 'Grandmaster',
    description: 'Complete 100 quizzes.',
    icon: <Trophy className="h-10 w-10" />,
    progress: '4/100',
    xp: 1500,
  },
  {
    id: 'unstoppable',
    title: 'Unstoppable',
    description: 'Maintain a 30-day streak.',
    icon: <Flame className="h-10 w-10" />,
    progress: '3/30',
    xp: 1000,
  },
  {
    id: 'subject-expert',
    title: 'Subject Expert',
    description: 'Complete all difficulty levels for one subject.',
    icon: <Brain className="h-10 w-10" />,
    progress: '0/1',
    xp: 500,
  },
  {
    id: 'perfect-streak',
    title: 'Perfect Streak',
    description: 'Get 100% on 3 quizzes in a row.',
    icon: <Target className="h-10 w-10" />,
    progress: '1/3',
    xp: 350,
  },
];

export default function BadgesPage() {
  const { student, loading } = useStudentData();

  if (loading) {
    return (
      <div className="flex justify-center items-center h-full">
        <Loader2 className="h-12 w-12 animate-spin text-primary" />
      </div>
    );
  }

  const studentBadges = student?.badges || [];

  const unlockedBadges = allBadges.filter((b) => studentBadges.includes(b.id));
  const lockedBadges = allBadges.filter((b) => !studentBadges.includes(b.id));
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
        <div className="grid grid-cols-1 gap-4 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 xl:grid-cols-5">
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
        <div className="grid grid-cols-1 gap-4 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 xl:grid-cols-5">
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
                 {badge.progress && <div className="mt-4 font-semibold text-primary text-sm">
                    {badge.progress} Complete
                </div>}
              </CardContent>
            </Card>
          ))}
        </div>
      </div>
    </div>
  );
}

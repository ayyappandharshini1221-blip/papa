'use client';

import { Award, Bot, Flame, Loader2, Repeat, Swords, Target, Trophy, Zap } from 'lucide-react';
import { Button } from '@/components/ui/button';
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from '@/components/ui/card';
import { Progress } from '@/components/ui/progress';
import { useStudentData } from '@/hooks/use-student-data';
import { useLeaderboard } from '@/hooks/use-leaderboard';
import { allBadges } from '@/app/student/badges/page';
import { Brain, Calculator, Code, Crown, Feather, FlaskConical, Globe, History, Library, Lightbulb, Mountain, Rocket, Sparkles, Star, Wind } from 'lucide-react';

const subjectProgressData = [
  {
    subject: 'Maths',
    icon: <Trophy className="h-6 w-6" />,
    difficulties: [
      { level: 'Easy', attempted: 5, score: 92, progress: 90 },
      { level: 'Normal', attempted: 3, score: 78, progress: 60 },
      { level: 'Hard', attempted: 1, score: 65, progress: 20 },
    ],
  },
   {
    subject: 'Python',
    icon: <Trophy className="h-6 w-6" />,
    difficulties: [
      { level: 'Easy', attempted: 4, score: 100, progress: 100 },
      { level: 'Normal', attempted: 2, score: 85, progress: 50 },
      { level: 'Hard', attempted: 0, score: 0, progress: 0 },
    ],
  },
];

const recentActivities = [
    { id: 1, type: 'quiz', title: 'Completed "Python Basics" quiz', score: '100%', time: '2h ago', icon: <Trophy className="h-5 w-5 text-green-500" />},
    { id: 2, type: 'badge', title: 'Unlocked "Perfectionist" Badge', time: '2h ago', icon: <Target className="h-5 w-5 text-yellow-500" />},
    { id: 3, type: 'quiz', title: 'Completed "Algebra Basics" quiz', score: '90%', time: '1d ago', icon: <Trophy className="h-5 w-5 text-green-500" />},
    { id: 4, type: 'streak', title: 'Reached a 3-day streak!', time: '1d ago', icon: <Flame className="h-5 w-5 text-red-500" />},
];


export default function ProgressPage() {
  const { student, loading: studentLoading } = useStudentData();
  const { leaderboardData, loading: leaderboardLoading } = useLeaderboard(student?.classIds?.[0]);

  if (studentLoading || leaderboardLoading) {
    return (
      <div className="flex justify-center items-center h-full">
        <Loader2 className="h-12 w-12 animate-spin text-primary" />
      </div>
    );
  }

  const yourRank = leaderboardData.find(entry => entry.studentId === student?.id)?.rank;
  const studentBadges = student?.badges || [];

  return (
    <div className="flex flex-col gap-6">
       <div className="flex items-center justify-between">
        <div>
          <h1 className="text-3xl font-bold tracking-tight">My Progress</h1>
          <p className="text-muted-foreground">
            Track your learning journey and achievements.
          </p>
        </div>
      </div>

       <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-4">
        <Card className="bg-gradient-to-tr from-primary/10 to-transparent">
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">Total XP</CardTitle>
            <Zap className="h-4 w-4 text-primary" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold text-primary">{student?.xp ?? 0}</div>
            <p className="text-xs text-muted-foreground">Level 5</p>
          </CardContent>
        </Card>
        <Card className="bg-gradient-to-tr from-accent/10 to-transparent">
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">Current Streak</CardTitle>
            <Flame className="h-4 w-4 text-accent" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold text-accent">{student?.streak ?? 0} days</div>
            <p className="text-xs text-muted-foreground">Keep the fire burning!</p>
          </CardContent>
        </Card>
        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">Badges Unlocked</CardTitle>
            <Award className="h-4 w-4 text-muted-foreground" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">{student?.badges?.length ?? 0} / {allBadges.length}</div>
            <p className="text-xs text-muted-foreground">Almost there!</p>
          </CardContent>
        </Card>
        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">Leaderboard Rank</CardTitle>
            <Trophy className="h-4 w-4 text-muted-foreground" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">{yourRank ? `#${yourRank}`: '-'}</div>
            <p className="text-xs text-muted-foreground">Top 10% in your class</p>
          </CardContent>
        </Card>
      </div>

      <div className="grid grid-cols-1 gap-6 lg:grid-cols-3">
        <div className="flex flex-col gap-6 lg:col-span-2">
            <Card>
                <CardHeader>
                    <CardTitle>Subject Progress</CardTitle>
                    <CardDescription>Your performance across different subjects and difficulties.</CardDescription>
                </CardHeader>
                <CardContent className="space-y-6">
                    {subjectProgressData.map(subject => (
                        <div key={subject.subject}>
                            <div className="flex items-center gap-3 mb-4">
                                <div className="rounded-full bg-primary/10 p-2 text-primary">{subject.icon}</div>
                                <h3 className="text-lg font-semibold">{subject.subject}</h3>
                            </div>
                            <div className="space-y-4">
                            {subject.difficulties.map(d => (
                                <div key={d.level} className="flex items-center gap-4">
                                    <span className="w-12 text-sm font-medium">{d.level}</span>
                                    <Progress value={d.progress} className="flex-1" />
                                    <span className="w-28 text-right text-sm text-muted-foreground">{d.attempted} quizzes</span>
                                    <span className="w-20 text-right text-sm font-semibold">{d.score > 0 ? `${d.score}% avg` : '-'}</span>
                                </div>
                            ))}
                            </div>
                        </div>
                    ))}
                </CardContent>
            </Card>

            <Card>
                <CardHeader>
                    <CardTitle>Badges Collection</CardTitle>
                    <CardDescription>Celebrate your achievements and unlock new ones.</CardDescription>
                </CardHeader>
                <CardContent className="grid grid-cols-2 gap-4 md:grid-cols-3 lg:grid-cols-4">
                    {allBadges.slice(0, 8).map(badge => (
                        <div key={badge.id} className={`flex flex-col items-center text-center p-4 rounded-lg gap-2 ${studentBadges.includes(badge.id) ? 'bg-accent/10 border-accent/20 border' : 'bg-secondary/50 opacity-60'}`}>
                             <div className={`rounded-full p-3 ${studentBadges.includes(badge.id) ? 'bg-accent/20 text-accent' : 'bg-muted-foreground/20 text-muted-foreground'}`}>
                                {React.cloneElement(badge.icon, { className: "h-8 w-8"})}
                            </div>
                            <p className="font-semibold text-sm">{badge.title}</p>
                            <p className="text-xs text-muted-foreground">{badge.description}</p>
                        </div>
                    ))}
                </CardContent>
            </Card>
        </div>

        <div className="flex flex-col gap-6">
            <Card>
              <CardHeader>
                <div className="flex items-center gap-2">
                    <Bot className="h-6 w-6 text-primary" />
                    <CardTitle>AI Recommendations</CardTitle>
                </div>
              </CardHeader>
              <CardContent className="grid gap-4">
                <div className="flex items-start gap-4 text-sm">
                  <div className="rounded-full bg-primary/10 p-2">
                    <Zap className="h-4 w-4 text-primary" />
                  </div>
                  <div className="flex-1 space-y-1">
                    <p className="font-medium">Unlock "Quiz Master"</p>
                    <p className="text-muted-foreground">
                      You've completed 4 quizzes. Complete 6 more to unlock this badge!
                      <Button variant="link" size="sm" className="h-auto p-0 pl-1">Start a Quiz</Button>
                    </p>
                  </div>
                </div>
                 <div className="flex items-start gap-4 text-sm">
                  <div className="rounded-full bg-primary/10 p-2">
                    <Repeat className="h-4 w-4 text-primary" />
                  </div>
                  <div className="flex-1 space-y-1">
                    <p className="font-medium">Remediation: Hard Maths</p>
                    <p className="text-muted-foreground">
                      Your score in hard math quizzes is a bit low. Try a remediation quiz to strengthen your skills.
                       <Button variant="link" size="sm" className="h-auto p-0 pl-1">Start Remediation</Button>
                    </p>
                  </div>
                </div>
              </CardContent>
            </Card>
            <Card>
                <CardHeader>
                    <CardTitle>Recent Activity</CardTitle>
                </CardHeader>
                <CardContent>
                    <div className="space-y-4">
                        {recentActivities.map((activity) => (
                            <div key={activity.id} className="flex items-start gap-4">
                                <div className="rounded-full bg-background p-2 mt-1">
                                    {activity.icon}
                                </div>
                                <div className="flex-1">
                                    <p className="text-sm font-medium">{activity.title}
                                        {activity.score && <span className="text-muted-foreground font-normal"> ({activity.score})</span>}
                                    </p>
                                    <p className="text-xs text-muted-foreground">{activity.time}</p>
                                </div>
                            </div>
                        ))}
                    </div>
                </CardContent>
            </Card>
        </div>
      </div>
    </div>
  );
}

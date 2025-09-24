import { Badge } from '@/components/ui/badge';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Avatar, AvatarFallback, AvatarImage } from '@/components/ui/avatar';
import { Award, Bot, Flame, Swords, Trophy, Zap } from 'lucide-react';
import { PlaceHolderImages } from '@/lib/placeholder-images';

const quizData = [
  { title: 'Algebra Basics', subject: 'Math', difficulty: 'easy', questions: 10 },
  { title: 'The Cold War', subject: 'History', difficulty: 'medium', questions: 15 },
  { title: 'Cellular Biology', subject: 'Science', difficulty: 'hard', questions: 20 },
];

const leaderboardData = [
  { rank: 1, name: 'Alex', xp: 4500, avatarId: 'leader-1' },
  { rank: 2, name: 'You', xp: 4250, avatarId: 'avatar-1' },
  { rank: 3, name: 'Maria', xp: 3800, avatarId: 'leader-2' },
  { rank: 4, name: 'David', xp: 3550, avatarId: 'leader-3' },
];

export default function StudentDashboard() {
  return (
    <div className="flex flex-col gap-6">
      <div className="flex flex-col gap-2">
        <h1 className="text-3xl font-bold tracking-tight">Student Dashboard</h1>
        <p className="text-muted-foreground">
          Welcome back! Let's continue your learning journey.
        </p>
      </div>

      <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-4">
        <Card className="bg-gradient-to-tr from-primary/10 to-transparent">
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">XP Points</CardTitle>
            <Zap className="h-4 w-4 text-primary" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold text-primary">4,250</div>
            <p className="text-xs text-muted-foreground">+200 this week</p>
          </CardContent>
        </Card>
        <Card className="bg-gradient-to-tr from-accent/10 to-transparent">
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">Streak</CardTitle>
            <Flame className="h-4 w-4 text-accent" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold text-accent">12 days</div>
            <p className="text-xs text-muted-foreground">Keep it going!</p>
          </CardContent>
        </Card>
        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">Badges</CardTitle>
            <Award className="h-4 w-4 text-muted-foreground" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">8</div>
            <p className="text-xs text-muted-foreground">New: "Math Whiz"</p>
          </CardContent>
        </Card>
         <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">Leaderboard Rank</CardTitle>
            <Trophy className="h-4 w-4 text-muted-foreground" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">#2</div>
            <p className="text-xs text-muted-foreground">In Algebra 101</p>
          </CardContent>
        </Card>
      </div>

      <div className="grid grid-cols-1 gap-6 lg:grid-cols-3">
        <div className="flex flex-col gap-6 lg:col-span-2">
          <Card>
            <CardHeader>
              <CardTitle>Active Quizzes</CardTitle>
              <CardDescription>
                Here are the quizzes waiting for you. Good luck!
              </CardDescription>
            </CardHeader>
            <CardContent>
              <div className="space-y-4">
                {quizData.map((quiz) => (
                  <div key={quiz.title} className="flex items-center rounded-lg border p-4">
                    <div className="mr-4 text-primary">
                        <Swords className="h-8 w-8" />
                    </div>
                    <div className="flex-1 space-y-1">
                      <p className="text-sm font-medium leading-none">{quiz.title}</p>
                      <div className="flex items-center gap-2 text-xs text-muted-foreground">
                        <span>{quiz.subject}</span>
                        <Badge variant={quiz.difficulty === 'easy' ? 'secondary' : quiz.difficulty === 'medium' ? 'outline' : 'destructive'} className="capitalize">{quiz.difficulty}</Badge>
                        <span>{quiz.questions} Questions</span>
                      </div>
                    </div>
                    <Button>Start Quiz</Button>
                  </div>
                ))}
              </div>
            </CardContent>
          </Card>
          
           <Card>
              <CardHeader>
                <div className="flex items-center gap-2">
                    <Bot className="h-6 w-6 text-primary" />
                    <CardTitle>Personalized Learning Path</CardTitle>
                </div>
                <CardDescription>
                  AI-suggested topics to help you improve.
                </CardDescription>
              </CardHeader>
              <CardContent className="grid gap-4">
                <div className="flex items-start gap-4 text-sm">
                  <div className="rounded-full bg-primary/10 p-2">
                    <Zap className="h-4 w-4 text-primary" />
                  </div>
                  <div className="flex-1 space-y-1">
                    <p className="font-medium">Focus Area: Algebra</p>
                    <p className="text-muted-foreground">
                      You're doing great! To level up, try focusing on "Linear Equations".
                      <Button variant="link" size="sm" className="h-auto p-0 pl-1">Start Practice</Button>
                    </p>
                  </div>
                </div>
              </CardContent>
            </Card>

        </div>

        <Card>
          <CardHeader>
            <CardTitle>Class Leaderboard</CardTitle>
            <CardDescription>Algebra 101 - Top Performers</CardDescription>
          </CardHeader>
          <CardContent>
            <div className="space-y-4">
              {leaderboardData.map((player) => {
                const avatar = PlaceHolderImages.find(p => p.id === player.avatarId);
                return (
                  <div key={player.rank} className={`flex items-center gap-4 rounded-md p-2 ${player.name === 'You' ? 'bg-primary/10' : ''}`}>
                    <span className="text-lg font-bold text-muted-foreground">{player.rank}</span>
                    <Avatar className="h-10 w-10 border-2 border-primary/50">
                      <AvatarImage src={avatar?.imageUrl} alt={player.name} data-ai-hint={avatar?.imageHint} />
                      <AvatarFallback>{player.name.charAt(0)}</AvatarFallback>
                    </Avatar>
                    <div className="flex-1">
                      <p className="text-sm font-medium">{player.name}</p>
                      <p className="text-xs text-muted-foreground">{player.xp} XP</p>
                    </div>
                    {player.rank === 1 && <Trophy className="h-5 w-5 text-yellow-500" />}
                  </div>
                )
              })}
            </div>
          </CardContent>
        </Card>
      </div>
    </div>
  );
}

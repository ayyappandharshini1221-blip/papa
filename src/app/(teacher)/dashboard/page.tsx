import { Button } from '@/components/ui/button';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { BarChart, Bar, XAxis, YAxis, CartesianGrid, Tooltip, Legend, ResponsiveContainer } from 'recharts';
import { Activity, ArrowUpRight, BookOpen, Bot, PlusCircle, Users, Zap } from 'lucide-react';
import Link from 'next/link';

const classData = [
  { name: 'Algebra 101', students: 32, progress: 75 },
  { name: 'US History', students: 28, progress: 60 },
  { name: 'Biology Prep', students: 22, progress: 85 },
];

const analyticsData = [
  { name: 'Algebra', 'Avg. Score': 82 },
  { name: 'History', 'Avg. Score': 76 },
  { name: 'Biology', 'Avg. Score': 88 },
  { name: 'Literature', 'Avg. Score': 72 },
];

export default function TeacherDashboard() {
  return (
    <div className="flex flex-col gap-6">
      <div className="flex flex-col gap-2">
        <h1 className="text-3xl font-bold tracking-tight">Teacher Dashboard</h1>
        <p className="text-muted-foreground">
          Here's an overview of your classes and student performance.
        </p>
      </div>

      <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-4">
        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">
              Total Students
            </CardTitle>
            <Users className="h-4 w-4 text-muted-foreground" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">128</div>
            <p className="text-xs text-muted-foreground">
              +5 since last week
            </p>
          </CardContent>
        </Card>
        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">
              Active Classes
            </CardTitle>
            <BookOpen className="h-4 w-4 text-muted-foreground" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">3</div>
            <p className="text-xs text-muted-foreground">
              Algebra 101 is most active
            </p>
          </CardContent>
        </Card>
        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">Avg. Quiz Score</CardTitle>
            <Zap className="h-4 w-4 text-muted-foreground" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">81%</div>
            <p className="text-xs text-muted-foreground">
              +2.1% from last month
            </p>
          </CardContent>
        </Card>
        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">Recent Activity</CardTitle>
            <Activity className="h-4 w-4 text-muted-foreground" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">+57</div>
            <p className="text-xs text-muted-foreground">
              quizzes completed today
            </p>
          </CardContent>
        </Card>
      </div>

      <div className="grid grid-cols-1 gap-6 lg:grid-cols-3">
        <Card className="lg:col-span-2">
          <CardHeader className="flex flex-row items-center">
            <div className="grid gap-2">
              <CardTitle>My Classes</CardTitle>
              <CardDescription>
                Manage your classes, assign quizzes, and view progress.
              </CardDescription>
            </div>
            <Button asChild size="sm" className="ml-auto gap-1">
              <Link href="#">
                <PlusCircle className="h-4 w-4" />
                New Class
              </Link>
            </Button>
          </CardHeader>
          <CardContent>
            <div className="space-y-4">
              {classData.map((c) => (
                <div key={c.name} className="flex items-center">
                  <div className="ml-4 flex-1 space-y-1">
                    <p className="text-sm font-medium leading-none">{c.name}</p>
                    <p className="text-sm text-muted-foreground">{c.students} students</p>
                  </div>
                  <Button variant="outline" size="sm">
                    Manage
                  </Button>
                </div>
              ))}
            </div>
          </CardContent>
        </Card>

        <Card>
          <CardHeader>
            <div className="flex items-center gap-2">
              <Bot className="h-6 w-6 text-primary" />
              <CardTitle>AI Assistant</CardTitle>
            </div>
            <CardDescription>
              Personalized recommendations for your classes.
            </CardDescription>
          </CardHeader>
          <CardContent className="grid gap-4">
            <div className="flex items-start gap-4 text-sm">
              <div className="rounded-full bg-primary/10 p-2">
                <Zap className="h-4 w-4 text-primary" />
              </div>
              <div className="flex-1 space-y-1">
                <p className="font-medium">Remediation Opportunity</p>
                <p className="text-muted-foreground">
                  Students in <span className="font-semibold">US History</span> are struggling with the Civil War era.
                  <Button variant="link" size="sm" className="h-auto p-0 pl-1">Assign a remediation quiz?</Button>
                </p>
              </div>
            </div>
            <div className="flex items-start gap-4 text-sm">
              <div className="rounded-full bg-primary/10 p-2">
                <BarChart3 className="h-4 w-4 text-primary" />
              </div>
              <div className="flex-1 space-y-1">
                <p className="font-medium">New Learning Path</p>
                <p className="text-muted-foreground">
                  Create a learning path for <span className="font-semibold">Algebra 101</span> focusing on quadratic equations.
                   <Button variant="link" size="sm" className="h-auto p-0 pl-1">Generate path.</Button>
                </p>
              </div>
            </div>
          </CardContent>
        </Card>
      </div>

       <Card>
        <CardHeader>
          <CardTitle>Class Performance Overview</CardTitle>
          <CardDescription>Average quiz scores by subject across all classes.</CardDescription>
        </CardHeader>
        <CardContent>
          <ResponsiveContainer width="100%" height={300}>
            <BarChart data={analyticsData}>
              <CartesianGrid strokeDasharray="3 3" />
              <XAxis dataKey="name" />
              <YAxis />
              <Tooltip />
              <Legend />
              <Bar dataKey="Avg. Score" fill="hsl(var(--primary))" />
            </BarChart>
          </ResponsiveContainer>
        </CardContent>
      </Card>
    </div>
  );
}

'use client';

import { Button } from '@/components/ui/button';
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from '@/components/ui/card';
import {
  BarChart as BarChartIcon,
  BarChart3,
  BookOpen,
  Bot,
  PlusCircle,
  Users,
  Zap,
  Activity,
  Loader2,
} from 'lucide-react';
import {
  BarChart,
  Bar,
  XAxis,
  YAxis,
  CartesianGrid,
  Tooltip,
  Legend,
  ResponsiveContainer,
} from 'recharts';
import Link from 'next/link';
import { useTeacherData } from '@/hooks/use-teacher-data';
import { Student } from '@/lib/types';
import { useMemo } from 'react';

export default function TeacherDashboard() {
  const { teacher, classes, students, loading } = useTeacherData();

  const totalStudents = useMemo(() => {
    const studentIds = new Set();
    classes.forEach(c => c.studentIds.forEach(id => studentIds.add(id)));
    return studentIds.size;
  }, [classes]);

  const analyticsData = useMemo(() => {
    const subjects: { [key: string]: { totalScore: number; count: number } } = {};
    // This is a placeholder for quiz results which are not yet in the data model.
    // We will simulate some data for now.
    const allStudents: Student[] = Object.values(students).flat();
    if (allStudents.length === 0) return [];
    
    // Mocked subjects for demonstration
    const mockSubjects = ['Maths', 'Python', 'Chemistry', 'Biology'];
    
    return mockSubjects.map(subject => ({
      name: subject,
      'Avg. Score': Math.floor(Math.random() * (95 - 60 + 1)) + 60, // Random score between 60 and 95
    }));

  }, [students]);

  if (loading) {
    return (
      <div className="flex h-full items-center justify-center">
        <Loader2 className="h-12 w-12 animate-spin text-primary" />
      </div>
    );
  }

  return (
    <div className="flex flex-col gap-6">
      <div className="flex flex-col gap-2">
        <h1 className="text-3xl font-bold tracking-tight">
          Teacher Dashboard
        </h1>
        <p className="text-muted-foreground">
          Welcome back, {teacher?.name}! Here's an overview of your classes.
        </p>
      </div>

      <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-4">
        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">Total Students</CardTitle>
            <Users className="h-4 w-4 text-muted-foreground" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">{totalStudents}</div>
            <p className="text-xs text-muted-foreground">Across all classes</p>
          </CardContent>
        </Card>
        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">Active Classes</CardTitle>
            <BookOpen className="h-4 w-4 text-muted-foreground" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">{classes.length}</div>
            <p className="text-xs text-muted-foreground">
              {classes.length > 0 ? `${classes[0].name} is most active` : 'No classes yet'}
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
              <Link href="/teacher/classes">
                <PlusCircle className="h-4 w-4" />
                New Class
              </Link>
            </Button>
          </CardHeader>
          <CardContent>
            <div className="space-y-4">
              {classes.map((c) => (
                <div key={c.id} className="flex items-center">
                  <div className="ml-4 flex-1 space-y-1">
                    <p className="text-sm font-medium leading-none">{c.name}</p>
                    <p className="text-sm text-muted-foreground">
                      {c.studentIds.length} student{c.studentIds.length !== 1 ? 's' : ''}
                    </p>
                  </div>
                  <Button asChild variant="outline" size="sm">
                    <Link href="/teacher/classes">Manage</Link>
                  </Button>
                </div>
              ))}
               {classes.length === 0 && (
                <p className="text-center text-sm text-muted-foreground">You haven't created any classes yet.</p>
              )}
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
                  Students in <span className="font-semibold">US History</span>{' '}
                  are struggling with the Civil War era.
                  <Button variant="link" size="sm" className="h-auto p-0 pl-1">
                    Assign a remediation quiz?
                  </Button>
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
                  Create a learning path for{' '}
                  <span className="font-semibold">Algebra 101</span> focusing
                  on quadratic equations.
                  <Button variant="link" size="sm" className="h-auto p-0 pl-1">
                    Generate path.
                  </Button>
                </p>
              </div>
            </div>
          </CardContent>
        </Card>
      </div>

      <Card>
        <CardHeader>
          <CardTitle>Class Performance Overview</CardTitle>
          <CardDescription>
            Average quiz scores by subject across all classes.
          </CardDescription>
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

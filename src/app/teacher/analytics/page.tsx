'use client';

import { useMemo } from 'react';
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from '@/components/ui/card';
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from '@/components/ui/table';
import { Avatar, AvatarFallback, AvatarImage } from '@/components/ui/avatar';
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
import { Award, Flame, Loader2, Users, Zap } from 'lucide-react';

import { useTeacherData } from '@/hooks/use-teacher-data';
import { Student } from '@/lib/types';
import { PlaceHolderImages } from '@/lib/placeholder-images';

export default function AnalyticsPage() {
  const { classes, students, loading } = useTeacherData();

  const allStudents: Student[] = useMemo(() => {
    const studentMap = new Map<string, Student>();
    Object.values(students).flat().forEach(student => {
        studentMap.set(student.id, student);
    });
    return Array.from(studentMap.values());
  }, [students]);

  const studentsWithClassNames = useMemo(() => {
    return Object.entries(students).flatMap(([classId, studentList]) => {
      const className = classes.find(c => c.id === classId)?.name || 'Unknown Class';
      return studentList.map(student => ({ ...student, className }));
    });
  }, [students, classes]);


  const overallStats = useMemo(() => {
    if (allStudents.length === 0) {
      return { totalXP: 0, avgXP: 0, avgStreak: 0, totalBadges: 0 };
    }
    const totalXP = allStudents.reduce((acc, s) => acc + s.xp, 0);
    const totalStreak = allStudents.reduce((acc, s) => acc + s.streak, 0);
    const totalBadges = allStudents.reduce((acc, s) => acc + s.badges.length, 0);

    return {
      totalXP,
      avgXP: Math.round(totalXP / allStudents.length),
      avgStreak: (totalStreak / allStudents.length).toFixed(1),
      totalBadges,
    };
  }, [allStudents]);

  const xpDistributionData = useMemo(() => {
     const bins = [
      { name: '0-500', count: 0 },
      { name: '501-1000', count: 0 },
      { name: '1001-2000', count: 0 },
      { name: '2001-5000', count: 0 },
      { name: '5000+', count: 0 },
    ];

    allStudents.forEach(s => {
      if (s.xp <= 500) bins[0].count++;
      else if (s.xp <= 1000) bins[1].count++;
      else if (s.xp <= 2000) bins[2].count++;
      else if (s.xp <= 5000) bins[3].count++;
      else bins[4].count++;
    });
    
    return bins;
  }, [allStudents]);


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
        <h1 className="text-3xl font-bold tracking-tight">Analytics</h1>
        <p className="text-muted-foreground">
          Insights into your students' performance and engagement.
        </p>
      </div>

       <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-4">
        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">Total Students</CardTitle>
            <Users className="h-4 w-4 text-muted-foreground" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">{allStudents.length}</div>
            <p className="text-xs text-muted-foreground">Across all your classes</p>
          </CardContent>
        </Card>
        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">Average XP</CardTitle>
            <Zap className="h-4 w-4 text-muted-foreground" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">{overallStats.avgXP}</div>
            <p className="text-xs text-muted-foreground">Per student</p>
          </CardContent>
        </Card>
        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">Average Streak</CardTitle>
            <Flame className="h-4 w-4 text-muted-foreground" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">{overallStats.avgStreak}</div>
             <p className="text-xs text-muted-foreground">Days per student</p>
          </CardContent>
        </Card>
         <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">Total Badges</CardTitle>
            <Award className="h-4 w-4 text-muted-foreground" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">{overallStats.totalBadges}</div>
             <p className="text-xs text-muted-foreground">Earned by all students</p>
          </CardContent>
        </Card>
      </div>

      <Card>
        <CardHeader>
          <CardTitle>Student XP Distribution</CardTitle>
          <CardDescription>
            How students are grouped based on their experience points.
          </CardDescription>
        </CardHeader>
        <CardContent>
          <ResponsiveContainer width="100%" height={300}>
            <BarChart data={xpDistributionData}>
              <CartesianGrid strokeDasharray="3 3" />
              <XAxis dataKey="name" />
              <YAxis allowDecimals={false} />
              <Tooltip />
              <Legend />
              <Bar dataKey="count" fill="hsl(var(--primary))" name="Number of Students" />
            </BarChart>
          </ResponsiveContainer>
        </CardContent>
      </Card>

      <Card>
          <CardHeader>
            <CardTitle>All Students Overview</CardTitle>
            <CardDescription>
              Detailed view of every student across all your classes.
            </CardDescription>
          </CardHeader>
          <CardContent>
            <Table>
              <TableHeader>
                <TableRow>
                  <TableHead>Student</TableHead>
                  <TableHead>Class</TableHead>
                  <TableHead className='text-center'>XP</TableHead>
                  <TableHead className='text-center'>Streak</TableHead>
                  <TableHead className='text-center'>Badges</TableHead>
                </TableRow>
              </TableHeader>
              <TableBody>
                {studentsWithClassNames.length > 0 ? (
                  studentsWithClassNames.map((student) => {
                     const avatar = PlaceHolderImages.find(
                          (p) => p.id === 'avatar-1'
                        );
                    return (
                    <TableRow key={student.id}>
                      <TableCell>
                         <div className="flex items-center gap-3">
                                <Avatar className="h-9 w-9">
                                  <AvatarImage
                                    src={student.avatarUrl || avatar?.imageUrl}
                                    alt={student.name}
                                    data-ai-hint={avatar?.imageHint}
                                  />
                                  <AvatarFallback>
                                    {student.name.charAt(0)}
                                  </AvatarFallback>
                                </Avatar>
                                <span className="font-medium">
                                  {student.name}
                                </span>
                              </div>
                      </TableCell>
                       <TableCell>{student.className}</TableCell>
                      <TableCell className="text-center font-medium text-primary">{student.xp}</TableCell>
                      <TableCell className="text-center font-medium text-accent">{student.streak}</TableCell>
                      <TableCell className="text-center font-medium">{student.badges.length}</TableCell>
                    </TableRow>
                  )})
                ) : (
                  <TableRow>
                    <TableCell
                      colSpan={5}
                      className="h-24 text-center text-muted-foreground"
                    >
                      No student data available.
                    </TableCell>
                  </TableRow>
                )}
              </TableBody>
            </Table>
          </CardContent>
        </Card>
    </div>
  );
}

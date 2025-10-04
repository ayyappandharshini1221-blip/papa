'use client';

import { useState, useEffect } from 'react';
import { Badge } from '@/components/ui/badge';
import { Button } from '@/components/ui/button';
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from '@/components/ui/card';
import { Avatar, AvatarFallback, AvatarImage } from '@/components/ui/avatar';
import {
  Award,
  Bot,
  Flame,
  PlusCircle,
  Trophy,
  Zap,
  Map,
  ChevronRight,
  BookOpen,
} from 'lucide-react';
import { PlaceHolderImages } from '@/lib/placeholder-images';
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from '@/components/ui/dialog';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import {
  arrayUnion,
  doc,
  getDoc,
  updateDoc,
  query,
  collection,
  where,
  getDocs,
  DocumentData,
  or,
} from 'firebase/firestore';
import { getDb } from '@/lib/firebase';
import { useToast } from '@/hooks/use-toast';
import { errorEmitter } from '@/firebase/error-emitter';
import { FirestorePermissionError } from '@/firebase/errors';
import { useStudentData } from '@/hooks/use-student-data';
import { useLeaderboard } from '@/hooks/use-leaderboard';
import { onAuthChange } from '@/lib/auth/auth';
import type { User } from '@/lib/types';
import Candy from '@/components/ui/candy';
import { Progress } from '@/components/ui/progress';
import Link from 'next/link';

export default function StudentDashboard() {
  const [openJoinClass, setOpenJoinClass] = useState(false);
  const [inviteCode, setInviteCode] = useState('');
  const [isJoining, setIsJoining] = useState(false);
  const { toast } = useToast();
  const [user, setUser] = useState<User | null>(null);
  const { student, classes, loading: studentLoading } = useStudentData();
  const { leaderboardData, loading: leaderboardLoading } = useLeaderboard(
    student?.classIds?.[0]
  );
  const [showCandy, setShowCandy] = useState(true);

  useEffect(() => {
    const unsubscribe = onAuthChange(setUser);
    const timer = setTimeout(() => setShowCandy(false), 5000); // Let it rain for 5 seconds
    return () => {
      unsubscribe();
      clearTimeout(timer);
    };
  }, []);

  const handleJoinClass = async () => {
    const db = getDb();
    const codeOrName = inviteCode.trim();
    if (!codeOrName) {
      toast({
        title: 'Please enter a class name or invite code.',
        variant: 'destructive',
      });
      return;
    }
    if (!user) {
      toast({
        title: 'You must be logged in to join a class.',
        variant: 'destructive',
      });
      return;
    }
    setIsJoining(true);

    try {
      const classesRef = collection(db, 'classes');
      const q = query(
        classesRef,
        or(where('inviteCode', '==', codeOrName), where('name', '==', codeOrName))
      );
      const querySnapshot = await getDocs(q);

      if (querySnapshot.empty) {
        toast({
          title: 'Invalid class name or invite code.',
          description: 'Please check it and try again.',
          variant: 'destructive',
        });
        setIsJoining(false);
        return;
      }

      const classDoc = querySnapshot.docs[0];
      const classId = classDoc.id;

      const studentDocRef = doc(db, 'users', user.id);

      updateDoc(studentDocRef, {
        classIds: arrayUnion(classId),
      }).catch((serverError) => {
        const permissionError = new FirestorePermissionError({
          path: studentDocRef.path,
          operation: 'update',
          requestResourceData: { classIds: arrayUnion(classId) },
        });
        errorEmitter.emit('permission-error', permissionError);
      });

      const classDocRef = doc(db, 'classes', classId);
      updateDoc(classDocRef, {
        studentIds: arrayUnion(user.id),
      }).catch((serverError) => {
        const permissionError = new FirestorePermissionError({
          path: classDocRef.path,
          operation: 'update',
          requestResourceData: { studentIds: arrayUnion(user.id) },
        });
        errorEmitter.emit('permission-error', permissionError);
      });

      toast({ title: `Successfully joined ${classDoc.data().name}!` });
      setOpenJoinClass(false);
      setInviteCode('');
    } catch (error) {
      console.error('Error joining class: ', error);
      toast({
        title: 'Failed to join class.',
        description: (error as Error).message,
        variant: 'destructive',
      });
    } finally {
      setIsJoining(false);
    }
  };

  const yourRank = leaderboardData.find(
    (entry) => entry.studentId === student?.id
  )?.rank;

  const xp = student?.xp ?? 0;
  const level = Math.floor(xp / 500) + 1;
  const xpForCurrentLevel = (level - 1) * 500;
  const xpForNextLevel = level * 500;
  const xpProgress = ((xp - xpForCurrentLevel) / 500) * 100;

  return (
    <div className="flex flex-col gap-6">
      {showCandy && <Candy />}
      <div className="flex flex-col gap-2">
        <h1 className="text-3xl font-bold tracking-tight">
          Let's Go, {student?.name}! 🚀
        </h1>
        <p className="text-muted-foreground">
          Time to crush some quizzes and climb the ranks.
        </p>
      </div>

      <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-4">
        <Card className="relative overflow-hidden bg-gradient-to-br from-primary to-primary/70 text-primary-foreground shadow-lg">
          <Zap className="absolute -right-4 -top-4 h-24 w-24 text-white/10" />
          <CardHeader>
            <CardTitle className="flex items-center gap-2">
              Level {level} Explorer
            </CardTitle>
          </CardHeader>
          <CardContent>
            <div className="text-3xl font-bold">{xp} XP</div>
            <Progress
              value={xpProgress}
              className="mt-2 h-2 bg-white/20 [&>div]:bg-white"
            />
            <p className="mt-1 text-xs opacity-80">
              {xpForNextLevel - xp} XP to next level
            </p>
          </CardContent>
        </Card>
        <Card className="relative overflow-hidden bg-gradient-to-br from-accent to-accent/70 text-accent-foreground shadow-lg">
          <Flame className="absolute -right-4 -top-4 h-24 w-24 text-white/10" />
          <CardHeader>
            <CardTitle className="text-sm font-medium">Streak</CardTitle>
          </CardHeader>
          <CardContent>
            <div className="text-3xl font-bold">{student?.streak ?? 0} days</div>
            <p className="text-xs opacity-80">Keep the fire burning!</p>
          </CardContent>
        </Card>
        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">Badges</CardTitle>
            <Award className="h-4 w-4 text-muted-foreground" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">
              {student?.badges?.length ?? 0}
            </div>
            <p className="text-xs text-muted-foreground">New: "Math Whiz"</p>
          </CardContent>
        </Card>
        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">
              Leaderboard Rank
            </CardTitle>
            <Trophy className="h-4 w-4 text-muted-foreground" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">
              {yourRank ? `#${yourRank}` : '-'}
            </div>
            <p className="text-xs text-muted-foreground">
              {classes.length > 0
                ? `In ${classes[0].name}`
                : 'No class joined'}
            </p>
          </CardContent>
        </Card>
      </div>

      <div className="grid grid-cols-1 gap-6 lg:grid-cols-3">
        <div className="flex flex-col gap-6 lg:col-span-2">
          <Card>
            <CardHeader className="flex flex-row items-center justify-between">
              <CardTitle>My Classes</CardTitle>
              <Dialog open={openJoinClass} onOpenChange={setOpenJoinClass}>
                <DialogTrigger asChild>
                  <Button size="sm">
                    <PlusCircle className="mr-2 h-4 w-4" />
                    Join a Class
                  </Button>
                </DialogTrigger>
                <DialogContent>
                  <DialogHeader>
                    <DialogTitle>Join a new class</DialogTitle>
                    <DialogDescription>
                      Enter the invite code or the exact class name from your
                      teacher to join.
                    </DialogDescription>
                  </DialogHeader>
                  <div className="grid gap-4 py-4">
                    <div className="grid grid-cols-4 items-center gap-4">
                      <Label htmlFor="invite-code" className="text-right">
                        Code or Name
                      </Label>
                      <Input
                        id="invite-code"
                        className="col-span-3"
                        placeholder="e.g., ALG101-XYZ or Algebra 101"
                        value={inviteCode}
                        onChange={(e) => setInviteCode(e.target.value)}
                      />
                    </div>
                  </div>
                  <DialogFooter>
                    <Button onClick={handleJoinClass} disabled={isJoining}>
                      {isJoining ? 'Joining...' : 'Join Class'}
                    </Button>
                  </DialogFooter>
                </DialogContent>
              </Dialog>
            </CardHeader>
            <CardContent>
              {studentLoading ? (
                <p>Loading classes...</p>
              ) : (
                <div className="space-y-4">
                  {classes.length > 0 ? (
                    classes.map((c) => (
                      <Link href="/student/quizzes" key={c.id}>
                        <div className="group flex items-center rounded-lg border p-4 transition-all hover:border-primary/50 hover:bg-primary/5">
                          <div className="rounded-full bg-primary/10 p-3 text-primary">
                            <BookOpen className="h-6 w-6" />
                          </div>
                          <div className="ml-4 flex-1">
                            <p className="font-semibold">{c.name}</p>
                            <p className="text-sm text-muted-foreground">
                              View Quizzes
                            </p>
                          </div>
                          <ChevronRight className="h-5 w-5 text-muted-foreground transition-transform group-hover:translate-x-1" />
                        </div>
                      </Link>
                    ))
                  ) : (
                    <div className="py-8 text-center">
                      <p className="font-semibold">No classes yet!</p>
                      <p className="text-sm text-muted-foreground">
                        Click "Join a Class" to get started.
                      </p>
                    </div>
                  )}
                </div>
              )}
            </CardContent>
          </Card>

          <Card className="group border-2 border-transparent bg-gradient-to-br from-card to-card hover:border-accent">
            <CardHeader>
              <div className="flex items-center gap-3">
                <div className="rounded-lg bg-accent/10 p-3 text-accent">
                  <Map className="h-6 w-6" />
                </div>
                <CardTitle>Your Daily Quest</CardTitle>
              </div>
              <CardDescription>
                AI-suggested topics to help you improve and earn bonus XP.
              </CardDescription>
            </CardHeader>
            <CardContent className="grid gap-4">
              <div className="flex items-center gap-4 rounded-lg bg-background p-4">
                <div className="rounded-full bg-primary/10 p-2">
                  <Zap className="h-5 w-5 text-primary" />
                </div>
                <div className="flex-1 space-y-1">
                  <p className="font-medium">Focus Area: Algebra</p>
                  <p className="text-sm text-muted-foreground">
                    Master "Linear Equations" to earn a treasure chest of XP!
                  </p>
                </div>
                <Button asChild variant="secondary" size="sm">
                  <Link href="/student/quizzes">
                    Start Quest
                    <ChevronRight className="ml-1 h-4 w-4" />
                  </Link>
                </Button>
              </div>
            </CardContent>
          </Card>
        </div>

        <Card>
          <CardHeader>
            <CardTitle>Class Leaderboard</CardTitle>
            <CardDescription>
              {classes.length > 0
                ? `${classes[0].name} - Top Performers`
                : 'Join a class to see the leaderboard'}
            </CardDescription>
          </CardHeader>
          <CardContent>
            {leaderboardLoading ? (
              <p>Loading leaderboard...</p>
            ) : (
              <div className="space-y-2">
                {leaderboardData.map((player, index) => {
                  const avatar = PlaceHolderImages.find(
                    (p) => p.id === player.avatarId
                  );
                  return (
                    <div
                      key={player.rank}
                      className={`flex items-center gap-4 rounded-lg p-3 ${
                        player.studentId === student?.id
                          ? 'border-2 border-primary bg-primary/10'
                          : 'bg-background/50'
                      }`}
                    >
                      <span
                        className={`text-xl font-black ${
                          index === 0 ? 'text-gold' : 'text-muted-foreground'
                        }`}
                      >
                        {player.rank}
                      </span>
                      <Avatar className="h-10 w-10 border-2 border-primary/50">
                        <AvatarImage
                          src={avatar?.imageUrl}
                          alt={player.studentName}
                          data-ai-hint={avatar?.imageHint}
                        />
                        <AvatarFallback>
                          {player.studentName.charAt(0)}
                        </AvatarFallback>
                      </Avatar>
                      <div className="flex-1">
                        <p className="text-sm font-medium">
                          {player.studentName}
                          {player.studentId === student?.id && ' (You)'}
                        </p>
                        <p className="text-xs text-muted-foreground">
                          {player.xp} XP
                        </p>
                      </div>
                      {player.rank === 1 && (
                        <Trophy className="h-6 w-6 text-gold drop-shadow-[0_0_5px_hsl(var(--gold))] animate-pulse" />
                      )}
                    </div>
                  );
                })}
              </div>
            )}
          </CardContent>
        </Card>
      </div>
    </div>
  );
}

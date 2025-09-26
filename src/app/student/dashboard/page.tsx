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
import { arrayUnion, doc, getDoc, updateDoc, query, collection, where, getDocs, DocumentData, or } from 'firebase/firestore';
import { getDb } from '@/lib/firebase';
import { useToast } from '@/hooks/use-toast';
import { errorEmitter } from '@/firebase/error-emitter';
import { FirestorePermissionError } from '@/firebase/errors';
import { useStudentData } from '@/hooks/use-student-data';
import { useLeaderboard } from '@/hooks/use-leaderboard';
import { onAuthChange } from '@/lib/auth/auth';
import type { User } from '@/lib/types';

export default function StudentDashboard() {
  const [openJoinClass, setOpenJoinClass] = useState(false);
  const [inviteCode, setInviteCode] = useState('');
  const [isJoining, setIsJoining] = useState(false);
  const { toast } = useToast();
  const [user, setUser] = useState<User | null>(null);
  const { student, classes, loading: studentLoading } = useStudentData();
  const { leaderboardData, loading: leaderboardLoading } = useLeaderboard(student?.classIds?.[0]);

  useEffect(() => {
    const unsubscribe = onAuthChange(setUser);
    return () => unsubscribe();
  }, []);

  const handleJoinClass = async () => {
    const db = getDb();
    const codeOrName = inviteCode.trim();
    if (!codeOrName) {
      toast({ title: 'Please enter a class name or invite code.', variant: 'destructive' });
      return;
    }
    if (!user) {
      toast({ title: 'You must be logged in to join a class.', variant: 'destructive' });
      return;
    }
    setIsJoining(true);

    try {
      const classesRef = collection(db, "classes");
      const q = query(classesRef, or(where("inviteCode", "==", codeOrName), where("name", "==", codeOrName)));
      const querySnapshot = await getDocs(q);

      if (querySnapshot.empty) {
        toast({ title: 'Invalid class name or invite code.', description: 'Please check it and try again.', variant: 'destructive' });
        setIsJoining(false);
        return;
      }

      // In a real-world scenario with many classes of the same name, you might need to let the user choose.
      // For now, we'll just join the first one found.
      const classDoc = querySnapshot.docs[0];
      const classId = classDoc.id;
      
      const studentDocRef = doc(db, 'users', user.id);
      
      updateDoc(studentDocRef, {
        classIds: arrayUnion(classId)
      }).catch(serverError => {
        const permissionError = new FirestorePermissionError({
          path: studentDocRef.path,
          operation: 'update',
          requestResourceData: { classIds: arrayUnion(classId) },
        });
        errorEmitter.emit('permission-error', permissionError);
      });
      
      const classDocRef = doc(db, 'classes', classId);
      updateDoc(classDocRef, {
          studentIds: arrayUnion(user.id)
      }).catch(serverError => {
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
      console.error("Error joining class: ", error);
      toast({ title: 'Failed to join class.', description: (error as Error).message, variant: 'destructive' });
    } finally {
      setIsJoining(false);
    }
  };

  const yourRank = leaderboardData.find(entry => entry.studentId === student?.id)?.rank;

  return (
    <div className="flex flex-col gap-6">
      <div className="flex flex-col gap-2">
        <h1 className="text-3xl font-bold tracking-tight">Student Dashboard</h1>
        <p className="text-muted-foreground">
          Welcome back, {student?.name}! Let's continue your learning journey.
        </p>
      </div>

      <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-4">
        <Card className="bg-gradient-to-tr from-primary/10 to-transparent">
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">XP Points</CardTitle>
            <Zap className="h-4 w-4 text-primary" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold text-primary">{student?.xp ?? 0}</div>
            <p className="text-xs text-muted-foreground">+200 this week</p>
          </CardContent>
        </Card>
        <Card className="bg-gradient-to-tr from-accent/10 to-transparent">
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">Streak</CardTitle>
            <Flame className="h-4 w-4 text-accent" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold text-accent">{student?.streak ?? 0} days</div>
            <p className="text-xs text-muted-foreground">Keep it going!</p>
          </CardContent>
        </Card>
        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">Badges</CardTitle>
            <Award className="h-4 w-4 text-muted-foreground" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">{student?.badges?.length ?? 0}</div>
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
            <div className="text-2xl font-bold">{yourRank ? `#${yourRank}` : '-'}</div>
            <p className="text-xs text-muted-foreground">{classes.length > 0 ? `In ${classes[0].name}` : 'No class joined'}</p>
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
                  <Button size="sm" variant="outline">
                    <PlusCircle className="mr-2 h-4 w-4" />
                    Join a Class
                  </Button>
                </DialogTrigger>
                <DialogContent>
                  <DialogHeader>
                    <DialogTitle>Join a new class</DialogTitle>
                    <DialogDescription>
                      Enter the invite code or the exact class name from your teacher to join.
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
              {studentLoading ? <p>Loading classes...</p> : (
                <div className="space-y-4">
                  {classes.length > 0 ? (
                    classes.map(c => (
                      <div key={c.id} className="p-2 border rounded-md">
                        <p className="font-semibold">{c.name}</p>
                        <p className="text-sm text-muted-foreground">
                          You are enrolled in this class.
                        </p>
                      </div>
                    ))
                  ) : (
                    <p className="text-sm text-muted-foreground text-center">You haven't joined any classes yet.</p>
                  )}
                </div>
              )}
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
                    You're doing great! To level up, try focusing on "Linear
                    Equations".
                    <Button
                      variant="link"
                      size="sm"
                      className="h-auto p-0 pl-1"
                    >
                      Start Practice
                    </Button>
                  </p>
                </div>
              </div>
            </CardContent>
          </Card>
        </div>

        <Card>
          <CardHeader>
            <CardTitle>Class Leaderboard</CardTitle>
            <CardDescription>{classes.length > 0 ? `${classes[0].name} - Top Performers` : 'Join a class to see the leaderboard'}</CardDescription>
          </CardHeader>
          <CardContent>
            {leaderboardLoading ? <p>Loading leaderboard...</p> : (
              <div className="space-y-4">
                {leaderboardData.map((player) => {
                  const avatar = PlaceHolderImages.find(
                    (p) => p.id === player.avatarId
                  );
                  return (
                    <div
                      key={player.rank}
                      className={`flex items-center gap-4 rounded-md p-2 ${
                        player.studentName === student?.name ? 'bg-primary/10' : ''
                      }`}
                    >
                      <span className="text-lg font-bold text-muted-foreground">
                        {player.rank}
                      </span>
                      <Avatar className="h-10 w-10 border-2 border-primary/50">
                        <AvatarImage
                          src={avatar?.imageUrl}
                          alt={player.studentName}
                          data-ai-hint={avatar?.imageHint}
                        />
                        <AvatarFallback>{player.studentName.charAt(0)}</AvatarFallback>
                      </Avatar>
                      <div className="flex-1">
                        <p className="text-sm font-medium">{player.studentName}{player.studentId === student?.id && ' (You)'}</p>
                        <p className="text-xs text-muted-foreground">
                          {player.xp} XP
                        </p>
                      </div>
                      {player.rank === 1 && (
                        <Trophy className="h-5 w-5 text-yellow-500" />
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

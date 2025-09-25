'use client';

import { useState } from 'react';
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from '@/components/ui/table';
import { Badge } from '@/components/ui/badge';
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
  PlusCircle,
  Users,
  Clipboard,
  ClipboardCheck,
  Loader2,
} from 'lucide-react';
import { Avatar, AvatarFallback, AvatarImage } from '@/components/ui/avatar';
import { PlaceHolderImages } from '@/lib/placeholder-images';
import { addDoc, collection } from 'firebase/firestore';
import { db } from '@/lib/firebase';
import { useToast } from '@/hooks/use-toast';
import { errorEmitter } from '@/firebase/error-emitter';
import { FirestorePermissionError } from '@/firebase/errors';
import { useTeacherData } from '@/hooks/use-teacher-data';

export default function ClassesPage() {
  const { teacher, classes, students, loading } = useTeacherData();
  const [newClassName, setNewClassName] = useState('');
  const [isCreating, setIsCreating] = useState(false);
  const [openDialog, setOpenDialog] = useState(false);
  const [copiedCode, setCopiedCode] = useState<string | null>(null);
  const { toast } = useToast();

  const handleCreateClass = async () => {
    if (!newClassName.trim() || !teacher) return;
    setIsCreating(true);

    const inviteCode = `${newClassName
      .slice(0, 4)
      .toUpperCase()}-${Math.random().toString(36).substr(2, 3)}`;

    try {
      const newClassData = {
        name: newClassName,
        studentIds: [],
        inviteCode: inviteCode,
        teacherId: teacher.id,
      };

      const classesCollection = collection(db, 'classes');

      await addDoc(classesCollection, newClassData).catch((serverError) => {
        const permissionError = new FirestorePermissionError({
          path: classesCollection.path,
          operation: 'create',
          requestResourceData: newClassData,
        });
        errorEmitter.emit('permission-error', permissionError);
      });
      toast({ title: 'Class created successfully!' });
      // The `useTeacherData` hook will automatically update the UI
    } catch (error) {
      console.error('Error creating class:', error);
      toast({
        title: 'Error creating class',
        description: (error as Error).message,
        variant: 'destructive',
      });
    } finally {
      setIsCreating(false);
      setNewClassName('');
      setOpenDialog(false);
    }
  };

  const handleCopyCode = (code: string) => {
    navigator.clipboard.writeText(code);
    setCopiedCode(code);
    setTimeout(() => setCopiedCode(null), 2000);
  };

  return (
    <div className="flex flex-col gap-6">
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-3xl font-bold tracking-tight">My Classes</h1>
          <p className="text-muted-foreground">
            Create and manage your classes here.
          </p>
        </div>
        <Dialog open={openDialog} onOpenChange={setOpenDialog}>
          <DialogTrigger asChild>
            <Button>
              <PlusCircle className="mr-2 h-4 w-4" />
              Create Class
            </Button>
          </DialogTrigger>
          <DialogContent>
            <DialogHeader>
              <DialogTitle>Create a New Class</DialogTitle>
              <DialogDescription>
                Enter a name for your new class. An invite code will be
                generated automatically.
              </DialogDescription>
            </DialogHeader>
            <div className="grid gap-4 py-4">
              <div className="grid grid-cols-4 items-center gap-4">
                <Label htmlFor="name" className="text-right">
                  Class Name
                </Label>
                <Input
                  id="name"
                  value={newClassName}
                  onChange={(e) => setNewClassName(e.target.value)}
                  className="col-span-3"
                  placeholder="e.g., Grade 10 Math"
                />
              </div>
            </div>
            <DialogFooter>
              <Button
                onClick={handleCreateClass}
                disabled={isCreating || !newClassName.trim() || !teacher}
              >
                {isCreating ? 'Creating...' : 'Create Class'}
              </Button>
            </DialogFooter>
          </DialogContent>
        </Dialog>
      </div>

      {loading ? (
        <div className="flex justify-center items-center h-64">
            <Loader2 className="h-12 w-12 animate-spin text-primary" />
        </div>
      ) : (
        <div className="grid gap-6">
          {classes.map((c) => (
            <Card key={c.id}>
              <CardHeader>
                <div className="flex items-center justify-between">
                  <div>
                    <CardTitle>{c.name}</CardTitle>
                    <CardDescription>
                      <Users className="mr-1 inline h-4 w-4" />
                      {c.studentIds.length} student
                      {c.studentIds.length !== 1 && 's'}
                    </CardDescription>
                  </div>
                  <div className="flex items-center gap-2">
                    <span className="text-sm text-muted-foreground">
                      Invite Code:
                    </span>
                    <Badge variant="secondary">{c.inviteCode}</Badge>
                    <Button
                      size="icon"
                      variant="ghost"
                      onClick={() => handleCopyCode(c.inviteCode)}
                    >
                      {copiedCode === c.inviteCode ? (
                        <ClipboardCheck className="h-4 w-4 text-green-500" />
                      ) : (
                        <Clipboard className="h-4 w-4" />
                      )}
                    </Button>
                  </div>
                </div>
              </CardHeader>
              <CardContent>
                <h4 className="mb-2 font-semibold">Enrolled Students</h4>
                {(students[c.id] && students[c.id].length > 0) ? (
                  <Table>
                    <TableHeader>
                      <TableRow>
                        <TableHead>Name</TableHead>
                        <TableHead className="text-right">Actions</TableHead>
                      </TableRow>
                    </TableHeader>
                    <TableBody>
                      {students[c.id].map((student) => {
                        const avatar = PlaceHolderImages.find(
                          (p) => p.id === 'avatar-1' // Using a generic avatar for now
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
                            <TableCell className="text-right">
                              <Button variant="outline" size="sm">
                                View Progress
                              </Button>
                            </TableCell>
                          </TableRow>
                        );
                      })}
                    </TableBody>
                  </Table>
                ) : (
                  <p className="py-4 text-center text-sm text-muted-foreground">
                    No students have joined this class yet.
                  </p>
                )}
              </CardContent>
            </Card>
          ))}
        </div>
      )}
    </div>
  );
}

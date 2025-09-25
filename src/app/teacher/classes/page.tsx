'use client';

import { useState } from 'react';
import {
  Card,
  CardContent,
  CardDescription,
  CardFooter,
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
import { PlusCircle, Users, Clipboard, ClipboardCheck } from 'lucide-react';
import { Avatar, AvatarFallback, AvatarImage } from '@/components/ui/avatar';
import { PlaceHolderImages } from '@/lib/placeholder-images';

// Mock data, in a real app this would come from a database
const initialClasses = [
  {
    id: 'alg-101',
    name: 'Algebra 101',
    studentCount: 32,
    inviteCode: 'ALG101-XYZ',
    students: [
      { id: 'stu-1', name: 'Alex', avatarId: 'leader-1' },
      { id: 'stu-2', name: 'Maria', avatarId: 'leader-2' },
      { id: 'stu-3', name: 'David', avatarId: 'leader-3' },
    ],
  },
  {
    id: 'hist-us',
    name: 'US History',
    studentCount: 28,
    inviteCode: 'USHIST-ABC',
    students: [],
  },
  {
    id: 'bio-prep',
    name: 'Biology Prep',
    studentCount: 22,
    inviteCode: 'BIOPREP-123',
    students: [{ id: 'stu-4', name: 'Sophia', avatarId: 'avatar-2' }],
  },
];

export default function ClassesPage() {
  const [classes, setClasses] = useState(initialClasses);
  const [newClassName, setNewClassName] = useState('');
  const [isCreating, setIsCreating] = useState(false);
  const [openDialog, setOpenDialog] = useState(false);
  const [copiedCode, setCopiedCode] = useState<string | null>(null);

  const handleCreateClass = () => {
    if (!newClassName.trim()) return;
    setIsCreating(true);
    // Simulate API call
    setTimeout(() => {
      const newClass = {
        id: newClassName.toLowerCase().replace(/\s+/g, '-'),
        name: newClassName,
        studentCount: 0,
        inviteCode: `${newClassName.slice(0, 4).toUpperCase()}-${Math.random()
          .toString(36)
          .substr(2, 3)}`,
        students: [],
      };
      setClasses([newClass, ...classes]);
      setIsCreating(false);
      setNewClassName('');
      setOpenDialog(false);
    }, 1000);
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
                disabled={isCreating || !newClassName.trim()}
              >
                {isCreating ? 'Creating...' : 'Create Class'}
              </Button>
            </DialogFooter>
          </DialogContent>
        </Dialog>
      </div>

      <div className="grid gap-6">
        {classes.map((c) => (
          <Card key={c.id}>
            <CardHeader>
              <div className="flex items-center justify-between">
                <div>
                  <CardTitle>{c.name}</CardTitle>
                  <CardDescription>
                    <Users className="mr-1 inline h-4 w-4" />
                    {c.students.length} student
                    {c.students.length !== 1 && 's'}
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
              {c.students.length > 0 ? (
                <Table>
                  <TableHeader>
                    <TableRow>
                      <TableHead>Name</TableHead>
                      <TableHead className="text-right">Actions</TableHead>
                    </TableRow>
                  </TableHeader>
                  <TableBody>
                    {c.students.map((student) => {
                      const avatar = PlaceHolderImages.find(
                        (p) => p.id === student.avatarId
                      );
                      return (
                        <TableRow key={student.id}>
                          <TableCell>
                            <div className="flex items-center gap-3">
                              <Avatar className="h-9 w-9">
                                <AvatarImage
                                  src={avatar?.imageUrl}
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
    </div>
  );
}

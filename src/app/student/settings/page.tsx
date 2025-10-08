
'use client';

import { useState } from 'react';
import { useStudentData } from '@/hooks/use-student-data';
import { Loader2 } from 'lucide-react';
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { useToast } from '@/hooks/use-toast';
import { doc, updateDoc } from 'firebase/firestore';
import { getDb } from '@/lib/firebase';
import { errorEmitter } from '@/firebase/error-emitter';
import { FirestorePermissionError } from '@/firebase/errors';
import { getTranslation } from '@/lib/translations';

export default function SettingsPage() {
  const { student, loading } = useStudentData();
  const [name, setName] = useState(student?.name || '');
  const [isSaving, setIsSaving] = useState(false);
  const { toast } = useToast();
  const t = (key: string) => getTranslation('en', key);

  if (loading) {
    return (
      <div className="flex items-center justify-center h-full">
        <Loader2 className="h-12 w-12 animate-spin text-primary" />
      </div>
    );
  }

  const handleSaveChanges = async () => {
    const db = getDb();
    if (!student) {
      toast({ title: t('error'), description: t('studentNotFound'), variant: 'destructive' });
      return;
    }
    if (!name.trim()) {
        toast({ title: t('error'), description: t('nameNotEmpty'), variant: 'destructive' });
        return;
    }

    setIsSaving(true);
    const studentDocRef = doc(db, 'users', student.id);

    try {
      const updatedData = { name: name.trim() };
      updateDoc(studentDocRef, updatedData)
        .catch(serverError => {
            const permissionError = new FirestorePermissionError({
              path: studentDocRef.path,
              operation: 'update',
              requestResourceData: updatedData,
            });
            errorEmitter.emit('permission-error', permissionError);
        });
      toast({ title: t('success'), description: t('profileUpdated') });
    } catch (error: any) {
      toast({ title: t('error'), description: error.message, variant: 'destructive' });
    } finally {
      setIsSaving(false);
    }
  };

  return (
    <div className="space-y-6">
      <div>
        <h1 className="text-3xl font-bold tracking-tight">{t('settingsTitle')}</h1>
        <p className="text-muted-foreground">{t('settingsDescription')}</p>
      </div>

      <Card>
        <CardHeader>
          <CardTitle>{t('profile')}</CardTitle>
          <CardDescription>{t('profileDescription')}</CardDescription>
        </CardHeader>
        <CardContent className="space-y-4">
          <div className="space-y-2">
            <Label htmlFor="name">{t('name')}</Label>
            <Input id="name" defaultValue={student?.name} onChange={(e) => setName(e.target.value)} />
          </div>
          <div className="space-y-2">
            <Label htmlFor="email">{t('email')}</Label>
            <Input id="email" value={student?.email || ''} disabled />
          </div>
          <Button onClick={handleSaveChanges} disabled={isSaving}>
            {isSaving ? <Loader2 className="mr-2 h-4 w-4 animate-spin" /> : null}
            {isSaving ? t('saving') : t('saveChanges')}
          </Button>
        </CardContent>
      </Card>
    </div>
  );
}

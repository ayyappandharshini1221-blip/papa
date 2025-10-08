
'use client';

import React, { Suspense } from 'react';
import { Loader2 } from 'lucide-react';
import QuizTakingClientPage from './QuizTakingClientPage';

export default function QuizTakePage() {
  return (
    <Suspense fallback={
      <div className="flex flex-col items-center justify-center h-full gap-4">
        <Loader2 className="h-12 w-12 animate-spin text-primary" />
        <p className="text-muted-foreground">Loading Quiz...</p>
      </div>
    }>
      <QuizTakingClientPage />
    </Suspense>
  );
}

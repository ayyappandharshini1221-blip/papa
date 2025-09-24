'use client';

import { useState } from 'react';
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from '@/components/ui/card';
import {
  Atom,
  BrainCircuit,
  FlaskConical,
  FunctionSquare,
  Sigma,
  Bot,
} from 'lucide-react';
import { JavaIcon, PythonIcon } from '@/components/icons';
import { QuizStartDialog } from '@/components/quiz/quiz-start-dialog';

export type Subject = {
  name: string;
  description: string;
  icon: React.ReactNode;
};

const subjects: Subject[] = [
  {
    name: 'Maths',
    description: 'Tackle problems in algebra, calculus, and more.',
    icon: <Sigma className="h-10 w-10" />,
  },
  {
    name: 'Chemistry',
    description: 'Explore reactions, elements, and molecules.',
    icon: <FlaskConical className="h-10 w-10" />,
  },
  {
    name: 'Biology',
    description: 'Learn about life, from cells to ecosystems.',
    icon: <Atom className="h-10 w-10" />,
  },
  {
    name: 'Tech',
    description: 'Dive into the world of technology and computers.',
    icon: <BrainCircuit className="h-10 w-10" />,
  },
  {
    name: 'Python',
    description: 'Code with one of the most popular languages.',
    icon: <PythonIcon className="h-10 w-10" />,
  },
  {
    name: 'Java',
    description: 'Build robust applications with this classic language.',
    icon: <JavaIcon className="h-10 w-10" />,
  },
];

export default function QuizzesPage() {
  const [selectedSubject, setSelectedSubject] = useState<Subject | null>(null);

  const handleSubjectSelect = (subject: Subject) => {
    setSelectedSubject(subject);
  };

  const handleDialogClose = () => {
    setSelectedSubject(null);
  };

  return (
    <div className="flex flex-col gap-6">
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-3xl font-bold tracking-tight">
            Start a New Quiz
          </h1>
          <p className="text-muted-foreground">
            Select a subject to begin your challenge.
          </p>
        </div>
      </div>

      <div className="grid grid-cols-1 gap-6 sm:grid-cols-2 lg:grid-cols-3">
        {subjects.map((subject) => (
          <Card
            key={subject.name}
            className="group cursor-pointer transform transition-all duration-300 ease-in-out hover:-translate-y-2 hover:shadow-xl"
            onClick={() => handleSubjectSelect(subject)}
          >
            <CardHeader className="flex flex-row items-center gap-4">
              <div className="rounded-lg bg-primary/10 p-4 text-primary">
                {subject.icon}
              </div>
              <div>
                <CardTitle className="text-xl">{subject.name}</CardTitle>
                <CardDescription>{subject.description}</CardDescription>
              </div>
            </CardHeader>
          </Card>
        ))}
      </div>

      {selectedSubject && (
        <QuizStartDialog
          subject={selectedSubject}
          open={!!selectedSubject}
          onClose={handleDialogClose}
        />
      )}
    </div>
  );
}
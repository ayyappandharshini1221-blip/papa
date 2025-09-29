'use client';

import { useState } from 'react';
import {
  Card,
  CardDescription,
  CardHeader,
  CardTitle,
} from '@/components/ui/card';
import {
  Atom,
  BrainCircuit,
  FlaskConical,
  Sigma,
  BookOpen,
} from 'lucide-react';
import { CppIcon, JavaIcon, JavaScriptIcon, PythonIcon } from '@/components/icons';
import { QuizStartDialog } from '@/components/quiz/quiz-start-dialog';
import { Button } from '@/components/ui/button';

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
    name: 'Programming',
    description: 'Code with popular languages like Java and Python.',
    icon: <BrainCircuit className="h-10 w-10" />,
  },
   {
    name: 'Literature',
    description: 'Analyze classic and contemporary literary works.',
    icon: <BookOpen className="h-10 w-10" />,
  },
];

const programmingLanguages: Subject[] = [
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
    {
        name: 'JavaScript',
        description: 'The language of the web.',
        icon: <JavaScriptIcon className="h-10 w-10" />,
    },
    {
        name: 'C++',
        description: 'Powerful language for systems programming.',
        icon: <CppIcon className="h-10 w-10" />,
    }
]


export default function QuizzesPage() {
  const [selectedSubject, setSelectedSubject] = useState<Subject | null>(null);
  const [showLanguageSelection, setShowLanguageSelection] = useState(false);

  const handleSubjectSelect = (subject: Subject) => {
    if (subject.name === 'Programming') {
        setShowLanguageSelection(true);
    } else {
        setSelectedSubject(subject);
    }
  };
  
  const handleLanguageSelect = (language: Subject) => {
    setSelectedSubject(language);
    setShowLanguageSelection(false);
  }

  const handleDialogClose = () => {
    setSelectedSubject(null);
    setShowLanguageSelection(false);
  };

  if(showLanguageSelection) {
    return (
        <div className="flex flex-col gap-6">
            <div>
                <h1 className="text-3xl font-bold tracking-tight">
                    Select a Programming Language
                </h1>
                <p className="text-muted-foreground">
                    Choose which language you want to be quizzed on.
                </p>
             </div>
              <div className="grid grid-cols-1 gap-6 sm:grid-cols-2 lg:grid-cols-3">
                {programmingLanguages.map((lang) => (
                <Card
                    key={lang.name}
                    className="group cursor-pointer transform transition-all duration-300 ease-in-out hover:-translate-y-2 hover:shadow-xl"
                    onClick={() => handleLanguageSelect(lang)}
                >
                    <CardHeader className="flex flex-row items-center gap-4">
                    <div className="rounded-lg bg-primary/10 p-4 text-primary">
                        {lang.icon}
                    </div>
                    <div>
                        <CardTitle className="text-xl">{lang.name}</CardTitle>
                        <CardDescription>{lang.description}</CardDescription>
                    </div>
                    </CardHeader>
                </Card>
                ))}
            </div>
             <Button variant="outline" onClick={() => setShowLanguageSelection(false)} className="self-start">
                Back to subjects
            </Button>
        </div>
    )
  }


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

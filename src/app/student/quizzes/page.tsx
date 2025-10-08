
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
import { CIcon, CppIcon, JavaIcon, JavaScriptIcon, PythonIcon } from '@/components/icons';
import { QuizStartDialog } from '@/components/quiz/quiz-start-dialog';
import { Button } from '@/components/ui/button';
import { useLanguage } from '@/context/language-context';
import { getTranslation } from '@/lib/translations';

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
];

const programmingSubjects: Subject[] = [
    {
        name: 'C',
        description: 'The foundational language for many systems.',
        icon: <CIcon className="h-10 w-10" />,
    },
    {
        name: 'C++',
        description: 'Powerful language for systems programming.',
        icon: <CppIcon className="h-10 w-10" />,
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
        name: 'Python',
        description: 'Code with one of the most popular languages.',
        icon: <PythonIcon className="h-10 w-10" />,
    },
]

export default function QuizzesPage() {
  const [selectedSubject, setSelectedSubject] = useState<Subject | null>(null);
  const [showProgrammingSelection, setShowProgrammingSelection] = useState(false);
  const { language } = useLanguage();
  const t = (key: string) => getTranslation(language, key);

  const handleSubjectSelect = (subject: Subject) => {
    if (subject.name === 'Programming') {
        setShowProgrammingSelection(true);
    }
    else {
        setSelectedSubject(subject);
    }
  };
  
  const handleSubSubjectSelect = (subSubject: Subject) => {
    setSelectedSubject(subSubject);
    setShowProgrammingSelection(false);
  }

  const handleDialogClose = () => {
    setSelectedSubject(null);
    setShowProgrammingSelection(false);
  };
  
  const handleBack = () => {
    setShowProgrammingSelection(false);
  }

  if(showProgrammingSelection) {
    return (
        <div className="flex flex-col gap-6">
            <div>
                <h1 className="text-3xl font-bold tracking-tight">
                    {t('selectProgrammingLanguage')}
                </h1>
                <p className="text-muted-foreground">
                    {t('whichLanguageQuiz')}
                </p>
             </div>
              <div className="grid grid-cols-1 gap-6 sm:grid-cols-2 lg:grid-cols-3">
                {programmingSubjects.map((lang) => (
                <Card
                    key={lang.name}
                    className="group cursor-pointer transform transition-all duration-300 ease-in-out hover:-translate-y-2 hover:shadow-xl"
                    onClick={() => handleSubSubjectSelect(lang)}
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
             <Button variant="outline" onClick={handleBack} className="self-start">
                {t('backToSubjects')}
            </Button>
        </div>
    )
  }
  
  return (
    <div className="flex flex-col gap-6">
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-3xl font-bold tracking-tight">
            {t('startNewQuiz')}
          </h1>
          <p className="text-muted-foreground">
            {t('selectSubjectChallenge')}
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

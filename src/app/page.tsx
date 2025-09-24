import Link from 'next/link';
import { GraduationCap, UserCog } from 'lucide-react';
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from '@/components/ui/card';
import { Logo } from '@/components/icons';

export default function RoleSelectionPage() {
  return (
    <div className="flex min-h-screen flex-col items-center justify-center bg-background p-4">
      <div className="mb-10 flex flex-col items-center text-center">
        <Logo className="mb-4 h-16 w-16 text-primary" />
        <h1 className="text-4xl font-bold tracking-tight text-foreground sm:text-5xl">
          Welcome to EduSmart AI
        </h1>
        <p className="mt-4 max-w-xl text-lg text-muted-foreground">
          The future of gamified learning is here. Choose your role to begin your
          personalized educational journey.
        </p>
      </div>
      <div className="grid w-full max-w-4xl grid-cols-1 gap-8 md:grid-cols-2">
        <Link href="/teacher/dashboard" className="group">
          <Card className="h-full transform transition-all duration-300 ease-in-out group-hover:-translate-y-2 group-hover:shadow-2xl group-hover:shadow-primary/30">
            <CardHeader className="items-center text-center">
              <div className="mb-4 rounded-full bg-primary/10 p-4 text-primary">
                <UserCog className="h-12 w-12" />
              </div>
              <CardTitle className="text-2xl font-bold">I'm a Teacher</CardTitle>
              <CardDescription>
                Create classes, generate AI-powered quizzes, and track your
                students' progress with powerful analytics.
              </CardDescription>
            </CardHeader>
            <CardContent>
              <div className="mt-4 text-center font-semibold text-primary group-hover:underline">
                Go to Teacher Dashboard &rarr;
              </div>
            </CardContent>
          </Card>
        </Link>
        <Link href="/student/dashboard" className="group">
          <Card className="h-full transform transition-all duration-300 ease-in-out group-hover:-translate-y-2 group-hover:shadow-2xl group-hover:shadow-accent/30">
            <CardHeader className="items-center text-center">
              <div className="mb-4 rounded-full bg-accent/10 p-4 text-accent">
                <GraduationCap className="h-12 w-12" />
              </div>
              <CardTitle className="text-2xl font-bold">I'm a Student</CardTitle>
              <CardDescription>
                Join classes, take fun quizzes, earn badges, and climb the
                leaderboard on your learning adventure.
              </CardDescription>
            </CardHeader>
            <CardContent>
              <div className="mt-4 text-center font-semibold text-accent group-hover:underline">
                Go to Student Dashboard &rarr;
              </div>
            </CardContent>
          </Card>
        </Link>
      </div>
    </div>
  );
}

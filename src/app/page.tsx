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
import { Button } from '@/components/ui/button';

export default function HomePage() {
  return (
    <div
      className="relative flex min-h-screen flex-col items-center justify-center bg-cover bg-center p-4"
      style={{
        backgroundImage:
          "url('https://images.unsplash.com/photo-1599609914251-686a77b3518c?q=80&w=2070&auto=format&fit=crop')",
      }}
    >
      <div className="absolute inset-0 bg-background/50 backdrop-blur-sm"></div>
      <div className="relative z-10 w-full">
        <div className="absolute top-0 right-4 flex gap-2">
          <Button variant="outline" asChild>
            <Link href="/login">Login</Link>
          </Button>
          <Button asChild>
            <Link href="/signup">Sign Up</Link>
          </Button>
        </div>
        <div className="mb-10 flex flex-col items-center text-center">
          <Logo className="mb-4 h-16 w-16 text-primary drop-shadow-lg" />
          <h1 className="text-4xl font-bold tracking-tight text-foreground drop-shadow-md sm:text-5xl">
            Welcome to EduSmart AI
          </h1>
          <p className="mt-4 max-w-xl text-lg font-semibold text-foreground/80 drop-shadow-sm">
            The future of gamified learning is here. Choose your role to begin
            your personalized educational journey.
          </p>
        </div>
        <div className="grid w-full max-w-4xl grid-cols-1 gap-8 md:grid-cols-2 mx-auto">
          <Link href="/signup?role=teacher" className="group">
            <Card className="h-full transform rounded-3xl border-2 border-transparent bg-card/80 backdrop-blur-md transition-all duration-300 ease-in-out hover:-translate-y-2 hover:shadow-[0_10px_40px_-10px_hsl(var(--primary)/0.4)] active:translate-y-0 active:shadow-[0_5px_20px_-10px_hsl(var(--primary)/0.4)]">
              <CardHeader className="items-center text-center">
                <div className="mb-4 rounded-full bg-primary/10 p-4 text-primary">
                  <UserCog className="h-12 w-12" />
                </div>
                <CardTitle className="text-2xl font-bold">
                  I'm a Teacher
                </CardTitle>
                <CardDescription>
                  Create classes, generate AI-powered quizzes, and track your
                  students' progress with powerful analytics.
                </CardDescription>
              </CardHeader>
              <CardContent>
                <Button asChild className="mt-4" tabIndex={-1}>
                  <div className="font-semibold text-primary-foreground">
                    Sign Up as a Teacher &rarr;
                  </div>
                </Button>
              </CardContent>
            </Card>
          </Link>
          <Link href="/signup?role=student" className="group">
            <Card className="h-full transform rounded-3xl border-2 border-transparent bg-card/80 backdrop-blur-md transition-all duration-300 ease-in-out hover:-translate-y-2 hover:shadow-[0_10px_40px_-10px_hsl(var(--accent)/0.4)] active:translate-y-0 active:shadow-[0_5px_20px_-10px_hsl(var(--accent)/0.4)]">
              <CardHeader className="items-center text-center">
                <div className="mb-4 rounded-full bg-accent/10 p-4 text-accent">
                  <GraduationCap className="h-12 w-12" />
                </div>
                <CardTitle className="text-2xl font-bold">
                  I'm a Student
                </CardTitle>
                <CardDescription>
                  Join classes, take fun quizzes, earn badges, and climb the
                  leaderboard on your learning adventure.
                </CardDescription>
              </CardHeader>
              <CardContent>
                <Button
                  asChild
                  className="mt-4"
                  variant="secondary"
                  tabIndex={-1}
                >
                  <div className="font-semibold text-secondary-foreground">
                    Sign Up as a Student &rarr;
                  </div>
                </Button>
              </CardContent>
            </Card>
          </Link>
        </div>
      </div>
    </div>
  );
}
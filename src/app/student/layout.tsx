
'use client';

import {
  SidebarProvider,
  Sidebar,
  SidebarHeader,
  SidebarContent,
  SidebarTrigger,
  SidebarMenu,
  SidebarMenuItem,
  SidebarMenuButton,
  SidebarInset,
} from '@/components/ui/sidebar';
import { Logo } from '@/components/icons';
import {
  LayoutDashboard,
  Trophy,
  Target,
  Settings,
  Award,
  BookOpen,
} from 'lucide-react';
import Link from 'next/link';
import { UserNav } from '@/components/dashboard/UserNav';
import { ThemeToggle } from '@/components/dashboard/ThemeToggle';

export default function StudentLayout({
  children,
}: {
  children: React.ReactNode;
}) {

  return (
    <SidebarProvider>
      <Sidebar>
        <SidebarHeader className="border-b border-sidebar-border">
          <Link href="/student/dashboard" className="flex items-center gap-2">
            <Logo className="h-8 w-8 text-primary" />
            <span className="text-lg font-semibold text-sidebar-foreground">
              EduSmart AI
            </span>
          </Link>
        </SidebarHeader>
        <SidebarContent>
          <SidebarMenu>
            <SidebarMenuItem>
              <SidebarMenuButton
                href="/student/dashboard"
                asChild
                tooltip="Dashboard"
              >
                <Link href="/student/dashboard">
                  <LayoutDashboard />
                  <span>Dashboard</span>
                </Link>
              </SidebarMenuButton>
            </SidebarMenuItem>
            <SidebarMenuItem>
              <SidebarMenuButton
                href="/student/quizzes"
                asChild
                tooltip="My Quizzes"
              >
                <Link href="/student/quizzes">
                  <BookOpen />
                  <span>My Quizzes</span>
                </Link>
              </SidebarMenuButton>
            </SidebarMenuItem>
            <SidebarMenuItem>
              <SidebarMenuButton
                href="/student/progress"
                asChild
                tooltip="My Progress"
              >
                <Link href="/student/progress">
                  <Target />
                  <span>My Progress</span>
                </Link>
              </SidebarMenuButton>
            </SidebarMenuItem>
            <SidebarMenuItem>
              <SidebarMenuButton
                href="/student/badges"
                asChild
                tooltip="Badges"
              >
                <Link href="/student/badges">
                  <Award />
                  <span>Badges</span>
                </Link>
              </SidebarMenuButton>
            </SidebarMenuItem>
            <SidebarMenuItem>
              <SidebarMenuButton
                href="/student/leaderboard"
                asChild
                tooltip="Leaderboard"
              >
                <Link href="/student/leaderboard">
                  <Trophy />
                  <span>Leaderboard</span>
                </Link>
              </SidebarMenuButton>
            </SidebarMenuItem>
            <SidebarMenuItem>
              <SidebarMenuButton
                href="/student/settings"
                asChild
                tooltip="Settings"
              >
                <Link href="/student/settings">
                  <Settings />
                  <span>Settings</span>
                </Link>
              </SidebarMenuButton>
            </SidebarMenuItem>
          </SidebarMenu>
        </SidebarContent>
      </Sidebar>
      <SidebarInset>
        <header className="flex h-14 items-center gap-4 border-b bg-card px-4 lg:h-[60px] lg:px-6">
          <SidebarTrigger className="md:hidden" />
          <div className="w-full flex-1">
            {/* Can add breadcrumbs here */}
          </div>
          <ThemeToggle />
          <UserNav />
        </header>
        <main className="flex-1 p-4 sm:p-6">{children}</main>
      </SidebarInset>
    </SidebarProvider>
  );
}

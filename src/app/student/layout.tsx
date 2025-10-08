
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
} from 'lucide-react';
import Link from 'next/link';
import { UserNav } from '@/components/dashboard/UserNav';
import { ThemeToggle } from '@/components/dashboard/ThemeToggle';
import { LanguageToggle } from '@/components/dashboard/LanguageToggle';
import { useLanguage } from '@/context/language-context';
import { getTranslation } from '@/lib/translations';

export default function StudentLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  const { language } = useLanguage();
  const t = (key: string) => getTranslation(language, key);

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
                tooltip={t('dashboard')}
              >
                <Link href="/student/dashboard">
                  <LayoutDashboard />
                  <span>{t('dashboard')}</span>
                </Link>
              </SidebarMenuButton>
            </SidebarMenuItem>
            <SidebarMenuItem>
              <SidebarMenuButton
                href="/student/progress"
                asChild
                tooltip={t('myProgress')}
              >
                <Link href="/student/progress">
                  <Target />
                  <span>{t('myProgress')}</span>
                </Link>
              </SidebarMenuButton>
            </SidebarMenuItem>
            <SidebarMenuItem>
              <SidebarMenuButton
                href="/student/badges"
                asChild
                tooltip={t('badges')}
              >
                <Link href="/student/badges">
                  <Award />
                  <span>{t('badges')}</span>
                </Link>
              </SidebarMenuButton>
            </SidebarMenuItem>
            <SidebarMenuItem>
              <SidebarMenuButton
                href="/student/leaderboard"
                asChild
                tooltip={t('leaderboard')}
              >
                <Link href="/student/leaderboard">
                  <Trophy />
                  <span>{t('leaderboard')}</span>
                </Link>
              </SidebarMenuButton>
            </SidebarMenuItem>
            <SidebarMenuItem>
              <SidebarMenuButton
                href="/student/settings"
                asChild
                tooltip={t('settings')}
              >
                <Link href="/student/settings">
                  <Settings />
                  <span>{t('settings')}</span>
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
          <LanguageToggle />
          <ThemeToggle />
          <UserNav />
        </header>
        <main className="flex-1 p-4 sm:p-6">{children}</main>
      </SidebarInset>
    </SidebarProvider>
  );
}

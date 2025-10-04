
'use client';

import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from '@/components/ui/card';
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from '@/components/ui/table';
import { Avatar, AvatarFallback, AvatarImage } from '@/components/ui/avatar';
import { Badge } from '@/components/ui/badge';
import { Trophy, Flame, Loader2 } from 'lucide-react';
import { PlaceHolderImages } from '@/lib/placeholder-images';
import { useLeaderboard } from '@/hooks/use-leaderboard';
import { useStudentData } from '@/hooks/use-student-data';
import { useLanguage } from '@/context/language-context';
import { getTranslation } from '@/lib/translations';

export default function LeaderboardPage() {
  const { leaderboardData, loading } = useLeaderboard();
  const { student } = useStudentData();
  const { language } = useLanguage();
  const t = (key: string, params: { [key: string]: string | number } = {}) => getTranslation(language, key).replace(/{(\w+)}/g, (_, G) => params[G]?.toString() || G);

  const getTrophy = (rank: number) => {
    if (rank === 1) return <Trophy className="h-5 w-5 text-yellow-500" />;
    if (rank === 2) return <Trophy className="h-5 w-5 text-gray-400" />;
    if (rank === 3) return <Trophy className="h-5 w-5 text-yellow-700" />;
    return null;
  };

  if (loading) {
    return (
      <div className="flex justify-center items-center h-full">
        <Loader2 className="h-12 w-12 animate-spin text-primary" />
      </div>
    );
  }

  return (
    <div className="flex flex-col gap-6">
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-3xl font-bold tracking-tight">{t('leaderboard')}</h1>
        </div>
      </div>
      <Card>
        <CardHeader>
          <CardTitle>{t('overallRankings')}</CardTitle>
          <CardDescription>
            {t('topStudentsAllTime')}
          </CardDescription>
        </CardHeader>
        <CardContent>
          <Table>
            <TableHeader>
              <TableRow>
                <TableHead className="w-[80px]">{t('rank')}</TableHead>
                <TableHead>{t('student')}</TableHead>
                <TableHead>{t('streak')}</TableHead>
                <TableHead className="text-right">XP</TableHead>
              </TableRow>
            </TableHeader>
            <TableBody>
              {leaderboardData.map((player) => {
                const avatar = PlaceHolderImages.find(
                  (p) => p.id === player.avatarId
                );
                return (
                  <TableRow
                    key={player.rank}
                    className={
                      player.studentId === student?.id
                        ? 'bg-primary/10 hover:bg-primary/20'
                        : ''
                    }
                  >
                    <TableCell className="font-bold text-lg">
                      <div className="flex items-center gap-2">
                        <span>{player.rank}</span>
                        {getTrophy(player.rank)}
                      </div>
                    </TableCell>
                    <TableCell>
                      <div className="flex items-center gap-3">
                        <Avatar className="h-10 w-10 border-2 border-primary/50">
                          <AvatarImage
                            src={player.studentAvatarUrl || avatar?.imageUrl}
                            alt={player.studentName}
                            data-ai-hint={avatar?.imageHint}
                          />
                          <AvatarFallback>
                            {player.studentName.charAt(0)}
                          </AvatarFallback>
                        </Avatar>
                        <div>
                          <p className="font-medium">{player.studentName} {player.studentId === student?.id && t('you')}</p>
                        </div>
                      </div>
                    </TableCell>
                     <TableCell>
                        <div className="flex items-center text-sm text-muted-foreground">
                            <Flame className="h-4 w-4 mr-1 text-red-500" />{' '}
                            {t('dayStreak', {streak: player.streak})}
                        </div>
                     </TableCell>
                    <TableCell className="text-right">
                      <Badge variant="secondary">{player.xp} XP</Badge>
                    </TableCell>
                  </TableRow>
                );
              })}
            </TableBody>
          </Table>
        </CardContent>
      </Card>
    </div>
  );
}

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
import { Trophy, Flame } from 'lucide-react';
import { PlaceHolderImages } from '@/lib/placeholder-images';

const leaderboardData = [
  { rank: 1, name: 'Alex', xp: 4500, streak: 25, avatarId: 'leader-1' },
  { rank: 2, name: 'You', xp: 4250, streak: 12, avatarId: 'avatar-1' },
  { rank: 3, name: 'Maria', xp: 3800, streak: 18, avatarId: 'leader-2' },
  { rank: 4, name: 'David', xp: 3550, streak: 5, avatarId: 'leader-3' },
  { rank: 5, name: 'Sophia', xp: 3400, streak: 20, avatarId: 'avatar-2' },
  { rank: 6, name: 'James', xp: 3200, streak: 8, avatarId: 'avatar-3' },
  { rank: 7, name: 'Emily', xp: 3150, streak: 15, avatarId: 'avatar-4' },
  { rank: 8, name: 'Benjamin', xp: 2900, streak: 2, avatarId: 'leader-1' },
  { rank: 9, name: 'Olivia', xp: 2750, streak: 10, avatarId: 'leader-2' },
  { rank: 10, name: 'Lucas', xp: 2600, streak: 7, avatarId: 'leader-3' },
];

export default function LeaderboardPage() {
  const getTrophy = (rank: number) => {
    if (rank === 1) return <Trophy className="h-5 w-5 text-yellow-500" />;
    if (rank === 2) return <Trophy className="h-5 w-5 text-gray-400" />;
    if (rank === 3) return <Trophy className="h-5 w-5 text-yellow-700" />;
    return null;
  };

  return (
    <div className="flex flex-col gap-6">
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-3xl font-bold tracking-tight">Leaderboard</h1>
          <p className="text-muted-foreground">
            See where you stand among your peers in Algebra 101.
          </p>
        </div>
      </div>
      <Card>
        <CardHeader>
          <CardTitle>Overall Rankings</CardTitle>
          <CardDescription>
            Top students based on all-time XP.
          </CardDescription>
        </CardHeader>
        <CardContent>
          <Table>
            <TableHeader>
              <TableRow>
                <TableHead className="w-[80px]">Rank</TableHead>
                <TableHead>Student</TableHead>
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
                      player.name === 'You'
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
                            src={avatar?.imageUrl}
                            alt={player.name}
                            data-ai-hint={avatar?.imageHint}
                          />
                          <AvatarFallback>
                            {player.name.charAt(0)}
                          </AvatarFallback>
                        </Avatar>
                        <div>
                          <p className="font-medium">{player.name}</p>
                          <div className="flex items-center text-xs text-muted-foreground">
                            <Flame className="h-3 w-3 mr-1 text-red-500" />{' '}
                            {player.streak} day streak
                          </div>
                        </div>
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

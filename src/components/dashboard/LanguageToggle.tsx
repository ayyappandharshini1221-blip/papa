'use client';

import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuTrigger,
} from '@/components/ui/dropdown-menu';
import { Button } from '@/components/ui/button';
import { Languages } from 'lucide-react';
import { useState } from 'react';

export function LanguageToggle() {
  const [selectedLanguage, setSelectedLanguage] = useState('English');

  return (
    <DropdownMenu>
      <DropdownMenuTrigger asChild>
        <Button variant="ghost" size="icon">
          <Languages className="h-[1.2rem] w-[1.2rem]" />
          <span className="sr-only">Toggle language</span>
        </Button>
      </DropdownMenuTrigger>
      <DropdownMenuContent align="end">
        <DropdownMenuItem
          onClick={() => setSelectedLanguage('English')}
          disabled={selectedLanguage === 'English'}
        >
          English
        </DropdownMenuItem>
        <DropdownMenuItem
          onClick={() => setSelectedLanguage('Tamil')}
          disabled={selectedLanguage === 'Tamil'}
        >
          Tamil
        </DropdownMenuItem>
      </DropdownMenuContent>
    </DropdownMenu>
  );
}

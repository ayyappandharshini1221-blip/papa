'use client';

import { Avatar, AvatarFallback, AvatarImage } from '@/components/ui/avatar';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { PlaceHolderImages } from '@/lib/placeholder-images';
import { Bot, Send } from 'lucide-react';

export default function AIChatPage() {
    const userAvatar = PlaceHolderImages.find((p) => p.id === 'avatar-1');
  return (
    <div className="flex h-[calc(100vh-8rem)] flex-col">
      <div className="flex-1 overflow-y-auto p-4 space-y-6">
        <div className="flex items-start gap-4">
          <Avatar className="h-10 w-10 border-2 border-primary/50">
            <Bot className="h-9 w-9" />
          </Avatar>
          <div className="flex-1 space-y-2">
            <div className="p-4 rounded-lg bg-card max-w-lg">
              <p className="text-sm">
                Hello! I am EduSmart AI. How can I assist with your teaching needs today?
              </p>
            </div>
          </div>
        </div>

        <div className="flex items-start gap-4 justify-end">
           <div className="flex-1 space-y-2 text-right">
            <div className="p-4 rounded-lg bg-primary text-primary-foreground inline-block max-w-lg text-left">
              <p className="text-sm">
                Generate a 5-question quiz about World War II for my history class.
              </p>
            </div>
          </div>
          <Avatar className="h-10 w-10 border-2 border-primary/50">
            <AvatarImage
              src={userAvatar?.imageUrl}
              alt="User"
              data-ai-hint={userAvatar?.imageHint}
            />
            <AvatarFallback>U</AvatarFallback>
          </Avatar>
        </div>
      </div>
      <div className="p-4 bg-background border-t">
        <div className="flex items-center gap-2">
          <Input
            placeholder="Type your message..."
            className="flex-1"
          />
          <Button>
            <Send className="h-5 w-5" />
            <span className="sr-only">Send</span>
          </Button>
        </div>
      </div>
    </div>
  );
}

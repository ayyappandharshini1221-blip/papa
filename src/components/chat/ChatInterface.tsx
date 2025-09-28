'use client';

import { useState, useRef, useEffect } from 'react';
import { Send, User, Bot, Loader2 } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Textarea } from '@/components/ui/textarea';
import { cn } from '@/lib/utils';
import { Avatar, AvatarFallback, AvatarImage } from '../ui/avatar';
import { PlaceHolderImages } from '@/lib/placeholder-images';
import { Card, CardContent, CardFooter } from '../ui/card';

type Message = {
  role: 'user' | 'model';
  content: { text: string }[];
};

type ChatStreamer = (input: { text: string }) => Promise<AsyncGenerator<{ text: string }>>;

export function ChatInterface({ welcomeMessage, chatStreamer }: { welcomeMessage: string, chatStreamer: ChatStreamer }) {
  const [messages, setMessages] = useState<Message[]>([
    { role: 'model', content: [{ text: welcomeMessage }] }
  ]);
  const [input, setInput] = useState('');
  const [pending, setPending] = useState(false);
  const messagesEndRef = useRef<HTMLDivElement>(null);
  const userAvatar = PlaceHolderImages.find(p => p.id === 'avatar-1');

  useEffect(() => {
    messagesEndRef.current?.scrollIntoView({ behavior: 'smooth' });
  }, [messages]);

  const handleSendMessage = async (e: React.FormEvent) => {
    e.preventDefault();
    const trimmedInput = input.trim();
    if (!trimmedInput || pending) return;

    const userMessage: Message = { role: 'user', content: [{ text: trimmedInput }] };
    setMessages(prev => [...prev, userMessage]);
    
    setInput('');
    setPending(true);

    try {
      const stream = await chatStreamer({
        text: trimmedInput,
      });

      setMessages(prev => [...prev, { role: 'model', content: [{ text: '' }] }]);
      let fullResponse = '';

      for await (const chunk of stream) {
        if (chunk?.text) {
          fullResponse += chunk.text;
          setMessages(prev => {
            const updated = [...prev];
            const lastMessage = updated[updated.length - 1];
            if (lastMessage && lastMessage.role === 'model') {
                lastMessage.content = [{ text: fullResponse }];
            }
            return updated;
          });
        }
      }
    } catch (error) {
      console.error('Error streaming chat:', error);
       setMessages(prev => [...prev, { role: 'model', content: [{ text: 'Sorry, I encountered an error.' }] }]);
    } finally {
      setPending(false);
    }
  };

  return (
    <Card className="flex flex-col h-[calc(100vh-12rem)]">
      <CardContent className="flex-1 overflow-y-auto p-6 space-y-6">
        {messages.map((m, i) => (
          <div
            key={i}
            className={cn(
              'flex gap-3',
              m.role === 'user' ? 'justify-end' : 'justify-start'
            )}
          >
            {m.role === 'model' && (
              <Avatar className="h-9 w-9">
                <AvatarFallback><Bot /></AvatarFallback>
              </Avatar>
            )}
            <div
              className={cn(
                'rounded-lg px-4 py-3 max-w-md',
                m.role === 'user'
                  ? 'bg-primary text-primary-foreground'
                  : 'bg-muted'
              )}
            >
              {m.content.map((c, j) => (
                <p key={j} className="text-sm whitespace-pre-wrap">{c.text}</p>
              ))}
              {m.role === 'model' && messages.length -1 === i && pending && (
                <Loader2 className="h-5 w-5 text-primary animate-spin" />
              )}
            </div>
             {m.role === 'user' && (
              <Avatar className="h-9 w-9">
                <AvatarImage src={userAvatar?.imageUrl} alt="User" data-ai-hint={userAvatar?.imageHint} />
                <AvatarFallback><User /></AvatarFallback>
              </Avatar>
            )}
          </div>
        ))}
         {pending && messages[messages.length - 1]?.role === 'user' && (
          <div className="flex gap-3 justify-start">
             <Avatar className="h-9 w-9">
                <AvatarFallback><Bot /></AvatarFallback>
              </Avatar>
            <div className="rounded-lg px-4 py-3 max-w-md bg-muted flex items-center">
              <Loader2 className="h-5 w-5 text-primary animate-spin" />
            </div>
          </div>
        )}
        <div ref={messagesEndRef} />
      </CardContent>
      <CardFooter className="p-4 border-t">
        <form onSubmit={handleSendMessage} className="flex w-full items-center gap-2">
          <Textarea
            value={input}
            onChange={(e) => setInput(e.target.value)}
            placeholder="Type your message..."
            className="flex-1 resize-none"
            onKeyDown={(e) => {
              if (e.key === 'Enter' && !e.shiftKey) {
                e.preventDefault();
                handleSendMessage(e as any);
              }
            }}
            disabled={pending}
          />
          <Button type="submit" size="icon" disabled={!input.trim() || pending}>
            {pending ? <Loader2 className="h-5 w-5 animate-spin" /> : <Send className="h-5 w-5" />}
          </Button>
        </form>
      </CardFooter>
    </Card>
  );
}
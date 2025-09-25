'use client';

import { useState, useRef, useEffect } from 'react';
import { useActions, useStreamableValue } from 'ai/rsc';
import { Send, User, Bot, Loader2 } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Textarea } from '@/components/ui/textarea';
import { streamChat } from '@/ai/flows/chat';
import { cn } from '@/lib/utils';
import { Avatar, AvatarFallback, AvatarImage } from '../ui/avatar';
import { PlaceHolderImages } from '@/lib/placeholder-images';

type Message = {
  role: 'user' | 'model';
  content: { text: string }[];
};

export function ChatInterface({ initialMessages }: { initialMessages: Message[] }) {
  const { streamChat: streamChatAction } = useActions();
  const [messages, setMessages] = useState<Message[]>(initialMessages);
  const [input, setInput] = useState('');
  const [data, error, pending] = useStreamableValue<string>(
    '',
  );
  const messagesEndRef = useRef<HTMLDivElement>(null);
  const userAvatar = PlaceHolderImages.find(p => p.id === 'avatar-1');

  useEffect(() => {
    messagesEndRef.current?.scrollIntoView({ behavior: 'smooth' });
  }, [messages, data]);
  
  useEffect(() => {
    if (data) {
      const lastMessage = messages[messages.length - 1];
      if (lastMessage?.role === 'model') {
        // Append to the last message if it's from the model
        const updatedMessages = [...messages];
        const lastContent = lastMessage.content[lastMessage.content.length-1].text;
        updatedMessages[messages.length - 1] = {
          ...lastMessage,
          content: [{ text: lastContent + data }],
        };
        setMessages(updatedMessages);
      } else {
        // Create a new message if the last one was from the user
        setMessages([
          ...messages,
          { role: 'model', content: [{ text: data }]},
        ]);
      }
    }
  // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [data]);

  const handleSendMessage = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!input.trim() && !pending) return;

    const newMessages: Message[] = [
      ...messages,
      { role: 'user', content: [{ text: input }] },
    ];
    setMessages(newMessages);
    setInput('');
    
    const history = newMessages.slice(0, -1).map(msg => ({
      ...msg,
      // Ensure content is an array as expected by the flow
      content: Array.isArray(msg.content) ? msg.content : [{ text: msg.content as any }],
    }));

    const stream = await streamChatAction({
      history,
      prompt: input,
    });
    
    // Reset data for the new stream
    const [newData, newError, newPending] = useStreamableValue<string>('', {
      initialValue: '',
      stream,
    });
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
              <p className="text-sm whitespace-pre-wrap">{m.content[0].text}</p>
            </div>
             {m.role === 'user' && (
              <Avatar className="h-9 w-9">
                <AvatarImage src={userAvatar?.imageUrl} alt="User" data-ai-hint={userAvatar?.imageHint} />
                <AvatarFallback><User /></AvatarFallback>
              </Avatar>
            )}
          </div>
        ))}
         {pending && messages[messages.length-1].role === 'user' && (
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
                handleSendMessage(e);
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

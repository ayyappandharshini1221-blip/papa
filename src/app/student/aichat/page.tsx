'use client';

import { Avatar, AvatarFallback, AvatarImage } from '@/components/ui/avatar';
import { Button } from '@/components/ui/button';
import { PlaceHolderImages } from '@/lib/placeholder-images';
import { Bot, Send, Loader2 } from 'lucide-react';
import React, { useState, useRef, useEffect, useCallback } from 'react';
import { chat, ChatInput } from '@/ai/flows/chat';
import { useStream } from 'genkit/react';
import Textarea from 'react-textarea-autosize';

interface Message {
  role: 'user' | 'model';
  content: string;
}

export default function AIChatPage() {
  const userAvatar = PlaceHolderImages.find((p) => p.id === 'avatar-1');
  const [messages, setMessages] = useState<Message[]>([
    {
      role: 'model',
      content:
        'Hello! I am EduSmart AI. How can I help you with your learning journey today?',
    },
  ]);
  const [input, setInput] = useState('');
  const [isLoading, setIsLoading] = useState(false);
  const chatContainerRef = useRef<HTMLDivElement>(null);

  const handleStream = useCallback((stream: ReadableStream<any>) => {
    const reader = stream.getReader();
    let accumulatedResponse = '';

    const read = () => {
      reader.read().then(({ done, value }) => {
        if (done) {
          setIsLoading(false);
          setMessages((prev) => [
            ...prev,
            { role: 'model', content: accumulatedResponse },
          ]);
          return;
        }
        accumulatedResponse += value.text;
        // This gives a smoother streaming effect
        setMessages((prev) => {
          const newMessages = [...prev];
          if (
            newMessages.length > 0 &&
            newMessages[newMessages.length - 1].role === 'model'
          ) {
            newMessages[newMessages.length - 1] = {
              role: 'model',
              content: accumulatedResponse,
            };
            return newMessages;
          } else {
            return [...prev, { role: 'model', content: accumulatedResponse }];
          }
        });

        read();
      });
    };
    read();
  }, []);

  const { stream } = useStream({
    flow: chat,
    onStream: handleStream,
  });

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!input.trim() || isLoading) return;

    const newMessages: Message[] = [...messages, { role: 'user', content: input }];
    setMessages(newMessages);
    setInput('');
    setIsLoading(true);

    const chatInput: ChatInput = {
      history: messages.map(m => ({ role: m.role, content: m.content })),
      prompt: input,
    };
    await stream(chatInput);
  };

  useEffect(() => {
    chatContainerRef.current?.scrollTo(0, chatContainerRef.current.scrollHeight);
  }, [messages]);

  return (
    <div className="flex h-[calc(100vh-8rem)] flex-col">
      <div ref={chatContainerRef} className="flex-1 overflow-y-auto p-4 space-y-6">
        {messages.map((m, i) => (
          <div
            key={i}
            className={`flex items-start gap-4 ${
              m.role === 'user' ? 'justify-end' : ''
            }`}
          >
            {m.role === 'model' && (
              <Avatar className="h-10 w-10 border-2 border-primary/50">
                <Bot className="h-9 w-9" />
              </Avatar>
            )}
            <div className={`flex-1 space-y-2 ${m.role === 'user' ? 'text-right': ''}`}>
              <div
                className={`p-4 rounded-lg inline-block max-w-lg text-left ${
                  m.role === 'user'
                    ? 'bg-primary text-primary-foreground'
                    : 'bg-card'
                }`}
              >
                <p className="text-sm">{m.content}</p>
              </div>
            </div>
            {m.role === 'user' && (
              <Avatar className="h-10 w-10 border-2 border-primary/50">
                <AvatarImage
                  src={userAvatar?.imageUrl}
                  alt="User"
                  data-ai-hint={userAvatar?.imageHint}
                />
                <AvatarFallback>U</AvatarFallback>
              </Avatar>
            )}
          </div>
        ))}
         {isLoading && messages[messages.length - 1].role === 'user' && (
            <div className="flex items-start gap-4">
              <Avatar className="h-10 w-10 border-2 border-primary/50">
                <Bot className="h-9 w-9" />
              </Avatar>
              <div className="flex-1 space-y-2">
                <div className="p-4 rounded-lg bg-card max-w-lg">
                  <Loader2 className="h-5 w-5 animate-spin" />
                </div>
              </div>
            </div>
          )}
      </div>
      <div className="p-4 bg-background border-t">
        <form onSubmit={handleSubmit} className="flex items-center gap-2">
          <Textarea
            value={input}
            onChange={(e) => setInput(e.target.value)}
            onKeyDown={(e) => {
              if (e.key === 'Enter' && !e.shiftKey) {
                e.preventDefault();
                handleSubmit(e);
              }
            }}
            placeholder="Type your message..."
            className="flex-1"
            rows={1}
            maxRows={5}
            disabled={isLoading}
          />
          <Button type="submit" disabled={isLoading || !input.trim()}>
            {isLoading ? (
              <Loader2 className="h-5 w-5 animate-spin" />
            ) : (
              <Send className="h-5 w-5" />
            )}
            <span className="sr-only">Send</span>
          </Button>
        </form>
      </div>
    </div>
  );
}

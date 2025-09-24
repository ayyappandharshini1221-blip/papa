'use client';

import { Avatar, AvatarFallback, AvatarImage } from '@/components/ui/avatar';
import { Button } from '@/components/ui/button';
import { PlaceHolderImages } from '@/lib/placeholder-images';
import { Bot, Send, Loader2 } from 'lucide-react';
import React, { useState, useRef, useEffect, useCallback } from 'react';
import { chat, ChatInput } from '@/ai/flows/chat';
import { useStream } from '@genkit-ai/next/react';
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
        'Hello! I am EduSmart AI. How can I assist with your teaching needs today?',
    },
  ]);
  const [input, setInput] = useState('');
  const chatContainerRef = useRef<HTMLDivElement>(null);

  const { stream, data, loading, error } = useStream({
    flow: chat,
    initialInput: {
      history: messages.map(m => ({ role: m.role, content: m.content })),
      prompt: '',
    },
  });

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!input.trim() || loading) return;

    const newMessages: Message[] = [...messages, { role: 'user', content: input }];
    setMessages(newMessages);
    
    const chatInput: ChatInput = {
      history: newMessages.slice(0, -1).map(m => ({ role: m.role, content: m.content })),
      prompt: input,
    };
    
    setInput('');
    await stream(chatInput);
  };
  
  useEffect(() => {
    let accumulatedText = '';
    if (data) {
        setMessages(prev => {
            const lastMessage = prev[prev.length - 1];

            // If the last message is from the model, update it
            if (lastMessage?.role === 'model') {
                accumulatedText = lastMessage.content + data.text;
                const updatedMessages = [...prev.slice(0, -1), { role: 'model', content: data.text}];
                return updatedMessages;
            }
            
            // Otherwise, add a new model message
            return [...prev, { role: 'model', content: data.text }];
        });
    }
  }, [data]);


  useEffect(() => {
    if (loading) {
      const lastMessage = messages[messages.length - 1];
      if (lastMessage?.role === 'user') {
        setMessages(prev => [...prev, { role: 'model', content: '' }]);
      }
    }
  }, [loading, messages]);


  useEffect(() => {
    chatContainerRef.current?.scrollTo(0, chatContainerRef.current.scrollHeight);
  }, [messages, data]);


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
                <p className="text-sm whitespace-pre-wrap">{m.content}</p>
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
         {loading && messages[messages.length - 1]?.role !== 'model' && (
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
            disabled={loading}
          />
          <Button type="submit" disabled={loading || !input.trim()}>
            {loading ? (
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

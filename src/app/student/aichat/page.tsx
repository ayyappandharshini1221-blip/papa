'use client';

import { ChatInterface } from '@/components/chat/ChatInterface';
import { streamStudentChat } from '@/ai/flows/student-chat';

export default function StudentAIChatPage() {
  const welcomeMessage = 'Hello! I am your personal AI tutor. You can ask me for explanations on complex topics, help with homework, or quiz preparation tips. How can I help you learn today?';

  return (
    <div>
      <h1 className="text-3xl font-bold tracking-tight mb-2">AI Tutor</h1>
      <p className="text-muted-foreground mb-6">Your personal AI tutor. Ask me anything!</p>
      <ChatInterface welcomeMessage={welcomeMessage} chatStreamer={streamStudentChat} />
    </div>
  );
}

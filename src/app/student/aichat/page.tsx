'use client';

import { ChatInterface } from '@/components/chat/ChatInterface';

export default function StudentAIChatPage() {
  const welcomeMessage = 'Hello! I am EduSmart AI. As a student, you can ask me for explanations on complex topics, help with homework, or quiz preparation tips. How can I help you learn today?';

  return (
    <div>
      <h1 className="text-3xl font-bold tracking-tight mb-2">AI Assistant</h1>
      <p className="text-muted-foreground mb-6">Your personal AI tutor. Ask me anything!</p>
      <ChatInterface welcomeMessage={welcomeMessage} />
    </div>
  );
}

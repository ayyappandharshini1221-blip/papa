'use client';

import { ChatInterface } from '@/components/chat/ChatInterface';

export default function TeacherAIChatPage() {
  const welcomeMessage = 'Hello! I am EduSmart AI. As a teacher, you can ask me to generate quiz ideas, create lesson plan outlines, or suggest activities for your class. How can I assist you today?';

  return (
    <div>
      <h1 className="text-3xl font-bold tracking-tight mb-2">AI Assistant</h1>
      <p className="text-muted-foreground mb-6">Your personal teaching assistant. Ask me anything!</p>
      <ChatInterface welcomeMessage={welcomeMessage} />
    </div>
  );
}


'use client';

import { ChatInterface } from '@/components/chat/ChatInterface';
import { streamStudentChat } from '@/ai/flows/student-chat';
import { useLanguage } from '@/context/language-context';
import { getTranslation } from '@/lib/translations';

export default function StudentAIChatPage() {
  const { language } = useLanguage();
  const t = (key: string) => getTranslation(language, key);
  const welcomeMessage = t('aiTutorWelcome');

  return (
    <div>
      <h1 className="text-3xl font-bold tracking-tight mb-2">{t('aiTutor')}</h1>
      <p className="text-muted-foreground mb-6">{t('aiTutorDescription')}</p>
      <ChatInterface welcomeMessage={welcomeMessage} chatStreamer={streamStudentChat} />
    </div>
  );
}

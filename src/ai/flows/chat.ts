
'use server';
/**
 * @fileOverview Streaming chat flow for Genkit in Next.js.
 */

import {ai} from '@/ai/genkit';
import {z} from 'zod';
import { Message } from 'genkit';

const ChatInputSchema = z.object({
  history: z.array(
    z.object({
      role: z.enum(['user', 'model']),
      content: z.array(z.object({text: z.string()})),
    })
  ),
  prompt: z.string(),
});

export type ChatInput = z.infer<typeof ChatInputSchema>;

const ChatOutputChunkSchema = z.object({text: z.string()});
export type ChatOutputChunk = z.infer<typeof ChatOutputChunkSchema>;

// Convert client history + prompt into Genkit-compatible messages
function toGenkitMessages(input: ChatInput): Message[] {
  const historyMessages: Message[] = input.history.map((msg) => ({
    role: msg.role,
    content: msg.content,
  }));

  const userMessage: Message = {
    role: 'user',
    content: [{text: input.prompt}],
  };

  return [...historyMessages, userMessage];
}

// Define the streaming chat flow
const chatFlow = ai.defineFlow(
  {
    name: 'chatFlow',
    inputSchema: ChatInputSchema,
    outputSchema: ChatOutputChunkSchema,
    stream: true,
  },
  async function* (input) {
    const messages = toGenkitMessages(input);

    const {stream: llmStream} = await ai.generate({
      stream: true,
      prompt: {
        messages,
        system: 'You are a helpful AI assistant for the EduSmart AI platform. Keep your answers concise and friendly.'
      },
    });

    for await (const chunk of llmStream) {
      const text = chunk.text;
      // Ensure we only yield chunks that have a non-empty text property.
      if (typeof text === 'string' && text.length > 0) {
        yield { text };
      }
    }
  }
);

// Server action to call from client
export async function streamChat(input: ChatInput) {
  return await chatFlow(input);
}


'use server';
/**
 * @fileOverview Streaming chat flow for Genkit in Next.js.
 */

import {ai} from '@/ai/genkit';
import {z} from 'zod';

// Simplified input schema
const ChatInputSchema = z.object({
  text: z.string(),
});
export type ChatInput = z.infer<typeof ChatInputSchema>;

const ChatOutputChunkSchema = z.object({text: z.string()});
export type ChatOutputChunk = z.infer<typeof ChatOutputChunkSchema>;


// Define the streaming chat flow
const chatFlow = ai.defineFlow(
  {
    name: 'chatFlow',
    inputSchema: ChatInputSchema,
    outputSchema: ChatOutputChunkSchema,
    stream: true,
  },
  async function* (input) {
    const {stream: llmStream} = await ai.generate({
      model: 'googleai/gemini-2.5-flash',
      stream: true,
      prompt: {
        text: input.text,
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

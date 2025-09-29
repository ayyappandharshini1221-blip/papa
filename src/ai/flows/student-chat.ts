'use server';
/**
 * @fileOverview Streaming chat flow for Genkit in Next.js, specifically for students.
 */

import {ai} from '@/ai/genkit';
import {z} from 'zod';

// Simplified input schema
const StudentChatInputSchema = z.object({
  text: z.string(),
});
export type StudentChatInput = z.infer<typeof StudentChatInputSchema>;

const StudentChatOutputChunkSchema = z.object({text: z.string()});
export type StudentChatOutputChunk = z.infer<typeof StudentChatOutputChunkSchema>;


// Define the streaming chat flow
const studentChatFlow = ai.defineFlow(
  {
    name: 'studentChatFlow',
    inputSchema: StudentChatInputSchema,
    outputSchema: StudentChatOutputChunkSchema,
    stream: true,
  },
  async function* (input) {
    const {stream: llmStream} = await ai.generate({
      stream: true,
      prompt: {
        text: input.text,
        system: 'You are a helpful and friendly AI tutor for the EduSmart AI platform. Your goal is to help students understand concepts, answer their questions, and clear up their study doubts. Keep your answers concise, encouraging, and easy to understand.'
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
export async function streamStudentChat(input: StudentChatInput) {
  return await studentChatFlow(input);
}

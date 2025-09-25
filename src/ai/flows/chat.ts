'use server';

/**
 * @fileOverview A simple chat flow for conversational AI.
 *
 * This file defines a Genkit flow that takes a series of messages (chat history)
 * and the user's latest prompt, then returns a streaming response from an AI model.
 *
 * - streamChat - A server action that handles the conversational chat process.
 * - ChatInput - The input type for the chat function, containing the chat history.
 * - ChatOutputChunk - The type for each streamed chunk of the AI's response.
 */

import {ai} from '@/ai/genkit';
import {z} from 'genkit';
import {Message, Role} from 'genkit/model';

const ChatInputSchema = z.object({
  history: z.array(
    z.object({
      role: z.enum(['user', 'model']),
      content: z.string(),
    })
  ),
  prompt: z.string(),
});
export type ChatInput = z.infer<typeof ChatInputSchema>;

export const ChatOutputChunkSchema = z.object({
  text: z.string(),
});
export type ChatOutputChunk = z.infer<typeof ChatOutputChunkSchema>;

function toGenkitMessages(input: ChatInput): Message[] {
  const messages = input.history.map(
    (msg): Message => ({
      role: msg.role as Role,
      content: [{text: msg.content}],
    })
  );
  messages.push({
    role: 'user',
    content: [{text: input.prompt}],
  });
  return messages;
}

const chatFlow = ai.defineFlow(
  {
    name: 'chatFlow',
    inputSchema: ChatInputSchema,
    outputSchema: ChatOutputChunkSchema,
    stream: true,
  },
  async function* (input) {
    const {stream: llmStream} = await ai.generate({
      stream: true,
      prompt: {
        messages: toGenkitMessages(input),
      },
      // The model can be overridden by passing `model` in the request.
    });

    for await (const chunk of llmStream) {
      const text = chunk.text;
      if (text) {
        yield { text };
      }
    }
  }
);

export async function streamChat(input: ChatInput) {
  return await chatFlow(input);
}

'use server';

/**
 * @fileOverview A simple chat flow for conversational AI.
 *
 * This file defines a Genkit flow that takes a series of messages (chat history)
 * and the user's latest prompt, then returns a streaming response from an AI model.
 *
 * - streamChat - A server action that handles the conversational chat process.
 * - ChatInput - The input type for the chat function, containing the chat history.
 */

import {ai} from '@/ai/genkit';
import {z} from 'genkit';
import {Message} from 'genkit/model';

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

// This function converts the client-side chat history into the format Genkit expects.
function toGenkitMessages(input: ChatInput): Message[] {
  const historyMessages: Message[] = input.history.map((msg) => ({
    role: msg.role,
    content: [{text: msg.content}],
  }));

  const userMessage: Message = {
    role: 'user',
    content: [{text: input.prompt}],
  };

  return [...historyMessages, userMessage];
}

const chatFlow = ai.defineFlow(
  {
    name: 'chatFlow',
    inputSchema: ChatInputSchema,
    stream: true,
  },
  async function* (input) {
    const messages = toGenkitMessages(input);

    const {stream: llmStream} = await ai.generate({
      stream: true,
      prompt: messages,
    });

    for await (const chunk of llmStream) {
      if (chunk.text) {
        yield { text: chunk.text };
      }
    }
  }
);

export async function streamChat(input: ChatInput) {
  return await chatFlow(input);
}

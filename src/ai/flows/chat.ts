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

// The output chunk schema is no longer needed on the server,
// as validation will be handled on the client.

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
    // outputSchema is removed to prevent server-side validation errors on empty chunks.
    stream: true,
  },
  async function* (input) {
    const {stream: llmStream} = await ai.generate({
      stream: true,
      prompt: toGenkitMessages(input),
      // The model can be overridden by passing `model` in the request.
    });

    for await (const chunk of llmStream) {
      // Yield all chunks directly. The client will handle filtering.
      yield chunk;
    }
  }
);

export async function streamChat(input: ChatInput) {
  return await chatFlow(input);
}

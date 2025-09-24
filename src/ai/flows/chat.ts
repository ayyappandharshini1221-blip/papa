'use server';

/**
 * @fileOverview A simple chat flow for conversational AI.
 *
 * This file defines a Genkit flow that takes a series of messages (chat history)
 * and the user's latest prompt, then returns a streaming response from an AI model.
 *
 * - chat - A function that handles the conversational chat process.
 * - ChatInput - The input type for the chat function, containing the chat history.
 * - ChatOutputChunk - The type for each streamed chunk of the AI's response.
 */

import {ai} from '@/ai/genkit';
import {z} from 'genkit';
import {Message, Role} from 'genkit/model';
import {Stream} from 'genkit/streaming';

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

export type ChatOutputChunk = {
  text: string;
};

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

export async function chat(
  input: ChatInput,
  stream: Stream<ChatOutputChunk>
) {
  const llmResponse = await ai.generate({
    stream: true,
    prompt: {
      messages: toGenkitMessages(input),
    },
    // The model can be overridden by passing `model` in the request.
  });

  for await (const chunk of llmResponse.stream) {
    if (chunk.content) {
      stream.write({text: chunk.content[0].text!});
    }
  }
}

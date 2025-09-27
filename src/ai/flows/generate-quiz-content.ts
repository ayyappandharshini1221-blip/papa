
'use server';

/**
 * @fileOverview This file defines a Genkit flow for generating quiz questions and answers on a given subject, including explanations.
 *
 * - generateQuizContent - A function that generates quiz content based on the provided subject.
 * - GenerateQuizContentInput - The input type for the generateQuizContent function.
 * - GenerateQuizContentOutput - The return type for the generateQuizContent function.
 */

import {ai} from '@/ai/genkit';
import {z} from 'genkit';
import { unstable_cache as cache } from 'next/cache';

const GenerateQuizContentInputSchema = z.object({
  subject: z.string().describe('The subject of the quiz.'),
  difficulty: z.enum(['easy', 'medium', 'hard']).describe('The difficulty level of the quiz.'),
  numberOfQuestions: z.number().min(1).max(10).default(5).describe('The number of questions to generate for the quiz.'),
});
export type GenerateQuizContentInput = z.infer<typeof GenerateQuizContentInputSchema>;

const GenerateQuizContentOutputSchema = z.object({
  quiz: z.array(
    z.object({
      question: z.string().describe('The quiz question.'),
      answers: z.array(z.string()).length(4).describe('A list of 4 possible answers to the question.'),
      correctAnswerIndex: z.number().min(0).max(3).describe('The index of the correct answer in the answers array.'),
      explanation: z.string().describe('An explanation of why the correct answer is correct.'),
    })
  ).describe('The generated quiz content.'),
});
export type GenerateQuizContentOutput = z.infer<typeof GenerateQuizContentOutputSchema>;


export async function generateQuizContent(input: GenerateQuizContentInput): Promise<GenerateQuizContentOutput> {
  // We create a dynamic cache function. The arguments to the cached function are what 
  // determine uniqueness for caching. This ensures that a quiz for 'Maths' (easy) is
  // cached separately from 'Maths' (hard).
  const getQuizWithDynamicCache = cache(
    async (cacheInput: GenerateQuizContentInput) => {
      console.log(`Generating new quiz for ${cacheInput.subject} (${cacheInput.difficulty})`);
      return await generateQuizContentFlow(cacheInput);
    },
    // The base key for invalidation.
    ['quiz-content'], 
    { 
      // Revalidate cache every 24 hours. If a request comes in after this time,
      // Next.js will serve the stale data while re-generating in the background.
      revalidate: 86400 
    }
  );

  return getQuizWithDynamicCache(input);
}

const generateQuizContentPrompt = ai.definePrompt({
  name: 'generateQuizContentPrompt',
  input: {schema: GenerateQuizContentInputSchema},
  output: {schema: GenerateQuizContentOutputSchema},
  prompt: `You are an expert quiz generator for teachers. Generate a quiz on the following subject: {{{subject}}}. The difficulty level should be {{{difficulty}}}.

The quiz must contain exactly {{{numberOfQuestions}}} questions.
Each question must have exactly 4 possible answers.
For each question, you must provide the index of the correct answer (from 0 to 3).
For each question, you must provide a brief explanation for why the answer is correct.

Return the quiz in the exact JSON format specified.`,
});

const generateQuizContentFlow = ai.defineFlow(
  {
    name: 'generateQuizContentFlow',
    inputSchema: GenerateQuizContentInputSchema,
    outputSchema: GenerateQuizContentOutputSchema,
    retry: {
      maxAttempts: 3,
      backoff: {
        initialDelay: 2000,
        multiplier: 2,
      },
    },
  },
  async input => {
    const {output} = await generateQuizContentPrompt(input);
    return output!;
  }
);


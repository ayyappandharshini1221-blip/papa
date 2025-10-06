'use server';

/**
 * @fileOverview This flow adapts the quiz difficulty based on the student's performance.
 *
 * - adaptQuizDifficulty - A function that adjusts the quiz difficulty.
 * - AdaptQuizDifficultyInput - The input type for the adaptQuizDifficulty function.
 * - AdaptQuizDifficultyOutput - The return type for the adaptQuizDifficulty function.
 */

import {ai} from '@/ai/genkit';
import {z} from 'genkit';
import {googleAI} from '@genkit-ai/google-genai';

const AdaptQuizDifficultyInputSchema = z.object({
  studentId: z.string().describe('The ID of the student taking the quiz.'),
  quizId: z.string().describe('The ID of the quiz being taken.'),
  score: z
    .number()
    .describe(
      'The student\'s score on the quiz, as a percentage (0-100).  For example, 75 means 75%.'
    ),
  currentDifficulty: z
    .enum(['easy', 'medium', 'hard'])
    .describe('The current difficulty level of the quiz.'),
});
export type AdaptQuizDifficultyInput = z.infer<
  typeof AdaptQuizDifficultyInputSchema
>;

const AdaptQuizDifficultyOutputSchema = z.object({
  newDifficulty: z
    .enum(['easy', 'medium', 'hard'])
    .describe('The new difficulty level of the quiz, adjusted based on performance.'),
  reasoning: z
    .string()
    .describe(
      'The AI\s reasoning for the difficulty adjustment, for debugging purposes.'
    ),
});
export type AdaptQuizDifficultyOutput = z.infer<
  typeof AdaptQuizDifficultyOutputSchema
>;

export async function adaptQuizDifficulty(
  input: AdaptQuizDifficultyInput
): Promise<AdaptQuizDifficultyOutput> {
  return adaptQuizDifficultyFlow(input);
}

const prompt = ai.definePrompt({
  name: 'adaptQuizDifficultyPrompt',
  input: {schema: AdaptQuizDifficultyInputSchema},
  output: {schema: AdaptQuizDifficultyOutputSchema},
  prompt: `You are an AI that adjusts the difficulty of quizzes based on student performance.

You are provided with the student's ID, the quiz ID, their score on the quiz, and the current difficulty level.

Based on this information, you must determine the new difficulty level for the next quiz.

Here's how to adjust the difficulty:
- If the student scored below 50%, lower the difficulty by one level (hard -> medium, medium -> easy, easy -> easy).
- If the student scored between 50% and 79%, keep the difficulty the same.
- If the student scored 80% or higher, increase the difficulty by one level (easy -> medium, medium -> hard, hard -> hard).

Student ID: {{{studentId}}}
Quiz ID: {{{quizId}}}
Score: {{{score}}}%
Current Difficulty: {{{currentDifficulty}}}

Respond with the new difficulty and your reasoning for the adjustment.
`,
});

const adaptQuizDifficultyFlow = ai.defineFlow(
  {
    name: 'adaptQuizDifficultyFlow',
    inputSchema: AdaptQuizDifficultyInputSchema,
    outputSchema: AdaptQuizDifficultyOutputSchema,
    model: googleAI.model('gemini-1.5-flash'),
    retry: {
      maxAttempts: 5,
      backoff: {
        initialDelay: 3000,
        multiplier: 2,
      },
    },
  },
  async input => {
    const {output} = await prompt(input);
    return output!;
  }
);

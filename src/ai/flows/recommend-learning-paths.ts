'use server';

/**
 * @fileOverview This file defines a Genkit flow for recommending personalized learning paths to students based on their performance data.
 *
 * - recommendLearningPaths - A function that takes student performance data as input and returns a personalized learning path for each student.
 * - RecommendLearningPathsInput - The input type for the recommendLearningPaths function.
 * - RecommendLearningPathsOutput - The return type for the recommendLearningPaths function.
 */

import {ai} from '@/ai/genkit';
import {z} from 'genkit';
import {googleAI} from '@genkit-ai/google-genai';

const RecommendLearningPathsInputSchema = z.object({
  studentPerformanceData: z
    .string()
    .describe('The performance data of the student, including quiz scores, subjects, and difficulty levels.'),
});
export type RecommendLearningPathsInput = z.infer<typeof RecommendLearningPathsInputSchema>;

const RecommendLearningPathsOutputSchema = z.object({
  learningPath: z
    .string()
    .describe('A personalized learning path for the student, including recommended subjects, difficulty levels, and resources.'),
});
export type RecommendLearningPathsOutput = z.infer<typeof RecommendLearningPathsOutputSchema>;

export async function recommendLearningPaths(input: RecommendLearningPathsInput): Promise<RecommendLearningPathsOutput> {
  return recommendLearningPathsFlow(input);
}

const prompt = ai.definePrompt({
  name: 'recommendLearningPathsPrompt',
  input: {schema: RecommendLearningPathsInputSchema},
  output: {schema: RecommendLearningPathsOutputSchema},
  prompt: `You are an AI assistant that recommends personalized learning paths to students based on their performance data.

Analyze the following student performance data and recommend a personalized learning path for the student. The learning path should include recommended subjects, difficulty levels, and resources.

Student Performance Data:
{{{studentPerformanceData}}}

Personalized Learning Path:`,
});

const recommendLearningPathsFlow = ai.defineFlow(
  {
    name: 'recommendLearningPathsFlow',
    inputSchema: RecommendLearningPathsInputSchema,
    outputSchema: RecommendLearningPathsOutputSchema,
    model: googleAI.model('gemini-2.0-flash'),
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

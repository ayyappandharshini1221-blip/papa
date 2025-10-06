'use server';
/**
 * @fileOverview This file defines a Genkit flow for providing personalized remediation to students based on their wrong answers.
 *
 * - providePersonalizedRemediation - A function that generates explanations and practice quizzes for a given topic.
 * - PersonalizedRemediationInput - The input type for the providePersonalizedRemediation function.
 * - PersonalizedRemediationOutput - The return type for the providePersonalizedRemediation function.
 */

import {ai} from '@/ai/genkit';
import {z} from 'genkit';
import {googleAI} from '@genkit-ai/google-genai';

const PersonalizedRemediationInputSchema = z.object({
  topic: z.string().describe('The topic for which remediation is needed.'),
  wrongAnswer: z.string().describe('The student\'s wrong answer.'),
  question: z.string().describe('The question that was answered incorrectly.'),
});
export type PersonalizedRemediationInput = z.infer<typeof PersonalizedRemediationInputSchema>;

const PersonalizedRemediationOutputSchema = z.object({
  explanation: z.string().describe('Explanation of the correct answer and why the provided answer was wrong.'),
  practiceQuiz: z.string().describe('Additional practice quiz questions on the topic.'),
});
export type PersonalizedRemediationOutput = z.infer<typeof PersonalizedRemediationOutputSchema>;

export async function providePersonalizedRemediation(
  input: PersonalizedRemediationInput
): Promise<PersonalizedRemediationOutput> {
  return providePersonalizedRemediationFlow(input);
}

const prompt = ai.definePrompt({
  name: 'personalizedRemediationPrompt',
  input: {schema: PersonalizedRemediationInputSchema},
  output: {schema: PersonalizedRemediationOutputSchema},
  prompt: `You are an AI assistant helping students learn from their mistakes. A student answered the following question incorrectly, provide an explanation of the correct answer and a practice quiz to help them learn.

Question: {{{question}}}
Wrong Answer: {{{wrongAnswer}}}
Topic: {{{topic}}}

Explanation:

Practice Quiz:`,
});

const providePersonalizedRemediationFlow = ai.defineFlow(
  {
    name: 'providePersonalizedRemediationFlow',
    inputSchema: PersonalizedRemediationInputSchema,
    outputSchema: PersonalizedRemediationOutputSchema,
    model: googleAI.model('gemini-2.5-flash'),
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

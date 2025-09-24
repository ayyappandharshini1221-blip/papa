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
      answers: z.array(z.string()).describe('The possible answers to the question.'),
      correctAnswerIndex: z.number().min(0).describe('The index of the correct answer in the answers array.'),
      explanation: z.string().describe('An explanation of why the correct answer is correct.'),
    })
  ).describe('The generated quiz content.'),
});
export type GenerateQuizContentOutput = z.infer<typeof GenerateQuizContentOutputSchema>;

export async function generateQuizContent(input: GenerateQuizContentInput): Promise<GenerateQuizContentOutput> {
  return generateQuizContentFlow(input);
}

const generateQuizContentPrompt = ai.definePrompt({
  name: 'generateQuizContentPrompt',
  input: {schema: GenerateQuizContentInputSchema},
  output: {schema: GenerateQuizContentOutputSchema},
  prompt: `You are an expert quiz generator for teachers. Generate a quiz on the following subject: {{{subject}}}. The difficulty level is {{{difficulty}}}. The quiz should have {{{numberOfQuestions}}} questions. Each question should have 4 possible answers, and one of them should be correct. Provide an explanation for why the correct answer is correct. Return the quiz in JSON format.`,
});

const generateQuizContentFlow = ai.defineFlow(
  {
    name: 'generateQuizContentFlow',
    inputSchema: GenerateQuizContentInputSchema,
    outputSchema: GenerateQuizContentOutputSchema,
  },
  async input => {
    const {output} = await generateQuizContentPrompt(input);
    return output!;
  }
);


'use server';

/**
 * @fileOverview This file defines a function for retrieving statically defined quiz content.
 *
 * - generateQuizContent - A function that returns pre-generated quiz content based on the provided subject and difficulty.
 * - GenerateQuizContentInput - The input type for the generateQuizContent function.
 * - GenerateQuizContentOutput - The return type for the generateQuizContent function.
 */

import { z } from 'genkit';
import { staticQuizData } from '@/lib/static-quiz-data';

const GenerateQuizContentInputSchema = z.object({
  subject: z.string().describe('The subject of the quiz.'),
  difficulty: z.enum(['easy', 'medium', 'hard']).describe('The difficulty level of the quiz.'),
  numberOfQuestions: z.number().min(1).max(10).default(10).describe('The number of questions for the quiz.'),
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
  const subjectKey = input.subject.toLowerCase();
  const difficultyKey = input.difficulty;

  // @ts-ignore
  const quiz = staticQuizData[subjectKey]?.[difficultyKey];

  if (!quiz) {
    throw new Error(`Quiz content for ${input.subject} (${input.difficulty}) is not available.`);
  }

  // Return a slice of the questions based on the requested number
  const quizContent = quiz.slice(0, input.numberOfQuestions);

  return { quiz: quizContent };
}

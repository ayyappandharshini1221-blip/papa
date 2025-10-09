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

  // Filter questions by subject and difficulty
  // @ts-ignore
  const questions = staticQuizData.filter(q => 
    q.subject.toLowerCase() === subjectKey && 
    q.level.toLowerCase() === difficultyKey
  );

  if (!questions || questions.length === 0) {
    throw new Error(`Quiz content for ${input.subject} (${input.difficulty}) is not available.`);
  }

  // Take only the requested number of questions or 10, whichever is smaller
  const selectedQuestions = questions.slice(0, Math.min(input.numberOfQuestions, 10));

  // Transform the data to match the expected output format
  const quiz = selectedQuestions.map(q => ({
    question: q.question,
    answers: q.options,
    correctAnswerIndex: q.correct_index,
    // Adding a default explanation since the data doesn't include it
    explanation: "This is the correct answer based on the question."
  }));

  return { quiz };
}

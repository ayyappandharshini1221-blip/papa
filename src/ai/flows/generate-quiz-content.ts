
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
import {googleAI} from '@genkit-ai/google-genai';

// In-memory cache for generated quizzes
const quizCache = new Map<string, GenerateQuizContentOutput>();

const GenerateQuizContentInputSchema = z.object({
  subject: z.string().describe('The subject of the quiz.'),
  difficulty: z.enum(['easy', 'medium', 'hard']).describe('The difficulty level of the quiz.'),
  numberOfQuestions: z.number().min(1).max(10).default(10).describe('The number of questions to generate for the quiz.'),
  language: z.string().optional().describe('The language for the quiz. If "ta", a bilingual Tamil-English quiz is generated.'),
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
  const cacheKey = `${input.subject}-${input.difficulty}-${input.language || 'en'}`;
  if (quizCache.has(cacheKey)) {
    console.log('Serving from cache:', cacheKey);
    return quizCache.get(cacheKey)!;
  }
  
  console.log('Generating new quiz:', cacheKey);
  const result = await generateQuizContentFlow(input);
  quizCache.set(cacheKey, result);
  return result;
}

const generateQuizContentPrompt = ai.definePrompt({
  name: 'generateQuizContentPrompt',
  input: {schema: GenerateQuizContentInputSchema},
  output: {schema: GenerateQuizContentOutputSchema},
  model: googleAI.model('gemini-2.0-flash'),
  prompt: `You are an expert quiz generator for teachers. Generate a quiz on the following subject: {{{subject}}}. The difficulty level should be {{{difficulty}}}.

The quiz must contain exactly {{{numberOfQuestions}}} questions.
Each question must have exactly 4 possible answers.
For each question, you must provide the index of the correct answer (from 0 to 3).
For each question, you must provide a brief explanation for why the answer is correct.

Return the quiz in the exact JSON format specified.`,
});

const generateBilingualTamilQuizPrompt = ai.definePrompt({
  name: 'generateBilingualTamilQuizPrompt',
  input: { schema: GenerateQuizContentInputSchema },
  output: { schema: GenerateQuizContentOutputSchema },
  model: googleAI.model('gemini-2.0-flash'),
  prompt: `You are an expert quiz generator for teachers. Generate a quiz on the subject of Tamil. The difficulty level should be {{{difficulty}}}.

The quiz must be bilingual, with all questions, answers, and explanations provided in both Tamil and English. For example: "கேள்வி (Question)".

The quiz must contain exactly {{{numberOfQuestions}}} questions.
Each question must have exactly 4 possible answers, also in both languages.
For each question, you must provide the index of the correct answer (from 0 to 3).
For each question, you must provide a brief explanation for why the answer is correct, in both languages.

Return the quiz in the exact JSON format specified.`,
});


const generateQuizContentFlow = ai.defineFlow(
  {
    name: 'generateQuizContentFlow',
    inputSchema: GenerateQuizContentInputSchema,
    outputSchema: GenerateQuizContentOutputSchema,
  },
  async input => {
    if ((input.subject.toLowerCase() === 'tamil') || (input.language === 'ta')) {
        const { output } = await generateBilingualTamilQuizPrompt(input);
        return output!;
    }
    const {output} = await generateQuizContentPrompt(input);
    return output!;
  }
);

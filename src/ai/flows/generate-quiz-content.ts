
'use server';

/**
 * @fileOverview This file defines a Genkit flow for generating quiz questions and answers on a given subject, including explanations.
 *
 * - generateQuizContent - A function that returns pre-generated quiz content based on the provided subject and difficulty.
 * - GenerateQuizContentInput - The input type for the generateQuizContent function.
 * - GenerateQuizContentOutput - The return type for the generateQuizContent function.
 */

import {ai} from '@/ai/genkit';
import {z} from 'genkit';
import {googleAI} from '@genkit-ai/google-genai';

// In-memory cache for all pre-generated quizzes
const quizCache = new Map<string, GenerateQuizContentOutput>();

const GenerateQuizContentInputSchema = z.object({
  subject: z.string().describe('The subject of the quiz.'),
  difficulty: z.enum(['easy', 'medium', 'hard']).describe('The difficulty level of the quiz.'),
  numberOfQuestions: z.number().min(1).max(10).default(10).describe('The number of questions to generate for the quiz.'),
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
  const cacheKey = `${input.subject.toLowerCase()}-${input.difficulty}`;
  if (quizCache.has(cacheKey)) {
    console.log('Serving from cache:', cacheKey);
    return quizCache.get(cacheKey)!;
  }
  
  // If not in cache, generate, then cache and return it.
  console.log(`Cache miss for: ${cacheKey}. Generating on-demand.`);
  const result = await generateQuizContentFlow(input);
  quizCache.set(cacheKey, result);
  console.log(`Successfully generated and cached quiz for: ${cacheKey}`);
  return result;
}

const generateQuizContentPrompt = ai.definePrompt({
  name: 'generateQuizContentPrompt',
  input: {schema: GenerateQuizContentInputSchema},
  output: {schema: GenerateQuizContentOutputSchema},
  model: googleAI.model('gemini-2.5-flash'),
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
  },
  async input => {
    const {output} = await generateQuizContentPrompt(input);
    return output!;
  }
);


// --- Pre-caching logic ---

const allSubjects = ['Maths', 'English', 'Chemistry', 'Biology', 'C', 'C++', 'Java', 'JavaScript', 'Python'];
const allDifficulties: ('easy' | 'medium' | 'hard')[] = ['easy', 'medium', 'hard'];

async function preCacheQuizzes() {
    console.log('Starting to pre-cache all quizzes...');
    const generationPromises: Promise<void>[] = [];

    for (const subject of allSubjects) {
        for (const difficulty of allDifficulties) {
            const promise = (async () => {
                const cacheKey = `${subject.toLowerCase()}-${difficulty}`;
                if (quizCache.has(cacheKey)) {
                    console.log(`Quiz for ${subject} (${difficulty}) already cached. Skipping.`);
                    return;
                }
                
                try {
                    console.log(`Generating quiz for: ${subject} (${difficulty})`);
                    const result = await generateQuizContentFlow({
                        subject,
                        difficulty,
                        numberOfQuestions: 10
                    });
                    quizCache.set(cacheKey, result);
                    console.log(`Successfully cached quiz for: ${subject} (${difficulty})`);
                } catch (error) {
                    console.error(`Failed to generate or cache quiz for ${subject} (${difficulty}):`, error);
                }
            })();
            generationPromises.push(promise);
        }
    }

    await Promise.all(generationPromises);
    console.log('Finished pre-caching all quizzes.');
}

// Immediately start the pre-caching process when the server starts.
// This is a self-invoking async function.
(async () => {
  await preCacheQuizzes();
})();

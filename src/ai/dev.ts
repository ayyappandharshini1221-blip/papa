'use server';
import { config } from 'dotenv';
config();

import '@/ai/flows/recommend-learning-paths.ts';
import '@/ai/flows/adapt-quiz-difficulty.ts';
import '@/ai/flows/generate-quiz-content.ts';
import '@/ai/flows/provide-personalized-remediation.ts';
import '@/ai/flows/chat.ts';

'use server';

/**
 * @fileOverview Provides financial advice based on user queries about savings and investments.
 *
 * - getFinancialAdvice - A function that takes a user's question and returns financial advice.
 * - FinancialAdviceInput - The input type for the getFinancialAdvice function.
 * - FinancialAdviceOutput - The return type for the getFinancialAdvice function.
 */

import {ai} from '@/ai/genkit';
import {z} from 'genkit';
import { generate } from 'genkit/generate';

const FinancialAdviceInputSchema = z.object({
  query: z.string().describe('The user\u2019s question about savings or investments.'),
});
export type FinancialAdviceInput = z.infer<typeof FinancialAdviceInputSchema>;

const FinancialAdviceOutputSchema = z.object({
  advice: z.string().describe('General financial advice related to the user\u2019s question.'),
});
export type FinancialAdviceOutput = z.infer<typeof FinancialAdviceOutputSchema>;

export async function getFinancialAdvice(input: FinancialAdviceInput): Promise<ReadableStream<any>> {
  return financialAdviceFlow(input);
}

const financialAdvicePrompt = `You are a helpful AI assistant that provides general financial advice.

  The user has asked the following question about savings or investments:
  {{query}}

  Provide helpful and informative advice to the user.  Keep the answer short and concise.
  Do not make any specific recommendations, and do not provide any financial advice related to specific financial products.
  Always remind the user that you cannot provide financial advice, and that they should consult with a financial professional.
  `;

const financialAdviceFlow = ai.defineFlow(
  {
    name: 'financialAdviceFlow',
    inputSchema: FinancialAdviceInputSchema,
    outputSchema: z.any(), // Output will be a stream
  },
  async input => {
    const {stream} = await generate({
      model: 'googleai/gemini-2.0-flash',
      prompt: financialAdvicePrompt.replace('{{query}}', input.query),
      output: {
        schema: FinancialAdviceOutputSchema,
        format: 'json'
      },
      stream: true
    });
    return stream;
  }
);

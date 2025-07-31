"use server";

import { getFinancialAdvice as getFinancialAdviceFlow, FinancialAdviceInput } from "@/ai/flows/financial-guidance";
import { streamFlow } from "@genkit-ai/next/server";
import { z } from "zod";

const inputSchema = z.object({
  query: z.string(),
});

export async function getFinancialAdvice(input: FinancialAdviceInput) {
  return await streamFlow(
    {
      name: "financialAdviceFlow",
      inputSchema,
      outputSchema: z.any(),
    },
    async (input) => await getFinancialAdviceFlow(input)
  )(input);
}

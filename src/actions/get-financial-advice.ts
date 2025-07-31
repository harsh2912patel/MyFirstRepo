"use server";

import { getFinancialAdvice as getFinancialAdviceFlow, FinancialAdviceInput } from "@/ai/flows/financial-guidance";
import { streamFlow } from "genkit/next";
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
      auth: (auth) => {
        // You can add authentication logic here if needed.
        // For example, you could verify a user's session.
        // If the user is not authorized, you can throw an error.
      },
    },
    async (input) => await getFinancialAdviceFlow(input)
  )(input);
}

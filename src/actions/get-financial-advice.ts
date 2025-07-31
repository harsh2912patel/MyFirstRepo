"use server";

import { getFinancialAdvice as getFinancialAdviceFlow, FinancialAdviceInput } from "@/ai/flows/financial-guidance";

export async function getFinancialAdvice(input: FinancialAdviceInput) {
  // Directly return the result of the flow, which should be a stream
  return await getFinancialAdviceFlow(input);
}

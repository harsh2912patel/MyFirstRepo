import { genkit } from "@/ai/genkit";
import { nextHandler } from "@genkit-ai/next/server";

export const POST = nextHandler(genkit);

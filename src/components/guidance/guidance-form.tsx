'use client';

import { useState } from 'react';
import { useStreamableValue } from 'ai/rsc';
import { Card, CardContent, CardDescription, CardFooter, CardHeader, CardTitle } from '@/components/ui/card';
import { Textarea } from '@/components/ui/textarea';
import { Button } from '@/components/ui/button';
import { getFinancialAdvice } from '@/actions/get-financial-advice';
import { Loader2 } from 'lucide-react';
import { useToast } from '@/hooks/use-toast';
import { Alert, AlertDescription, AlertTitle } from '@/components/ui/alert';

export function GuidanceForm() {
  const [query, setQuery] = useState('');
  const [advice, setAdvice] = useState<string | null>(null);
  const [isLoading, setIsLoading] = useState(false);
  const { toast } = useToast();

  const handleSubmit = async (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    if (!query) return;

    setIsLoading(true);
    setAdvice(null);
    try {
      const { output } = await getFinancialAdvice({ query });
      
      let finalAdvice = '';
      if (typeof output === 'object' && output !== null && 'advice' in output) {
        finalAdvice = (output as { advice: string }).advice;
      } else if (typeof output === 'string') {
        finalAdvice = output;
      } else {
        // Attempt to find the advice in a streaming response
        const streamedOutput = await (async () => {
          let value = '';
          for await (const delta of output) {
            value += delta.advice;
          }
          return value;
        })();
        finalAdvice = streamedOutput || "Sorry, I couldn't generate advice for that question.";
      }
      setAdvice(finalAdvice);

    } catch (error) {
      console.error(error);
      toast({
        variant: 'destructive',
        title: 'An error occurred',
        description: 'Failed to get financial advice. Please try again.',
      });
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <Card className="max-w-2xl mx-auto">
      <CardHeader>
        <CardTitle>Financial Guidance</CardTitle>
        <CardDescription>
          Ask a question about savings or investments to get general financial advice from our AI assistant.
        </CardDescription>
      </CardHeader>
      <form onSubmit={handleSubmit}>
        <CardContent>
          <Textarea
            placeholder="e.g., What are some common strategies for long-term saving?"
            value={query}
            onChange={(e) => setQuery(e.target.value)}
            rows={4}
          />
        </CardContent>
        <CardFooter>
          <Button type="submit" disabled={isLoading || !query}>
            {isLoading && <Loader2 className="mr-2 h-4 w-4 animate-spin" />}
            Get Advice
          </Button>
        </CardFooter>
      </form>

      {isLoading && (
        <CardContent className="flex items-center justify-center p-8">
            <Loader2 className="h-8 w-8 animate-spin text-primary" />
        </CardContent>
      )}

      {advice && (
        <CardContent>
          <Alert>
            <AlertTitle>Your Financial Guidance</AlertTitle>
            <AlertDescription className="prose prose-sm dark:prose-invert max-w-none pt-2">
                {advice}
            </AlertDescription>
          </Alert>
        </CardContent>
      )}
    </Card>
  );
}

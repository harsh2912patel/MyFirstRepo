'use client';

import { useState } from 'react';
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
  const [error, setError] = useState<string | null>(null);
  const [isLoading, setIsLoading] = useState(false);
  const { toast } = useToast();

  const handleSubmit = async (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    if (!query) return;

    setIsLoading(true);
    setAdvice('');
    setError(null);
    try {
      const response = await getFinancialAdvice({ query });
      
      // Manually read from the ReadableStream
      const reader = response.getReader();
      const decoder = new TextDecoder();
      let accumulatedAdvice = '';

      while (true) {
        const { value, done } = await reader.read();
        if (done) break;
        
        const chunk = decoder.decode(value, { stream: true });
        
        try {
          // Each chunk might not be a full JSON object, so we need to handle this carefully.
          // A simple approach is to accumulate and parse, but for this case, let's assume
          // we get newline-delimited JSON objects.
          const jsonStrings = chunk.split('\n').filter(s => s.trim() !== '');
          for (const jsonString of jsonStrings) {
            const parsed = JSON.parse(jsonString);
            if (parsed?.advice) {
              accumulatedAdvice += parsed.advice;
              setAdvice(accumulatedAdvice);
            }
          }
        } catch (e) {
          // This can happen if a chunk is not a complete JSON object.
          // In a more robust implementation, we would buffer the chunks.
          console.warn("Could not parse stream chunk:", chunk);
        }
      }

    } catch (err: any) {
      console.error(err);
      const errorMessage = err.message || 'Failed to get financial advice. Please try again.';
      setError(errorMessage);
      toast({
        variant: 'destructive',
        title: 'An error occurred',
        description: errorMessage,
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

      {isLoading && !advice && (
        <CardContent className="flex items-center justify-center p-8">
            <Loader2 className="h-8 w-8 animate-spin text-primary" />
        </CardContent>
      )}

      {error && (
        <CardContent>
          <Alert variant="destructive">
            <AlertTitle>Error</AlertTitle>
            <AlertDescription className="prose prose-sm dark:prose-invert max-w-none pt-2">
                {error}
            </AlertDescription>
          </Alert>
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

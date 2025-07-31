
'use client';

import { useState } from 'react';
import { Card, CardContent, CardDescription, CardFooter, CardHeader, CardTitle } from '@/components/ui/card';
import { Textarea } from '@/components/ui/textarea';
import { Label } from '@/components/ui/label';
import { Button } from '@/components/ui/button';
import { useCurrency } from '@/context/currency-context';
import { formatCurrency } from '@/lib/utils';

const FIXED_EXPENSES = [
  { name: 'Rent/Mortgage', amount: 1200 },
  { name: 'Utilities', amount: 150 },
  { name: 'Insurance', amount: 100 },
  { name: 'Loan Payments', amount: 250 },
];

const totalFixedExpenses = FIXED_EXPENSES.reduce((sum, exp) => sum + exp.amount, 0);

export function BudgetCalculator() {
  const [income, setIncome] = useState<number | ''>('');
  const [freeAmount, setFreeAmount] = useState<number | null>(null);
  const { currency, exchangeRates } = useCurrency();
  const convert = (amount: number) => amount * exchangeRates[currency.code];

  const handleCalculate = () => {
    if (typeof income === 'number') {
      const localIncome = income / exchangeRates[currency.code];
      setFreeAmount(localIncome - totalFixedExpenses);
    }
  };

  return (
    <div className="grid gap-8 md:grid-cols-2">
      <Card>
        <CardHeader>
          <CardTitle>Budget Planner</CardTitle>
          <CardDescription>Enter your monthly income to see your budget breakdown.</CardDescription>
        </CardHeader>
        <CardContent className="space-y-4">
          <div className="space-y-2">
            <Label htmlFor="income">Monthly Income ({currency.code})</Label>
            <div className="relative">
              <span className="absolute left-3 top-3 h-4 w-4 text-muted-foreground">{currency.symbol}</span>
              <Textarea
                id="income"
                placeholder="e.g., 3000"
                value={income}
                onChange={(e) => setIncome(e.target.value === '' ? '' : parseFloat(e.target.value))}
                className="pl-8"
                rows={1}
              />
            </div>
          </div>
        </CardContent>
        <CardFooter>
          <Button onClick={handleCalculate} disabled={!income}>Calculate Budget</Button>
        </CardFooter>
      </Card>

      <div className="space-y-6">
        <Card>
          <CardHeader>
            <CardTitle>Fixed Expenses</CardTitle>
            <CardDescription>These are your recurring monthly costs.</CardDescription>
          </CardHeader>
          <CardContent>
            <ul className="space-y-2">
              {FIXED_EXPENSES.map((expense) => (
                <li key={expense.name} className="flex justify-between">
                  <span>{expense.name}</span>
                  <span className="font-medium">{formatCurrency(convert(expense.amount), currency.code)}</span>
                </li>
              ))}
            </ul>
            <div className="border-t mt-4 pt-4 flex justify-between font-bold">
              <span>Total Fixed Expenses</span>
              <span>{formatCurrency(convert(totalFixedExpenses), currency.code)}</span>
            </div>
          </CardContent>
        </Card>

        {freeAmount !== null && (
          <Card className="bg-primary/10 border-primary">
            <CardHeader>
              <CardTitle>Available for Spending</CardTitle>
              <CardDescription>This is the amount left after fixed expenses.</CardDescription>
            </CardHeader>
            <CardContent>
              <p className="text-4xl font-bold text-primary">{formatCurrency(convert(freeAmount), currency.code)}</p>
            </CardContent>
          </Card>
        )}
      </div>
    </div>
  );
}

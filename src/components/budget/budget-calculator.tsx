
'use client';

import { useState } from 'react';
import { Card, CardContent, CardDescription, CardFooter, CardHeader, CardTitle } from '@/components/ui/card';
import { Textarea } from '@/components/ui/textarea';
import { Label } from '@/components/ui/label';
import { Button } from '@/components/ui/button';
import { useCurrency } from '@/context/currency-context';
import { formatCurrency } from '@/lib/utils';
import { Input } from '@/components/ui/input';
import { X } from 'lucide-react';

interface FixedExpense {
  id: string;
  name: string;
  amount: number;
}

const initialFixedExpenses: FixedExpense[] = [
  { id: '1', name: 'Rent/Mortgage', amount: 1200 },
  { id: '2', name: 'Utilities', amount: 150 },
  { id: '3', name: 'Insurance', amount: 100 },
  { id: '4', name: 'Loan Payments', amount: 250 },
];

export function BudgetCalculator() {
  const [income, setIncome] = useState<number | ''>('');
  const [freeAmount, setFreeAmount] = useState<number | null>(null);
  const { currency, exchangeRates } = useCurrency();

  const [expenses, setExpenses] = useState<FixedExpense[]>(initialFixedExpenses);
  const [newExpenseName, setNewExpenseName] = useState('');
  const [newExpenseAmount, setNewExpenseAmount] = useState<number | ''>('');

  const convert = (amount: number) => amount * exchangeRates[currency.code];
  const totalFixedExpenses = expenses.reduce((sum, exp) => sum + exp.amount, 0);

  const handleCalculate = () => {
    if (typeof income === 'number') {
      const localIncome = income / exchangeRates[currency.code];
      setFreeAmount(localIncome - totalFixedExpenses);
    }
  };

  const handleAddExpense = () => {
    if (newExpenseName && typeof newExpenseAmount === 'number' && newExpenseAmount > 0) {
      const localAmount = newExpenseAmount / exchangeRates[currency.code];
      const newExpense: FixedExpense = {
        id: new Date().getTime().toString(),
        name: newExpenseName,
        amount: localAmount,
      };
      setExpenses([...expenses, newExpense]);
      setNewExpenseName('');
      setNewExpenseAmount('');
    }
  };

  const handleRemoveExpense = (id: string) => {
    setExpenses(expenses.filter((exp) => exp.id !== id));
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
            <CardDescription>Your recurring monthly costs.</CardDescription>
          </CardHeader>
          <CardContent>
            <ul className="space-y-2">
              {expenses.map((expense) => (
                <li key={expense.id} className="flex justify-between items-center">
                  <span>{expense.name}</span>
                  <div className="flex items-center gap-2">
                    <span className="font-medium">{formatCurrency(convert(expense.amount), currency.code)}</span>
                    <Button variant="ghost" size="icon" className="h-6 w-6" onClick={() => handleRemoveExpense(expense.id)}>
                      <X className="h-4 w-4" />
                    </Button>
                  </div>
                </li>
              ))}
            </ul>
            <div className="border-t mt-4 pt-4 flex justify-between font-bold">
              <span>Total Fixed Expenses</span>
              <span>{formatCurrency(convert(totalFixedExpenses), currency.code)}</span>
            </div>
          </CardContent>
          <CardFooter className="flex-col items-start gap-2">
            <Label>Add New Expense</Label>
            <div className="flex gap-2 w-full">
              <Input
                placeholder="Expense Name"
                value={newExpenseName}
                onChange={(e) => setNewExpenseName(e.target.value)}
              />
              <div className="relative">
                 <span className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-muted-foreground">{currency.symbol}</span>
                 <Input
                    type="number"
                    placeholder="Amount"
                    value={newExpenseAmount}
                    onChange={(e) => setNewExpenseAmount(e.target.value === '' ? '' : parseFloat(e.target.value))}
                    className="pl-8 w-32"
                 />
              </div>

            </div>
            <Button onClick={handleAddExpense} variant="secondary" size="sm">Add Expense</Button>
          </CardFooter>
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

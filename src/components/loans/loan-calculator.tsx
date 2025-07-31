'use client';

import { useState } from 'react';
import { Card, CardContent, CardDescription, CardFooter, CardHeader, CardTitle } from '@/components/ui/card';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Button } from '@/components/ui/button';
import { Alert, AlertDescription, AlertTitle } from '@/components/ui/alert';
import type { Loan } from '@/lib/types';
import { DollarSign, Percent, Calendar, AlertCircle } from 'lucide-react';
import { addYears, format, differenceInDays } from 'date-fns';

const initialLoans: Loan[] = [
  { id: '1', name: 'Student Loan', principal: 20000, interestRate: 5.5, term: 10, deadline: '2034-07-26' },
  { id: '2', name: 'Car Loan', principal: 15000, interestRate: 4.2, term: 5, deadline: '2029-08-15' },
];

export function LoanCalculator() {
  const [loans, setLoans] = useState<Loan[]>(initialLoans);
  const [principal, setPrincipal] = useState<number | ''>('');
  const [interestRate, setInterestRate] = useState<number | ''>('');
  const [term, setTerm] = useState<number | ''>('');
  const [newLoan, setNewLoan] = useState<Loan | null>(null);

  const handleCalculate = () => {
    if (typeof principal === 'number' && typeof interestRate === 'number' && typeof term === 'number') {
      const rate = interestRate / 100 / 12;
      const n = term * 12;
      const monthlyPayment = (principal * rate * Math.pow(1 + rate, n)) / (Math.pow(1 + rate, n) - 1);
      const totalInterest = monthlyPayment * n - principal;
      const deadline = format(addYears(new Date(), term), 'yyyy-MM-dd');

      setNewLoan({
        id: (loans.length + 1).toString(),
        name: 'New Custom Loan',
        principal,
        interestRate,
        term,
        deadline,
        totalInterest,
        monthlyPayment,
      });
    }
  };
  
  const today = new Date();

  return (
    <div className="grid gap-8 md:grid-cols-2">
      <Card>
        <CardHeader>
          <CardTitle>Loan Calculator</CardTitle>
          <CardDescription>Estimate your monthly payments and total interest.</CardDescription>
        </CardHeader>
        <CardContent className="space-y-4">
          <div className="space-y-2">
            <Label htmlFor="principal">Loan Amount</Label>
            <div className="relative">
              <DollarSign className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-muted-foreground" />
              <Input id="principal" type="number" placeholder="e.g., 20000" value={principal} onChange={(e) => setPrincipal(e.target.value === '' ? '' : parseFloat(e.target.value))} className="pl-8" />
            </div>
          </div>
          <div className="space-y-2">
            <Label htmlFor="interest">Interest Rate (%)</Label>
            <div className="relative">
              <Percent className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-muted-foreground" />
              <Input id="interest" type="number" placeholder="e.g., 5.5" value={interestRate} onChange={(e) => setInterestRate(e.target.value === '' ? '' : parseFloat(e.target.value))} className="pl-8" />
            </div>
          </div>
          <div className="space-y-2">
            <Label htmlFor="term">Loan Term (Years)</Label>
            <div className="relative">
              <Calendar className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-muted-foreground" />
              <Input id="term" type="number" placeholder="e.g., 10" value={term} onChange={(e) => setTerm(e.target.value === '' ? '' : parseFloat(e.target.value))} className="pl-8" />
            </div>
          </div>
        </CardContent>
        <CardFooter>
          <Button onClick={handleCalculate} disabled={!principal || !interestRate || !term}>Calculate</Button>
        </CardFooter>
        {newLoan && (
          <CardContent>
            <Alert>
              <AlertTitle>Calculation Result</AlertTitle>
              <AlertDescription>
                <div className="mt-4 space-y-2">
                  <p><strong>Monthly Payment:</strong> ${newLoan.monthlyPayment?.toFixed(2)}</p>
                  <p><strong>Total Interest:</strong> ${newLoan.totalInterest?.toFixed(2)}</p>
                  <p><strong>Payoff Date:</strong> {format(new Date(newLoan.deadline), 'MMMM dd, yyyy')}</p>
                </div>
              </AlertDescription>
            </Alert>
          </CardContent>
        )}
      </Card>
      <div className="space-y-6">
        <Card>
          <CardHeader>
            <CardTitle>Your Loans</CardTitle>
            <CardDescription>Overview of your active loans.</CardDescription>
          </CardHeader>
          <CardContent className="space-y-4">
            {loans.map((loan) => {
              const deadlineDate = new Date(loan.deadline);
              const daysLeft = differenceInDays(deadlineDate, today);
              const isUpcoming = daysLeft > 0 && daysLeft <= 30;
              return (
                <div key={loan.id}>
                  {isUpcoming && (
                     <Alert variant="destructive" className="mb-4">
                       <AlertCircle className="h-4 w-4" />
                       <AlertTitle>Deadline Approaching!</AlertTitle>
                       <AlertDescription>
                         Payment for {loan.name} is due in {daysLeft} days.
                       </AlertDescription>
                     </Alert>
                  )}
                  <div className="flex justify-between items-center">
                    <div>
                      <p className="font-semibold">{loan.name}</p>
                      <p className="text-sm text-muted-foreground">Principal: ${loan.principal.toLocaleString()}</p>
                    </div>
                    <div>
                      <p className="font-semibold text-right">{loan.interestRate}% APR</p>
                      <p className="text-sm text-muted-foreground text-right">Ends {format(deadlineDate, 'MMM yyyy')}</p>
                    </div>
                  </div>
                </div>
              );
            })}
          </CardContent>
        </Card>
      </div>
    </div>
  );
}

'use client';

import { useState } from 'react';
import { Card, CardContent, CardDescription, CardFooter, CardHeader, CardTitle } from '@/components/ui/card';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Button } from '@/components/ui/button';
import { Alert, AlertDescription, AlertTitle } from '@/components/ui/alert';
import type { Loan } from '@/lib/types';
import { Percent, Calendar, AlertCircle, Trash2 } from 'lucide-react';
import { addYears, format, differenceInDays } from 'date-fns';
import { useCurrency } from '@/context/currency-context';
import { formatCurrency } from '@/lib/utils';

const initialLoans: Loan[] = [
  { id: '1', name: 'Student Loan', principal: 20000, interestRate: 5.5, term: 10, deadline: format(addYears(new Date(), 10), 'yyyy-MM-dd') },
  { id: '2', name: 'Car Loan', principal: 15000, interestRate: 4.2, term: 5, deadline: format(addYears(new Date(), 5), 'yyyy-MM-dd') },
];

export function LoanCalculator() {
  const { currency, exchangeRates } = useCurrency();
  const convert = (amount: number) => amount * exchangeRates[currency.code];
  const [loans, setLoans] = useState<Loan[]>(initialLoans);
  
  const [loanName, setLoanName] = useState<string>('');
  const [principal, setPrincipal] = useState<number | ''>('');
  const [interestRate, setInterestRate] = useState<number | ''>('');
  const [term, setTerm] = useState<number | ''>('');
  
  const [calculation, setCalculation] = useState<{monthlyPayment: number, totalInterest: number} | null>(null);

  const handleAddLoan = () => {
    if (loanName && typeof principal === 'number' && typeof interestRate === 'number' && typeof term === 'number') {
      const localPrincipal = principal / exchangeRates[currency.code];
      
      const newLoan: Loan = {
        id: new Date().getTime().toString(),
        name: loanName,
        principal: localPrincipal,
        interestRate,
        term,
        deadline: format(addYears(new Date(), term), 'yyyy-MM-dd'),
      };

      setLoans([...loans, newLoan]);

      // Reset form
      setLoanName('');
      setPrincipal('');
      setInterestRate('');
      setTerm('');
      setCalculation(null);
    }
  };

  const handleCalculate = () => {
     if (typeof principal === 'number' && typeof interestRate === 'number' && typeof term === 'number') {
        const localPrincipal = principal / exchangeRates[currency.code];
        const rate = interestRate / 100 / 12;
        const n = term * 12;
        const monthlyPayment = (localPrincipal * rate * Math.pow(1 + rate, n)) / (Math.pow(1 + rate, n) - 1);
        const totalInterest = monthlyPayment * n - localPrincipal;
        setCalculation({ monthlyPayment, totalInterest });
     }
  }

  const handleRemoveLoan = (id: string) => {
    setLoans(loans.filter((loan) => loan.id !== id));
  };
  
  const today = new Date();

  return (
    <div className="grid gap-8 md:grid-cols-2">
      <Card>
        <CardHeader>
          <CardTitle>Add a New Loan</CardTitle>
          <CardDescription>Enter loan details to add it to your list and calculate payments.</CardDescription>
        </CardHeader>
        <CardContent className="space-y-4">
          <div className="space-y-2">
            <Label htmlFor="name">Loan Name</Label>
            <Input id="name" placeholder="e.g., Personal Loan" value={loanName} onChange={(e) => setLoanName(e.target.value)} />
          </div>
          <div className="space-y-2">
            <Label htmlFor="principal">Loan Amount ({currency.code})</Label>
            <div className="relative">
              <span className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-muted-foreground">{currency.symbol}</span>
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
        <CardFooter className="justify-between">
          <Button onClick={handleCalculate} variant="secondary" disabled={!principal || !interestRate || !term}>Calculate Payment</Button>
          <Button onClick={handleAddLoan} disabled={!loanName || !principal || !interestRate || !term}>Add Loan</Button>
        </CardFooter>
        {calculation && (
          <CardContent>
            <Alert>
              <AlertTitle>Calculation Result</AlertTitle>
              <AlertDescription>
                <div className="mt-4 space-y-2">
                  <p><strong>Monthly Payment:</strong> {formatCurrency(convert(calculation.monthlyPayment), currency.code)}</p>
                  <p><strong>Total Interest:</strong> {formatCurrency(convert(calculation.totalInterest), currency.code)}</p>
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
                      <p className="text-sm text-muted-foreground">Principal: {formatCurrency(convert(loan.principal), currency.code)}</p>
                    </div>
                    <div className="text-right">
                      <p className="font-semibold">{loan.interestRate}% APR</p>
                      <p className="text-sm text-muted-foreground">Ends {format(deadlineDate, 'MMM yyyy')}</p>
                    </div>
                     <Button variant="ghost" size="icon" className="h-8 w-8" onClick={() => handleRemoveLoan(loan.id)}>
                        <Trash2 className="h-4 w-4" />
                    </Button>
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

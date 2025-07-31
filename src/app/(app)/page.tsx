'use client';

import { useState } from 'react';
import { DollarSign, CreditCard, Landmark, Users, PlusCircle, Trash2 } from 'lucide-react';
import { Card, CardContent, CardHeader, CardTitle, CardFooter } from '@/components/ui/card';
import { ExpenseChart } from '@/components/dashboard/expense-chart';
import { RecentTransactions } from '@/components/dashboard/recent-transactions';
import type { Transaction } from '@/lib/types';
import { useCurrency } from '@/context/currency-context';
import { formatCurrency } from '@/lib/utils';
import { Button } from '@/components/ui/button';
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogTrigger } from '@/components/ui/dialog';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';

const initialTransactions: Transaction[] = [
  { id: '1', date: new Date().toISOString(), name: 'Coffee Shop', category: 'Food', type: 'debit', amount: 5.5 },
  { id: '2', date: new Date().toISOString(), name: 'Salary Deposit', category: 'Income', type: 'credit', amount: 2500 },
  { id: '3', date: new Date().toISOString(), name: 'Groceries', category: 'Shopping', type: 'debit', amount: 75.2 },
  { id: '4', date: new Date().toISOString(), name: 'Netflix Subscription', category: 'Entertainment', type: 'debit', amount: 15.0 },
];

const initialLoans = 15000;

function AddTransactionForm({ onAddTransaction }: { onAddTransaction: (t: Transaction) => void }) {
    const [name, setName] = useState('');
    const [amount, setAmount] = useState<number | ''>('');
    const [type, setType] = useState<'credit' | 'debit'>('debit');
    const [category, setCategory] = useState('');
    const { currency } = useCurrency();

    const handleSubmit = (e: React.FormEvent) => {
        e.preventDefault();
        if (name && amount && type && category) {
            onAddTransaction({
                id: new Date().getTime().toString(),
                date: new Date().toISOString(),
                name,
                amount: Number(amount),
                type,
                category,
            });
            setName('');
            setAmount('');
            setType('debit');
            setCategory('');
        }
    };

    return (
        <form onSubmit={handleSubmit} className="space-y-4">
            <div className="space-y-2">
                <Label htmlFor="name">Transaction Name</Label>
                <Input id="name" value={name} onChange={(e) => setName(e.target.value)} placeholder="e.g., Coffee" required />
            </div>
            <div className="space-y-2">
                <Label htmlFor="amount">Amount ({currency.code})</Label>
                 <div className="relative">
                    <span className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-muted-foreground">{currency.symbol}</span>
                    <Input id="amount" type="number" value={amount} onChange={(e) => setAmount(e.target.value === '' ? '' : parseFloat(e.target.value))} placeholder="e.g., 5.50" className="pl-8" required />
                </div>
            </div>
            <div className="space-y-2">
                <Label htmlFor="type">Type</Label>
                <Select onValueChange={(value: 'credit' | 'debit') => setType(value)} defaultValue={type}>
                    <SelectTrigger id="type">
                        <SelectValue placeholder="Select type" />
                    </SelectTrigger>
                    <SelectContent>
                        <SelectItem value="debit">Expense (Debit)</SelectItem>
                        <SelectItem value="credit">Income (Credit)</SelectItem>
                    </SelectContent>
                </Select>
            </div>
             <div className="space-y-2">
                <Label htmlFor="category">Category</Label>
                <Input id="category" value={category} onChange={(e) => setCategory(e.target.value)} placeholder="e.g., Food" required />
            </div>
            <Button type="submit" className="w-full">Add Transaction</Button>
        </form>
    );
}

export default function DashboardPage() {
  const { currency, exchangeRates } = useCurrency();
  const [transactions, setTransactions] = useState<Transaction[]>(initialTransactions);
  const [isAddTransactionOpen, setAddTransactionOpen] = useState(false);
  
  const convert = (amount: number) => amount * exchangeRates[currency.code];

  const totalIncome = transactions.filter(t => t.type === 'credit').reduce((sum, t) => sum + t.amount, 0);
  const totalExpenses = transactions.filter(t => t.type === 'debit').reduce((sum, t) => sum + t.amount, 0);
  const netBalance = totalIncome - totalExpenses;
  const totalLoans = initialLoans; // This remains static for now

  const handleAddTransaction = (transaction: Omit<Transaction, 'id' | 'date'>) => {
    const localAmount = transaction.amount / exchangeRates[currency.code];
    const newTransaction: Transaction = {
        ...transaction,
        id: new Date().getTime().toString(),
        date: new Date().toISOString(),
        amount: localAmount
    };
    setTransactions(prev => [newTransaction, ...prev]);
    setAddTransactionOpen(false);
  };
  
  const handleRemoveTransaction = (id: string) => {
    setTransactions(transactions.filter(t => t.id !== id));
  }

  return (
    <div className="flex-1 space-y-4 p-4 md:p-8 pt-6">
      <div className="flex items-center justify-between space-y-2">
        <h2 className="text-3xl font-bold tracking-tight">Dashboard</h2>
         <Dialog open={isAddTransactionOpen} onOpenChange={setAddTransactionOpen}>
            <DialogTrigger asChild>
                <Button>
                    <PlusCircle className="mr-2" />
                    Add Transaction
                </Button>
            </DialogTrigger>
            <DialogContent>
                <DialogHeader>
                    <DialogTitle>Add a New Transaction</DialogTitle>
                </DialogHeader>
                <AddTransactionForm onAddTransaction={handleAddTransaction} />
            </DialogContent>
        </Dialog>
      </div>
      <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-4">
        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">Total Income</CardTitle>
            <DollarSign className="h-4 w-4 text-muted-foreground" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">{formatCurrency(convert(totalIncome), currency.code)}</div>
            <p className="text-xs text-muted-foreground">Based on current transactions</p>
          </CardContent>
        </Card>
        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">Total Expenses</CardTitle>
            <CreditCard className="h-4 w-4 text-muted-foreground" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">{formatCurrency(convert(totalExpenses), currency.code)}</div>
            <p className="text-xs text-muted-foreground">Based on current transactions</p>
          </CardContent>
        </Card>
        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">Net Balance</CardTitle>
            <Users className="h-4 w-4 text-muted-foreground" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">{formatCurrency(convert(netBalance), currency.code)}</div>
            <p className="text-xs text-muted-foreground">Your current balance</p>
          </CardContent>
        </Card>
        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">Active Loans</CardTitle>
            <Landmark className="h-4 w-4 text-muted-foreground" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">{formatCurrency(convert(totalLoans), currency.code)}</div>
            <p className="text-xs text-muted-foreground">Total from loans page</p>
          </CardContent>
        </Card>
      </div>
      <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-7">
        <div className="lg:col-span-4">
          <ExpenseChart data={transactions} />
        </div>
        <div className="lg:col-span-3">
          <RecentTransactions transactions={transactions} onRemoveTransaction={handleRemoveTransaction} />
        </div>
      </div>
    </div>
  );
}

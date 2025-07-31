import { DollarSign, CreditCard, Landmark, Users } from 'lucide-react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { ExpenseChart } from '@/components/dashboard/expense-chart';
import { RecentTransactions } from '@/components/dashboard/recent-transactions';
import type { Transaction } from '@/lib/types';

const mockTransactions: Transaction[] = [
  { id: '1', date: '2024-07-26', name: 'Coffee Shop', category: 'Food', type: 'debit', amount: 5.5 },
  { id: '2', date: '2024-07-25', name: 'Salary Deposit', category: 'Income', type: 'credit', amount: 2500 },
  { id: '3', date: '2024-07-24', name: 'Groceries', category: 'Shopping', type: 'debit', amount: 75.2 },
  { id: '4', date: '2024-07-23', name: 'Netflix Subscription', category: 'Entertainment', type: 'debit', amount: 15.0 },
  { id: '5', date: '2024-06-28', name: 'Gasoline', category: 'Transport', type: 'debit', amount: 45.0 },
  { id: '6', date: '2024-06-15', name: 'Bookstore', category: 'Shopping', type: 'debit', amount: 32.8 },
  { id: '7', date: '2024-05-25', name: 'Freelance Payment', category: 'Income', type: 'credit', amount: 500 },
];

const totalIncome = mockTransactions.filter(t => t.type === 'credit').reduce((sum, t) => sum + t.amount, 0);
const totalExpenses = mockTransactions.filter(t => t.type === 'debit').reduce((sum, t) => sum + t.amount, 0);
const netBalance = totalIncome - totalExpenses;
const totalLoans = 15000;


export default function DashboardPage() {
  return (
    <div className="flex-1 space-y-4 p-4 md:p-8 pt-6">
      <div className="flex items-center justify-between space-y-2">
        <h2 className="text-3xl font-bold tracking-tight">Dashboard</h2>
      </div>
      <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-4">
        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">Total Income</CardTitle>
            <DollarSign className="h-4 w-4 text-muted-foreground" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">${totalIncome.toFixed(2)}</div>
            <p className="text-xs text-muted-foreground">+20.1% from last month</p>
          </CardContent>
        </Card>
        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">Total Expenses</CardTitle>
            <CreditCard className="h-4 w-4 text-muted-foreground" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">${totalExpenses.toFixed(2)}</div>
            <p className="text-xs text-muted-foreground">+180.1% from last month</p>
          </CardContent>
        </Card>
        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">Net Balance</CardTitle>
            <Users className="h-4 w-4 text-muted-foreground" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">${netBalance.toFixed(2)}</div>
            <p className="text-xs text-muted-foreground">+19% from last month</p>
          </CardContent>
        </Card>
        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">Active Loans</CardTitle>
            <Landmark className="h-4 w-4 text-muted-foreground" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">${totalLoans.toFixed(2)}</div>
            <p className="text-xs text-muted-foreground">+2 since last hour</p>
          </CardContent>
        </Card>
      </div>
      <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-7">
        <div className="lg:col-span-4">
          <ExpenseChart data={mockTransactions} />
        </div>
        <div className="lg:col-span-3">
          <RecentTransactions transactions={mockTransactions.slice(0, 5)} />
        </div>
      </div>
    </div>
  );
}

'use client';

import { Badge } from '@/components/ui/badge';
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from '@/components/ui/card';
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from '@/components/ui/table';
import type { Transaction } from '@/lib/types';
import { cn, formatCurrency } from '@/lib/utils';
import { useCurrency } from '@/context/currency-context';
import { Button } from '@/components/ui/button';
import { Trash2 } from 'lucide-react';

interface RecentTransactionsProps {
  transactions: Transaction[];
  onRemoveTransaction: (id: string) => void;
}

export function RecentTransactions({ transactions, onRemoveTransaction }: RecentTransactionsProps) {
  const { currency, exchangeRates } = useCurrency();
  const convert = (amount: number) => amount * exchangeRates[currency.code];

  return (
    <Card>
      <CardHeader>
        <CardTitle>Recent Transactions</CardTitle>
        <CardDescription>A list of your most recent transactions.</CardDescription>
      </CardHeader>
      <CardContent>
        <Table>
          <TableHeader>
            <TableRow>
              <TableHead>Name</TableHead>
              <TableHead>Category</TableHead>
              <TableHead className="text-right">Amount</TableHead>
              <TableHead className="w-[50px]"></TableHead>
            </TableRow>
          </TableHeader>
          <TableBody>
            {transactions.map((transaction) => (
              <TableRow key={transaction.id}>
                <TableCell className="font-medium">{transaction.name}</TableCell>
                <TableCell>
                  <Badge variant="outline">{transaction.category}</Badge>
                </TableCell>
                <TableCell
                  className={cn(
                    'text-right font-medium',
                    transaction.type === 'credit' ? 'text-green-600' : 'text-red-600'
                  )}
                >
                  {transaction.type === 'credit' ? '+' : '-'}
                  {formatCurrency(convert(transaction.amount), currency.code)}
                </TableCell>
                <TableCell>
                  <Button variant="ghost" size="icon" className="h-8 w-8" onClick={() => onRemoveTransaction(transaction.id)}>
                    <Trash2 className="h-4 w-4" />
                  </Button>
                </TableCell>
              </TableRow>
            ))}
          </TableBody>
        </Table>
      </CardContent>
    </Card>
  );
}

'use client';

import { Bar, BarChart, ResponsiveContainer, XAxis, YAxis } from 'recharts';

import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import type { Transaction } from '@/lib/types';
import { useCurrency } from '@/context/currency-context';
import { formatCurrency } from '@/lib/utils';

interface ExpenseChartProps {
  data: Transaction[];
}

export function ExpenseChart({ data }: ExpenseChartProps) {
  const { currency, exchangeRates } = useCurrency();
  const convert = (amount: number) => amount * exchangeRates[currency.code];
  
  const chartData = data
    .filter((t) => t.type === 'debit')
    .reduce((acc, transaction) => {
      const month = new Date(transaction.date).toLocaleString('default', { month: 'short' });
      const existing = acc.find((item) => item.name === month);
      if (existing) {
        existing.total += transaction.amount;
      } else {
        acc.push({ name: month, total: transaction.amount });
      }
      return acc;
    }, [] as { name: string; total: number }[])
    .map(item => ({ ...item, total: convert(item.total)}));

  return (
    <Card>
      <CardHeader>
        <CardTitle>Expense Overview</CardTitle>
      </CardHeader>
      <CardContent className="pl-2">
        <ResponsiveContainer width="100%" height={350}>
          <BarChart data={chartData}>
            <XAxis
              dataKey="name"
              stroke="#888888"
              fontSize={12}
              tickLine={false}
              axisLine={false}
            />
            <YAxis
              stroke="#888888"
              fontSize={12}
              tickLine={false}
              axisLine={false}
              tickFormatter={(value) => formatCurrency(value as number, currency.code, { notation: 'compact' })}
            />
            <Bar dataKey="total" fill="var(--color-primary)" radius={[4, 4, 0, 0]} />
          </BarChart>
        </ResponsiveContainer>
      </CardContent>
    </Card>
  );
}

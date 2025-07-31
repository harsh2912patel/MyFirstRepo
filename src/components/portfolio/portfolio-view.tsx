'use client';

import { Card, CardContent, CardHeader, CardTitle, CardFooter } from '@/components/ui/card';
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from '@/components/ui/table';
import { Area, AreaChart, ResponsiveContainer, Tooltip, XAxis, YAxis } from 'recharts';
import type { Investment } from '@/lib/types';
import { cn } from '@/lib/utils';
import { Badge } from '@/components/ui/badge';

const mockInvestments: Investment[] = [
  { id: '1', name: 'Apple Inc.', ticker: 'AAPL', type: 'Stock', quantity: 10, purchasePrice: 150, currentPrice: 214.29 },
  { id: '2', name: 'Vanguard S&P 500 ETF', ticker: 'VOO', type: 'ETF', quantity: 5, purchasePrice: 400, currentPrice: 502.83 },
  { id: '3', name: 'Microsoft Corp.', ticker: 'MSFT', type: 'Stock', quantity: 8, purchasePrice: 300, currentPrice: 449.78 },
  { id: '4', name: 'Invesco QQQ Trust', ticker: 'QQQ', type: 'ETF', quantity: 7, purchasePrice: 350, currentPrice: 483.51 },
];

const portfolioHistory = [
  { month: 'Jan', value: 5800 },
  { month: 'Feb', value: 5950 },
  { month: 'Mar', value: 6200 },
  { month: 'Apr', value: 6100 },
  { month: 'May', value: 6500 },
  { month: 'Jun', value: 6800 },
  { month: 'Jul', value: 7214 },
];

const totalValue = mockInvestments.reduce((sum, inv) => sum + inv.quantity * inv.currentPrice, 0);
const totalCost = mockInvestments.reduce((sum, inv) => sum + inv.quantity * inv.purchasePrice, 0);
const totalGain = totalValue - totalCost;

export function PortfolioView() {
  return (
    <div className="grid gap-8">
      <Card>
        <CardHeader>
          <CardTitle>Portfolio Performance</CardTitle>
        </CardHeader>
        <CardContent className="h-[300px]">
          <ResponsiveContainer width="100%" height="100%">
            <AreaChart data={portfolioHistory} margin={{ top: 5, right: 20, left: -10, bottom: 5 }}>
              <defs>
                <linearGradient id="colorValue" x1="0" y1="0" x2="0" y2="1">
                  <stop offset="5%" stopColor="var(--color-primary)" stopOpacity={0.8}/>
                  <stop offset="95%" stopColor="var(--color-primary)" stopOpacity={0}/>
                </linearGradient>
              </defs>
              <XAxis dataKey="month" stroke="#888888" fontSize={12} />
              <YAxis stroke="#888888" fontSize={12} domain={['dataMin - 200', 'dataMax + 200']} tickFormatter={(value) => `$${value}`} />
              <Tooltip
                contentStyle={{
                  backgroundColor: 'hsl(var(--background))',
                  borderColor: 'hsl(var(--border))',
                }}
              />
              <Area type="monotone" dataKey="value" stroke="var(--color-primary)" fillOpacity={1} fill="url(#colorValue)" />
            </AreaChart>
          </ResponsiveContainer>
        </CardContent>
      </Card>

      <Card>
        <CardHeader>
          <CardTitle>Your Investments</CardTitle>
        </CardHeader>
        <CardContent>
          <Table>
            <TableHeader>
              <TableRow>
                <TableHead>Asset</TableHead>
                <TableHead>Type</TableHead>
                <TableHead className="text-right">Quantity</TableHead>
                <TableHead className="text-right">Current Value</TableHead>
                <TableHead className="text-right">Total Gain/Loss</TableHead>
              </TableRow>
            </TableHeader>
            <TableBody>
              {mockInvestments.map((investment) => {
                const currentValue = investment.quantity * investment.currentPrice;
                const gainLoss = currentValue - investment.quantity * investment.purchasePrice;
                return (
                  <TableRow key={investment.id}>
                    <TableCell>
                      <div className="font-medium">{investment.name}</div>
                      <div className="text-sm text-muted-foreground">{investment.ticker}</div>
                    </TableCell>
                    <TableCell><Badge variant="secondary">{investment.type}</Badge></TableCell>
                    <TableCell className="text-right">{investment.quantity}</TableCell>
                    <TableCell className="text-right">${currentValue.toFixed(2)}</TableCell>
                    <TableCell className={cn('text-right font-medium', gainLoss >= 0 ? 'text-green-600' : 'text-red-600')}>
                      {gainLoss >= 0 ? '+' : ''}${gainLoss.toFixed(2)}
                    </TableCell>
                  </TableRow>
                );
              })}
            </TableBody>
          </Table>
        </CardContent>
        <CardFooter className="font-bold text-lg flex justify-end gap-8">
            <div>
                Total Value: <span className="text-primary">${totalValue.toFixed(2)}</span>
            </div>
            <div>
                Total Gain: <span className={cn(totalGain >= 0 ? 'text-green-600' : 'text-red-600')}>${totalGain.toFixed(2)}</span>
            </div>
        </CardFooter>
      </Card>
    </div>
  );
}

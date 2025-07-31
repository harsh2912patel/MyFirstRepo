export type Transaction = {
  id: string;
  date: string;
  name: string;
  category: string;
  type: 'credit' | 'debit';
  amount: number;
};

export type Loan = {
  id: string;
  name: string;
  principal: number;
  interestRate: number;
  term: number; // in years
  deadline: string;
  totalInterest?: number;
  monthlyPayment?: number;
};

export type Investment = {
  id: string;
  name: string;
  ticker: string;
  type: 'Stock' | 'ETF';
  quantity: number;
  purchasePrice: number;
  currentPrice: number;
};

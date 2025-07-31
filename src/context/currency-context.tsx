
'use client';

import { createContext, useContext, useState, ReactNode } from 'react';

type Currency = {
  code: 'USD' | 'GBP' | 'INR';
  symbol: '$' | '£' | '₹';
};

type ExchangeRates = {
  [key in Currency['code']]: number;
};

// Based on USD as the base currency
const exchangeRates: ExchangeRates = {
  USD: 1,
  GBP: 0.79, // 1 USD = 0.79 GBP
  INR: 83.45, // 1 USD = 83.45 INR
};

export const currencies: Currency[] = [
  { code: 'USD', symbol: '$' },
  { code: 'GBP', symbol: '£' },
  { code: 'INR', symbol: '₹' },
];

interface CurrencyContextType {
  currency: Currency;
  setCurrency: (currency: Currency) => void;
  exchangeRates: ExchangeRates;
}

const CurrencyContext = createContext<CurrencyContextType | undefined>(undefined);

export const CurrencyProvider = ({ children }: { children: ReactNode }) => {
  const [currency, setCurrency] = useState<Currency>(currencies[2]);

  return (
    <CurrencyContext.Provider value={{ currency, setCurrency, exchangeRates }}>
      {children}
    </CurrencyContext.Provider>
  );
};

export const useCurrency = () => {
  const context = useContext(CurrencyContext);
  if (context === undefined) {
    throw new Error('useCurrency must be used within a CurrencyProvider');
  }
  return context;
};

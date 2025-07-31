
'use client';

import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from '@/components/ui/select';
import { currencies, useCurrency } from '@/context/currency-context';

export function CurrencySwitcher() {
  const { currency, setCurrency } = useCurrency();

  const handleCurrencyChange = (value: string) => {
    const newCurrency = currencies.find((c) => c.code === value);
    if (newCurrency) {
      setCurrency(newCurrency);
    }
  };

  return (
    <div className="px-4 mt-auto mb-4">
       <Select onValueChange={handleCurrencyChange} defaultValue={currency.code}>
        <SelectTrigger>
            <SelectValue placeholder="Select Currency" />
        </SelectTrigger>
        <SelectContent>
            {currencies.map((c) => (
            <SelectItem key={c.code} value={c.code}>
                {c.symbol} {c.code}
            </SelectItem>
            ))}
        </SelectContent>
        </Select>
    </div>
  );
}

import React, { createContext, useContext, useState, useEffect } from 'react';

export type Currency = 'UZS' | 'USD' | 'EUR' | 'RUB';

interface CurrencyContextType {
  currency: Currency;
  setCurrency: (c: Currency) => void;
  rates: Record<Currency, number>; // Курсы относительно базовой валюты (UZS)
  convert: (amountInUzs: number, toCurrency?: Currency) => number;
  formatAmount: (amountInUzs: number) => string;
  loading: boolean;
}

const DEFAULT_RATES: Record<Currency, number> = {
  UZS: 1,
  USD: 12800,
  EUR: 13900,
  RUB: 140,
};

const SYMBOLS: Record<Currency, string> = {
  UZS: 'сум',
  USD: '$',
  EUR: '€',
  RUB: '₽',
};

const CurrencyContext = createContext<CurrencyContextType | undefined>(undefined);

export const CurrencyProvider: React.FC<{ children: React.ReactNode }> = ({ children }) => {
  const [currency, setCurrencyState] = useState<Currency>(() => {
    return (localStorage.getItem('currency') as Currency) || 'UZS';
  });

  const [rates, setRates] = useState<Record<Currency, number>>(DEFAULT_RATES);
  const [loading, setLoading] = useState<boolean>(true);

  const setCurrency = (c: Currency) => {
    setCurrencyState(c);
    localStorage.setItem('currency', c);
  };

  // Загрузка реальных курсов ЦБ
  useEffect(() => {
    const fetchRates = async () => {
      try {
        const response = await fetch('https://cbu.uz/ru/arkhiv-kursov-valyut/json/');
        const data = await response.json();
        
        const fetchedRates: Record<Currency, number> = { ...DEFAULT_RATES };
        
        data.forEach((item: { Ccy: string; Rate: string }) => {
          if (item.Ccy === 'USD' || item.Ccy === 'EUR' || item.Ccy === 'RUB') {
            fetchedRates[item.Ccy as Currency] = parseFloat(item.Rate);
          }
        });

        setRates(fetchedRates);
      } catch (error) {
        console.warn('Не удалось загрузить актуальные курсы ЦБ, используются базовые:', error);
      } finally {
        setLoading(false);
      }
    };

    fetchRates();
  }, []);

  const convert = (amountInUzs: number, targetCurrency: Currency = currency): number => {
    const rate = rates[targetCurrency] || 1;
    return amountInUzs / rate;
  };

  const formatAmount = (amountInUzs: number): string => {
    const converted = convert(amountInUzs);
    const symbol = SYMBOLS[currency];
    
    if (currency === 'UZS') {
      return `${Math.round(converted).toLocaleString('ru-RU')} ${symbol}`;
    }
    return `${symbol}${converted.toLocaleString('ru-RU', { minimumFractionDigits: 2, maximumFractionDigits: 2 })}`;
  };

  return (
    <CurrencyContext.Provider value={{ currency, setCurrency, rates, convert, formatAmount, loading }}>
      {children}
    </CurrencyContext.Provider>
  );
};

export const useCurrency = () => {
  const context = useContext(CurrencyContext);
  if (!context) {
    throw new Error('useCurrency must be used within a CurrencyProvider');
  }
  return context;
};
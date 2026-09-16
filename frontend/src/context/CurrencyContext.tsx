'use client';

import React, { createContext, useContext, useState, ReactNode } from 'react';

export type Currency = 'INR';
export type AreaUnit = 'SQFT' | 'SQYD';

interface CurrencyContextType {
  currency: Currency;
  setCurrency: (c: Currency) => void;
  areaUnit: AreaUnit;
  setAreaUnit: (u: AreaUnit) => void;
  formatPrice: (inrAmount: number) => string;
  formatArea: (sqftAmount: number) => string;
}

const CurrencyContext = createContext<CurrencyContextType | undefined>(undefined);

export function CurrencyProvider({ children }: { children: ReactNode }) {
  const [currency, setCurrency] = useState<Currency>('INR');
  const [areaUnit, setAreaUnit] = useState<AreaUnit>('SQFT');

  // Format price in Indian Rupee (Crores / Lakhs) for Vadodara Estates
  const formatPrice = (inrAmount: number): string => {
    if (inrAmount >= 10000000) {
      const crores = inrAmount / 10000000;
      return `₹${crores.toFixed(1)} Cr`;
    }
    if (inrAmount >= 100000) {
      const lakhs = inrAmount / 100000;
      return `₹${lakhs.toFixed(1)} Lakh`;
    }
    return `₹${inrAmount.toLocaleString('en-IN')}`;
  };

  // Format area in SQ FT or SQ YD (Square Yards / Vaar - standard in Vadodara, Gujarat)
  const formatArea = (sqftAmount: number): string => {
    if (areaUnit === 'SQYD') {
      const sqyd = Math.round(sqftAmount / 9);
      return `${sqyd.toLocaleString()} SQ YD`;
    }
    return `${sqftAmount.toLocaleString()} SQ FT`;
  };

  return (
    <CurrencyContext.Provider
      value={{
        currency,
        setCurrency,
        areaUnit,
        setAreaUnit,
        formatPrice,
        formatArea,
      }}
    >
      {children}
    </CurrencyContext.Provider>
  );
}

export function useCurrency() {
  const context = useContext(CurrencyContext);
  if (!context) {
    throw new Error('useCurrency must be used within a CurrencyProvider');
  }
  return context;
}

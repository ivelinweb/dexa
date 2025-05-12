"use client";

import useConverterHook, { ConversionRates } from "@/hooks/converter.hook";
import { createContext, useContext } from "react";

export type ConverterContextType = {
  getRates: (
    tokens: string[],
    targetCurrency: string
  ) => Promise<ConversionRates | undefined>;
  usdRate: ConversionRates;
  bnbRate: ConversionRates;
};

interface Props {
  children: React.ReactNode;
}

export const ConverterContext = createContext<ConverterContextType | undefined>(
  undefined
);

export function ConverterProvider({ children }: Props) {
  const converter = useConverterHook();

  return (
    <ConverterContext.Provider
      value={{
        ...converter,
      }}
    >
      {children}
    </ConverterContext.Provider>
  );
}

export function useConverter() {
  const context = useContext(ConverterContext);
  if (context === undefined) {
    throw new Error("useConverter must be used within a ConverterProvider");
  }
  return context;
}

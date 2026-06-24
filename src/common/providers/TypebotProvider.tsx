'use client';

import { createContext, useCallback, useContext, useState, ReactNode } from 'react';

interface TypebotContextType {
  isOpen: boolean;
  openTypebot: () => void;
  closeTypebot: () => void;
}

const TypebotContext = createContext<TypebotContextType | undefined>(undefined);

interface TypebotProviderProps {
  children: ReactNode;
}

export const TypebotProvider = ({ children }: TypebotProviderProps) => {
  const [isOpen, setIsOpen] = useState(false);

  const openTypebot = useCallback(() => {
    setIsOpen(true);
  }, []);

  const closeTypebot = useCallback(() => {
    setIsOpen(false);
  }, []);

  return (
    <TypebotContext.Provider value={{ isOpen, openTypebot, closeTypebot }}>
      {children}
    </TypebotContext.Provider>
  );
};

export const useTypebot = () => {
  const context = useContext(TypebotContext);
  if (context === undefined) {
    throw new Error('useTypebot must be used within a TypebotProvider');
  }
  return context;
};


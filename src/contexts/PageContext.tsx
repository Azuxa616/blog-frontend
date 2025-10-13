'use client';
import { createContext, useContext, useState, ReactNode } from 'react';

interface PageContextType {
  isExpanded: boolean;
  setIsExpanded: (expanded: boolean) => void;
  isTransitioning: boolean;
  setIsTransitioning: (transitioning: boolean) => void;
}

const PageContext = createContext<PageContextType | undefined>(undefined);

export function PageProvider({ children }: { children: ReactNode }) {
  const [isExpanded, setIsExpanded] = useState(false);
  const [isTransitioning, setIsTransitioning] = useState(false);

  return (
    <PageContext.Provider value={{
      isExpanded,
      setIsExpanded,
      isTransitioning,
      setIsTransitioning
    }}>
      {children}
    </PageContext.Provider>
  );
}

export function usePage() {
  const context = useContext(PageContext);
  if (!context) {
    throw new Error('usePage must be used within PageProvider');
  }
  return context;
}

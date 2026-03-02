'use client';

import { createContext, useCallback, useContext, useEffect, useState } from 'react';
import { usePathname } from 'next/navigation';

import { NavigationLoadingOverlay } from '../components/modal/Modal/NavigationLoadingOverlay';

type NavigationContextValue = {
  setNavigating: (value: boolean) => void;
};

const NavigationContext = createContext<NavigationContextValue | null>(null);

export function useNavigationContext(): NavigationContextValue | null {
  return useContext(NavigationContext);
}

export function NavigationProvider({ children }: { children: React.ReactNode }) {
  const [isNavigating, setIsNavigating] = useState(false);
  const pathname = usePathname();

  useEffect(() => {
    setIsNavigating(false);
  }, [pathname]);

  const setNavigating = useCallback((value: boolean) => {
    setIsNavigating(value);
  }, []);

  const value: NavigationContextValue = { setNavigating };

  return (
    <NavigationContext.Provider value={value}>
      {children}
      {isNavigating ? <NavigationLoadingOverlay /> : null}
    </NavigationContext.Provider>
  );
}

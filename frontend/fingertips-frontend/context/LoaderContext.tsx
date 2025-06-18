'use client';

import React, {
  ReactNode,
  createContext,
  useContext,
  useMemo,
  useState,
  useEffect,
} from 'react';
import { usePathname } from 'next/navigation';
import { LoadingBox } from 'govuk-react';
import { useSearchStateParams } from '@/components/hooks/useSearchStateParams';

export type LoaderContext = {
  getIsLoading: () => boolean;
  setIsLoading: (loading: boolean) => void;
};

type LoaderContextProvider = {
  children: ReactNode;
};

const LoaderContext = createContext<LoaderContext | undefined>(undefined);

export const LoaderProvider: React.FC<LoaderContextProvider> = ({
  children,
}) => {
  const pathname = usePathname();
  const searchState = useSearchStateParams();

  const [isLoading, setIsLoading] = useState<boolean>(true);

  const contextValue: LoaderContext = useMemo(
    () => ({
      getIsLoading: () => isLoading,
      setIsLoading,
    }),
    [isLoading, setIsLoading]
  );

  useEffect(() => {
    setIsLoading(false);
  }, [setIsLoading, pathname, searchState]);

  return (
    <LoaderContext.Provider value={contextValue}>
      <LoadingBox loading={isLoading} timeIn={200} timeOut={200}>
        {children}
      </LoadingBox>
    </LoaderContext.Provider>
  );
};

export const useLoadingState = () => {
  const context = useContext(LoaderContext);

  if (!context) {
    throw new Error('useLoadingState must be used within a LoaderProvider');
  }

  return context;
};

'use client';

import React, {
  ReactNode,
  createContext,
  useContext,
  useMemo,
  useState,
} from 'react';
import { SearchStateParams } from '@/lib/searchStateManager';

export type SearchStateContext = {
  getSearchState: () => SearchStateParams;
  setSearchState: (state: SearchStateParams) => void;
};

type SearchStateContextProvider = {
  children: ReactNode;
};

const SearchStateContext = createContext<SearchStateContext | undefined>(
  undefined
);

export const SearchStateProvider: React.FC<SearchStateContextProvider> = ({
  children,
}) => {
  const [searchState, setSearchState] = useState<SearchStateParams>({});

  const contextValue: SearchStateContext = useMemo(
    () => ({
      getSearchState: () => searchState,
      setSearchState,
    }),
    [searchState, setSearchState]
  );

  return (
    <SearchStateContext.Provider value={contextValue}>
      {children}
    </SearchStateContext.Provider>
  );
};

export const useSearchState = () => {
  const context = useContext(SearchStateContext);

  if (!context) {
    throw new Error('useLoadingState must be used within a LoaderProvider');
  }

  return context;
};

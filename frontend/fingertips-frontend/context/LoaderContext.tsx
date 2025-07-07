'use client';

import React, {
  ReactNode,
  createContext,
  useContext,
  useMemo,
  useState,
  useEffect,
  Suspense,
  Dispatch,
  SetStateAction,
} from 'react';
import { usePathname } from 'next/navigation';
import { LoadingBox } from 'govuk-react';
import { useSearchStateParams } from '@/components/hooks/useSearchStateParams';
import { SearchStateParams } from '@/lib/searchStateManager';

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
  const [searchState, setSearchState] = useState<SearchStateParams>({});

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
      <Suspense>
        <SuspendedUseSearchStateParams setSearchState={setSearchState} />
      </Suspense>
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

// Next has a very peculiar quirk where useSearchState cannot be called server
// side, which works fine during dev but build will fail.
// Here we're creating a component which will not render server side by
// suspending it until client mounts at which point it can set the loading
// context value, all this is more complicated because loader context is in a
// layout.
function SuspendedUseSearchStateParams({
  setSearchState,
}: Readonly<{ setSearchState: Dispatch<SetStateAction<SearchStateParams>> }>) {
  const searchParams = useSearchStateParams();
  useEffect(() => {
    setSearchState(searchParams);
  }, [searchParams, setSearchState]);

  return null;
}

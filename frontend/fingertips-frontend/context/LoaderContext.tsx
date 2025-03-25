import React, {
  ReactNode,
  createContext,
  useContext,
  useMemo,
  useState,
} from 'react';

export type LoaderContext = {
  isLoading: boolean;
  setIsLoading: (loading: boolean) => void;
};

type LoaderContextProvider = {
  children: ReactNode;
};

const LoaderContext = createContext<LoaderContext | undefined>(undefined);

export const LoaderProvider: React.FC<LoaderContextProvider> = ({
  children,
}) => {
  const [isLoading, setIsLoading] = useState<boolean>(true);

  const contextValue: LoaderContext = useMemo(
    () => ({
      isLoading,
      setIsLoading,
    }),
    [isLoading, setIsLoading]
  );

  return (
    <LoaderContext.Provider value={contextValue}>
      {children}
    </LoaderContext.Provider>
  );
};

export const useLoader = () => {
  const context = useContext(LoaderContext);

  if (!context) {
    throw new Error('useLoader must be used within a LoaderProvider');
  }

  return context;
};

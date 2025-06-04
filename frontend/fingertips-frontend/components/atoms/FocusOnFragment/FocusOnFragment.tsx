'use client';

import { FC, useEffect } from 'react';
import { useSearchParams } from 'next/navigation';
import { useLoadingState } from '@/context/LoaderContext';

export const FocusOnFragment: FC = () => {
  const query = useSearchParams();
  const loadingState = useLoadingState();

  useEffect(() => {
    if (!window) return;
    const hash = window.location.hash.substring(1);
    if (!hash) return;

    const element = document.getElementById(hash);
    if (!element) return;

    element.focus();
  }, [query, loadingState]);

  return null;
};

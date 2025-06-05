'use client';

import { FC, useEffect } from 'react';
import { useLoadingState } from '@/context/LoaderContext';
import { useSearchParams } from 'next/navigation';

export const FocusOnFragment: FC = () => {
  const loadingState = useLoadingState();
  const searchParams = useSearchParams();

  useEffect(() => {
    if (!window) return;
    const hash = window.location.hash.substring(1);
    if (!hash) return;

    const element = document.getElementById(hash);
    if (!element) return;

    element.focus();
  }, [searchParams, loadingState]);

  return null;
};

'use client';

import { FC, useEffect } from 'react';
import { useSearchParams } from 'next/navigation';

const FocusOnFragment: FC = () => {
  const query = useSearchParams();

  useEffect(() => {
    if (!window) return;
    const hash = window.location.hash.substring(1);
    if (!hash) return;

    const element = document.getElementById(hash);
    if (!element) return;

    element.focus();
  }, [query]);

  return null;
};

export default FocusOnFragment;

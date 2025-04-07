import { useCallback, useEffect, useRef, useState } from 'react';

const isAboveBottomOfWindow = (yourElement: HTMLElement | null) => {
  if (!yourElement) return false;
  const windowHeight = window.innerHeight;
  const { top } = yourElement.getBoundingClientRect();
  return top < windowHeight;
};

export const useMoreRowsWhenScrolling = <T>(
  rows: T[],
  incrementRowCount: number
) => {
  const timerRef = useRef<NodeJS.Timeout>(undefined);
  const triggerRef = useRef<HTMLDivElement | null>(null);
  const numberOfRowsRef = useRef(incrementRowCount);

  const [rowsToShow, setRowsToShow] = useState<T[]>(
    rows.slice(0, incrementRowCount)
  );

  const addMore = useCallback(() => {
    const isHidden = !isAboveBottomOfWindow(triggerRef.current);
    const isComplete = numberOfRowsRef.current >= rows.length;

    // if trigger is off the bottom of the screen or all rows are now shown
    // then cancel the timer and stop
    if (isHidden || isComplete) {
      clearInterval(timerRef.current);
      timerRef.current = undefined;
      return false;
    }

    // add more rows to show
    numberOfRowsRef.current += incrementRowCount;
    const isThereMore = numberOfRowsRef.current < rows.length;
    // call the setState callback supplied
    setRowsToShow(rows.slice(0, numberOfRowsRef.current));

    return isThereMore;
  }, [incrementRowCount, rows, setRowsToShow]);

  const startChecking = useCallback(() => {
    // timer is already in play
    if (timerRef.current) return;

    // stop it there is no more to add
    const isThereMore = addMore();
    if (!isThereMore) return;

    // there is more - so start a timer to add more
    // until trigger is offscreen or all rows are loaded
    timerRef.current = setInterval(addMore, 100);
  }, [addMore]);

  useEffect(() => {
    // check as soon as component mounts
    startChecking();

    // check on scroll
    const controller = new AbortController();
    const { signal } = controller;
    window.addEventListener('scroll', startChecking, { signal });

    return () => {
      controller.abort();
      clearInterval(timerRef.current);
    };
  }, [addMore, startChecking]);

  return { triggerRef, rowsToShow, hasMore: rowsToShow.length < rows.length };
};

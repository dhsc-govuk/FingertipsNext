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

  const [nRowsToShow, setNRowsToShow] = useState<number>(incrementRowCount);
  const isThereMore = nRowsToShow < rows.length;

  const addMore = useCallback(() => {
    // if trigger is off the bottom of the screen do nothing
    const isHidden = !isAboveBottomOfWindow(triggerRef.current);
    if (isHidden) return;

    setNRowsToShow((prev) => prev + incrementRowCount);
  }, [incrementRowCount]);

  useEffect(() => {
    // if it's a short list then may not need any of this
    if (!isThereMore) return;

    // timer to check if the trigger is back in view
    clearInterval(timerRef.current);
    timerRef.current = setInterval(addMore, 250);
    return () => {
      clearInterval(timerRef.current);
    };
  }, [addMore, isThereMore]);

  useEffect(() => {
    // if the source array has changed/replaced, start again
    setNRowsToShow(incrementRowCount);
  }, [rows, incrementRowCount]);

  const nRowsToHide = Math.max(0, rows.length - nRowsToShow);

  return {
    triggerRef,
    rowsToShow: rows.slice(0, nRowsToShow),
    hasMore: nRowsToShow < rows.length,
    nRowsToHide,
    nRowsToShow,
  };
};

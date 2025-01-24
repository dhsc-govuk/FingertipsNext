import { Direction } from '@/lib/common-types';
import React from 'react';

interface ArrowProps {
  direction: Direction;
}

export function Arrow({ direction }: Readonly<ArrowProps>) {
  return (
    <svg
      data-testid="arrow-icon"
      xmlns="http://www.w3.org/2000/svg"
      width="15"
      height="15"
      viewBox="0 0 20 20"
      fill="none"
      stroke="#000000"
      strokeWidth="1.5"
      strokeLinecap="square"
    >
      {direction === Direction.UP && (
        <path data-testid="arrow-up" d="M12 19V6M5 12l7-7 7 7" />
      )}
      {direction === Direction.DOWN && (
        <path data-testid="arrow-down" d="M12 5v13M5 12l7 7 7-7" />
      )}
      {direction === Direction.RIGHT && (
        <path data-testid="arrow-right" d="M5 12h13M12 5l7 7-7 7" />
      )}
    </svg>
  );
}

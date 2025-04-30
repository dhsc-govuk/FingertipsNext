import { Direction } from '@/lib/common-types';
import React from 'react';

interface ArrowProps {
  direction: Direction;
  strokeColour?: string;
}

const arrowRotations = {
  [Direction.UP]: 'rotate(0)',
  [Direction.RIGHT]: 'rotate(90 10 10)',
  [Direction.DOWN]: 'rotate(180 10 10)',
  [Direction.LEFT]: 'rotate(-90 10 10)',
};

export function Arrow({
  direction,
  strokeColour = '#000000',
}: Readonly<ArrowProps>) {
  return (
    <svg
      data-testid="arrow-icon"
      xmlns="http://www.w3.org/2000/svg"
      width="15"
      height="15"
      viewBox="0 0 20 20"
      fill="none"
      stroke={strokeColour}
      strokeWidth="1.5"
      strokeLinecap="square"
    >
      <g transform={arrowRotations[direction]}>
        <path data-testid={`arrow-${direction}`} d="M12 19V6M5 12l7-7 7 7" />
      </g>
    </svg>
  );
}

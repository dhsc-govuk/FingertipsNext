import { Direction } from '@/lib/common-types';
import React from 'react';

interface ArrowProps {
  direction: Direction;
  strokeColour?: string;
}

export function Arrow({
  direction,
  strokeColour = '#000000',
}: Readonly<ArrowProps>) {
  const getRotation = () => {
    switch (direction) {
      case Direction.UP:
        return 'rotate(0)';
      case Direction.RIGHT:
        return 'rotate(90 10 10)';
      case Direction.DOWN:
        return 'rotate(180 10 10)';
      case Direction.LEFT:
        return 'rotate(-90 10 10)';
      default:
        return 'rotate(0)';
    }
  };

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
      <g transform={getRotation()}>
        <path data-testid={`arrow-${direction}`} d="M12 19V6M5 12l7-7 7 7" />
      </g>
    </svg>
  );
}

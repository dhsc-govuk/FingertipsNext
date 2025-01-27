'use client';

import styled from 'styled-components';

interface RemoveIconProps {
  width: string;
  height: string;
  color: string;
}

const StyledIconSvg = styled('svg')({
  cursor: 'pointer',
  // verticalAlign: 'middle',
});

export function RemoveIcon({
  width,
  height,
  color,
}: Readonly<RemoveIconProps>) {
  return (
    <StyledIconSvg
      data-testid="x-icon"
      xmlns="http://www.w3.org/2000/svg"
      width={width}
      height={height}
      viewBox="0 0 25 25"
      fill="none"
      stroke={color}
      strokeWidth="3"
      strokeLinecap="round"
      strokeLinejoin="round"
    >
      <line x1="18" y1="6" x2="6" y2="18"></line>
      <line x1="6" y1="6" x2="18" y2="18"></line>
    </StyledIconSvg>
  );
}

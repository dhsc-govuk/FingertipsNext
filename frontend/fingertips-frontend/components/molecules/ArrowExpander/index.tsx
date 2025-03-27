'use client';
import React, { useState } from 'react';
import { ArrowToggleButton } from '@/components/molecules/ArrowToggleButton';
import styled from 'styled-components';

const StyleButtonExpander = styled('div')({
  display: 'flex',
  flexDirection: 'row',
  justifyContent: 'left',
  alignItems: 'center',
});

const StyleTextSpanExpander = styled('div')<{ fill?: string }>(({ fill }) => ({
  fontWeight: '300',
  display: 'inline-block',
  fontSize: '19px',
  color: fill,
  textAlign: 'center',
  padding: '2px 1px 1px 1px',
}));

interface ExpanderProps {
  children: React.ReactNode;
  fill?: string;
}
export const ArrowExpander = ({
  children,
  fill = '#1D70B8',
}: ExpanderProps) => {
  const [isOpen, setIsOpen] = useState<boolean>();
  return (
    <>
      <StyleButtonExpander>
        <ArrowToggleButton
          fill={fill}
          width={30}
          height={30}
          onToggle={(isOpen: boolean) => {
            setIsOpen(isOpen);
            return isOpen;
          }}
        />
        <StyleTextSpanExpander fill={fill}>
          {isOpen ? 'Show' : 'Hide'}
        </StyleTextSpanExpander>
      </StyleButtonExpander>
      {isOpen ? children : null}
    </>
  );
};

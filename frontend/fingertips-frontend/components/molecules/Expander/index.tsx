'use client';
import React, { useState } from 'react';
import { ArrowToggleButton } from '@/components/molecules/ArrowToggleButton';

interface ExpanderProps {
  children: React.ReactNode;
}
export const Expander = ({ children }: ExpanderProps) => {
  const [isOpen, setIsOpen] = useState<boolean>();
  return (
    <div style={{ margin: '0px', padding: '0px' }}>
      <div
        style={{
          display: 'flex',
          flexDirection: 'row',
          justifyContent: 'left',
          alignItems: 'center',
        }}
      >
        <ArrowToggleButton
          fill="#1D70B8"
          onToggle={(isOpen: boolean) => {
            console.log('Is open = ' + isOpen);
            setIsOpen(isOpen);
            return isOpen;
          }}
        />
        <span style={{ fontWeight: 300 }}>{isOpen ? 'Show' : 'Hide'}</span>
      </div>
      {isOpen ? children : null}
    </div>
  );
};

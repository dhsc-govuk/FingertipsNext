'use client';
import React, { useState } from 'react';
import { ArrowToggleButton } from '@/components/molecules/ArrowToggleButton';
import styled from 'styled-components';
import { Label } from 'govuk-react';
import { GovukColours } from '@/lib/styleHelpers/colours';
import { typography } from '@govuk-react/lib';

const StyleButtonExpander = styled('span')({
  'display': 'flex',
  'flexDirection': 'row',
  'justifyContent': 'left',
  'width': 'fit-content',
  'margin': '0px',
  'marginBottom': '15px',
  'flexWrap': 'wrap',
  'cursor': 'pointer',
  'padding': '0px',
  'alignItems': 'center',
  ':hover svg circle': {
    fill: GovukColours.Black,
    stroke: GovukColours.Black,
  },

  ':hover svg path': {
    stroke: GovukColours.White,
  },
});

const StyleLabelTextForExpander = styled(Label)<{ fill?: string }>(
  ({ fill }) => (
    typography.font({ size: 19, lineHeight: '19' }),
    {
      fontWeight: '300',
      color: fill,
      padding: '2px 1px 1px 1px',
      cursor: 'pointer',
      spacing: 0,
      fontSize: 19,
    }
  )
);

interface ExpanderProps {
  children: React.ReactNode;
  fill?: string;
  openTitle?: string;
  closeTitle?: string;
  open?: boolean;
}
export const ArrowExpander = ({
  children,
  fill = '#1D70B8',
  openTitle,
  closeTitle,
  open = false,
}: ExpanderProps) => {
  const [isOpen, setIsOpen] = useState<boolean>(open);
  return (
    <>
      <StyleButtonExpander onClick={() => setIsOpen(!isOpen)}>
        <ArrowToggleButton fill={fill} width={30} height={30} isOpen={isOpen} />
        <StyleLabelTextForExpander fill={fill}>
          {isOpen ? closeTitle : openTitle}
        </StyleLabelTextForExpander>
      </StyleButtonExpander>
      {isOpen ? children : null}
    </>
  );
};

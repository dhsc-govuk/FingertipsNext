'use client';
import React, { useState } from 'react';
import { ArrowToggleButton } from '@/components/molecules/ArrowToggleButton';
import styled from 'styled-components';
import { Label } from 'govuk-react';
import { GovukColours } from '@/lib/styleHelpers/colours';

const StyleButtonExpander = styled('span')({
  'display': 'flex',
  'flexDirection': 'row',
  'justifyContent': 'left',
  'width': 'fit-content',
  'flexWrap': 'wrap',
  'cursor': 'pointer',
  'padding': '5px',
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
  ({ fill }) => ({
    fontWeight: '300',
    fontSize: '19px',
    color: fill,
    padding: '2px 1px 1px 1px',
    cursor: 'pointer',
  })
);

interface ExpanderProps {
  children: React.ReactNode;
  fill?: string;
  openTitle?: string;
  closeTitle?: string;
}
export const ArrowExpander = ({
  children,
  fill = '#1D70B8',
  openTitle,
  closeTitle,
}: ExpanderProps) => {
  const [isOpen, setIsOpen] = useState<boolean>();
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

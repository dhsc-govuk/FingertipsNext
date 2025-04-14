'use client';
import React from 'react';
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
  toggleClickFunction: () => void;
}
export const ArrowExpander = ({
  children,
  fill = '#1D70B8',
  openTitle = 'Open',
  closeTitle = 'Close',
  open = false,
  toggleClickFunction,
}: ExpanderProps) => {
  return (
    <>
      <StyleButtonExpander onClick={() => toggleClickFunction()}>
        <ArrowToggleButton fill={fill} width={30} height={30} isOpen={open} />
        <StyleLabelTextForExpander fill={fill}>
          {open ? closeTitle : openTitle}
        </StyleLabelTextForExpander>
      </StyleButtonExpander>
      {open ? children : null}
    </>
  );
};

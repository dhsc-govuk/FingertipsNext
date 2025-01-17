'use client';

import React from 'react';
import { Trend } from '@/lib/common-types';
import styled from 'styled-components';
import { Paragraph, Tag } from 'govuk-react';
import { typography } from '@govuk-react/lib';

interface TagProps {
  displayedText: string;
  color:
    | 'SOLID'
    | 'GREY'
    | 'GREEN'
    | 'TURQUOISE'
    | 'BLUE'
    | 'PURPLE'
    | 'PINK'
    | 'RED'
    | 'ORANGE'
    | 'YELLOW'
    | undefined;
  trend: Trend;
}

const StyledDivContainer = styled('div')({
  display: 'flex',
});
const StyledSpan = styled('span')({});

const StyledDefaultTag = styled(Tag)({
  textTransform: 'unset',
});

const StyledParagraph = styled(Paragraph)(
  {
    marginBottom: '0',
  },
  typography.font({ size: 16 })
);

export function TrendTag({ displayedText, color, trend }: Readonly<TagProps>) {
  return (
    <div>
      <StyledDefaultTag tint={color}>
        <StyledDivContainer>
          <div>
            {trend === Trend.INCREASING && (
              <StyledParagraph>UP</StyledParagraph>
            )}
            {trend === Trend.DECREASING && 'DOWN'}
            {trend === Trend.NO_SIGNIFICANT_CHANGE && 'NO SIG'}
          </div>
          <div>
            <StyledParagraph>{displayedText}</StyledParagraph>
          </div>
        </StyledDivContainer>
      </StyledDefaultTag>
    </div>
  );
}

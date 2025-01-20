'use client';

import React from 'react';
import { Direction, Trend, TrendCondition } from '@/lib/common-types';
import styled from 'styled-components';
import { Paragraph, Tag } from 'govuk-react';
import { typography } from '@govuk-react/lib';
import { Arrow } from '@/components/atoms/Arrow';

interface TagProps {
  trend: Trend;
  trendCondition?: TrendCondition;
}

const StyledDivContainer = styled('div')({
  display: 'flex',
  justifyContent: 'center',
  alignItems: 'center',
});

const StyledDefaultTag = styled(Tag)({
  textTransform: 'unset',
  margin: '0.3125em',
});

const StyledParagraph = styled(Paragraph)(
  {
    marginBottom: '0',
    marginLeft: '0.3125em',
  },
  typography.font({ size: 14 })
);

export function TrendTag({ trend, trendCondition }: Readonly<TagProps>) {
  const color =
    trend === Trend.NO_SIGNIFICANT_CHANGE
      ? 'YELLOW'
      : !trendCondition
        ? 'GREY'
        : trendCondition === TrendCondition.GETTING_BETTER
          ? 'GREEN'
          : 'RED';
  return (
    <div data-testid="trendTag-container">
      <StyledDefaultTag tint={color}>
        <StyledDivContainer data-testid="tag-component">
          <div>
            {trend === Trend.INCREASING && <Arrow direction={Direction.UP} />}
            {trend === Trend.DECREASING && <Arrow direction={Direction.DOWN} />}
            {trend === Trend.NO_SIGNIFICANT_CHANGE && (
              <Arrow direction={Direction.RIGHT} />
            )}
          </div>
          <div>
            <StyledParagraph>
              {trend === Trend.NO_SIGNIFICANT_CHANGE
                ? trend
                : trend + ' ' + (trendCondition ?? '')}
            </StyledParagraph>
          </div>
        </StyledDivContainer>
      </StyledDefaultTag>
    </div>
  );
}

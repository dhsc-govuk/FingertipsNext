'use client';

import React from 'react';
import { Direction, Trend, TrendCondition } from '@/lib/common-types';
import styled from 'styled-components';
import { Paragraph, Tag } from 'govuk-react';
import { typography } from '@govuk-react/lib';
import { Arrow } from '@/components/atoms/Arrow';

interface TagProps {
  trend: Trend;
  useArrow?: boolean;
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

function getColour(trend: Trend, trendCondition: TrendCondition | undefined) {
  if (trend === Trend.NO_SIGNIFICANT_CHANGE || trend === Trend.SIMILAR)
    return 'YELLOW';
  if (
    trend === Trend.BETTER ||
    trendCondition === TrendCondition.GETTING_BETTER
  )
    return 'GREEN';
  if (trend === Trend.WORSE || trendCondition === TrendCondition.GETTING_WORSE)
    return 'RED';
  return 'GREY';
}

function displayTrendCondition(trendCondition: TrendCondition | undefined) {
  return trendCondition ? `and ${trendCondition}` : '';
}

export function TrendTag({
  trend,
  useArrow = true,
  trendCondition = undefined,
}: Readonly<TagProps>) {
  const color = getColour(trend, trendCondition);
  return (
    <div data-testid="trendTag-container">
      <StyledDefaultTag tint={color}>
        <StyledDivContainer data-testid="tag-component">
          {useArrow && (
            <div>
              {trend === Trend.INCREASING && <Arrow direction={Direction.UP} />}
              {trend === Trend.DECREASING && (
                <Arrow direction={Direction.DOWN} />
              )}
              {trend === Trend.NO_SIGNIFICANT_CHANGE && (
                <Arrow direction={Direction.RIGHT} />
              )}
            </div>
          )}
          <div>
            <StyledParagraph>
              {trend === Trend.NO_SIGNIFICANT_CHANGE
                ? trend
                : trend + ' ' + displayTrendCondition(trendCondition)}
            </StyledParagraph>
          </div>
        </StyledDivContainer>
      </StyledDefaultTag>
    </div>
  );
}

'use client';

import React from 'react';
import { Direction, Trend, TrendCondition } from '@/lib/common-types';
import styled from 'styled-components';
import { Paragraph, Tag } from 'govuk-react';
import { typography } from '@govuk-react/lib';
import { Arrow } from '@/components/atoms/Arrow';
import { TagColours } from '@/lib/styleHelpers/colours';

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

const StyledDefaultTag = styled(Tag)<{
  trend: Trend;
  trendCondition?: TrendCondition;
}>(({ trend, trendCondition }) => {
  return {
    textTransform: 'unset',
    margin: '0.3125em',
    color: TagColours.GreyText,
    ...getColour(trend, trendCondition),
  };
});

const StyledParagraph = styled(Paragraph)(
  {
    marginBottom: '0',
    marginLeft: '0.3125em',
  },
  typography.font({ size: 14 })
);

const getColour = (trend: Trend, trendCondition?: TrendCondition) => {
  if (trend === Trend.NO_SIGNIFICANT_CHANGE)
    return {
      backgroundColor: TagColours.YellowBackground,
      color: TagColours.YellowText,
    };

  if (trendCondition === TrendCondition.GETTING_BETTER)
    return {
      backgroundColor: TagColours.GreenBackground,
      color: TagColours.GreenText,
    };

  if (trendCondition === TrendCondition.GETTING_WORSE)
    return {
      backgroundColor: TagColours.RedBackground,
      color: TagColours.RedText,
    };
  if (trend === Trend.DECREASING)
    return {
      backgroundColor: TagColours.LightBlueBackground,
    };
  if (trend === Trend.INCREASING)
    return {
      backgroundColor: TagColours.LightBlue,
    };
  return {};
};

const displayTrendCondition = (trendCondition?: TrendCondition) => {
  return trendCondition ? `and ${trendCondition}` : '';
};

const arrowDirectionMap: Partial<Record<Trend, Direction>> = {
  [Trend.INCREASING]: Direction.UP,
  [Trend.DECREASING]: Direction.DOWN,
  [Trend.NO_SIGNIFICANT_CHANGE]: Direction.RIGHT,
};

export const TrendTag = ({
  trend,
  useArrow = true,
  trendCondition,
}: Readonly<TagProps>) => {
  const arrowDirection = useArrow ? arrowDirectionMap[trend] : null;
  const trendMessage =
    trend === Trend.NO_SIGNIFICANT_CHANGE
      ? trend
      : trend + ' ' + displayTrendCondition(trendCondition);

  return (
    <div data-testid="trendTag-container">
      <StyledDefaultTag trend={trend} trendCondition={trendCondition}>
        <StyledDivContainer data-testid="tag-component">
          {arrowDirection ? (
            <div>
              <Arrow direction={arrowDirection} />
            </div>
          ) : null}
          <div>
            <StyledParagraph>{trendMessage}</StyledParagraph>
          </div>
        </StyledDivContainer>
      </StyledDefaultTag>
    </div>
  );
};

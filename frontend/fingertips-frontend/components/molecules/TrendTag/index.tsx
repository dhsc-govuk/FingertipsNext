'use client';

import React from 'react';
import { Direction, Trend, TrendCondition } from '@/lib/common-types';
import styled from 'styled-components';
import { Paragraph, Tag } from 'govuk-react';
import { typography } from '@govuk-react/lib';
import { Arrow } from '@/components/atoms/Arrow';
import { TagColours } from '@/lib/styleHelpers/colours';
import {
  getTrendColour,
  getTrendConditionColours,
} from '@/components/molecules/TrendTag/trendTagConfig';
import { HealthDataPointTrendEnum } from '@/generated-sources/ft-api-client/models/HealthDataPoint';

interface TagProps {
  trendFromRes: HealthDataPointTrendEnum;
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
  const trendConditionColours =
    trend !== Trend.NO_SIGNIFICANT_CHANGE && trend !== Trend.NOT_AVAILABLE
      ? getTrendConditionColours(trendCondition)
      : null;

  return {
    textTransform: 'unset',
    margin: '0.3125em',
    color: TagColours.GreyText,
    ...getTrendColour(trend),
    ...trendConditionColours,
  };
});

const StyledParagraph = styled(Paragraph)(
  {
    marginBottom: '0',
    marginLeft: '0.3125em',
  },
  typography.font({ size: 14 })
);

const displayTrendCondition = (trendCondition?: TrendCondition) => {
  return trendCondition ? `and ${trendCondition}` : '';
};

const arrowDirectionMap: Partial<Record<Trend, Direction>> = {
  [Trend.INCREASING]: Direction.UP,
  [Trend.DECREASING]: Direction.DOWN,
  [Trend.NO_SIGNIFICANT_CHANGE]: Direction.RIGHT,
  [Trend.NOT_AVAILABLE]: undefined,
};

interface MappedTrend {
  trend: Trend;
  trendCondition?: TrendCondition;
}

/**
 * Breaks down the trend string returned from the API to a trend and trend condition.
 * @param trendResString - string returned from the API representing the trend.
 * @returns - the mapped trend broken into trend and trend condition.
 */
export const mapTrendResponse = (
  trendResString: HealthDataPointTrendEnum
): MappedTrend => {
  switch (trendResString) {
    case HealthDataPointTrendEnum.NoSignificantChange:
      return { trend: Trend.NO_SIGNIFICANT_CHANGE };
    case HealthDataPointTrendEnum.Increasing:
      return { trend: Trend.INCREASING };
    case HealthDataPointTrendEnum.Decreasing:
      return { trend: Trend.DECREASING };
    case HealthDataPointTrendEnum.NotYetCalculated:
    case HealthDataPointTrendEnum.CannotBeCalculated:
      return { trend: Trend.NOT_AVAILABLE };
  }

  const isIncreasing = trendResString.startsWith('Increasing');
  const isGettingBetter = trendResString.endsWith('getting better');

  return {
    trend: isIncreasing ? Trend.INCREASING : Trend.DECREASING,
    trendCondition: isGettingBetter
      ? TrendCondition.GETTING_BETTER
      : TrendCondition.GETTING_WORSE,
  };
};

export const TrendTag = ({ trendFromRes }: Readonly<TagProps>) => {
  const { trend, trendCondition } = mapTrendResponse(trendFromRes);
  const arrowDirection = arrowDirectionMap[trend];
  const trendMessage =
    trend === Trend.NO_SIGNIFICANT_CHANGE || trend === Trend.NOT_AVAILABLE
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

'use client';
import { Tag } from 'govuk-react';
import styled from 'styled-components';
import React from 'react';
import { getBenchmarkTagStyle } from '@/components/organisms/BenchmarkLabel/BenchmarkLabelConfig';
import {
  BenchmarkComparisonMethod,
  BenchmarkOutcome,
  IndicatorPolarity,
} from '@/generated-sources/ft-api-client';

interface BenchmarkLabelProps {
  outcome?: BenchmarkOutcome;
  method?: BenchmarkComparisonMethod;
  polarity?: IndicatorPolarity;
}

export const BenchmarkTagStyle = styled(Tag)<{
  outcome: BenchmarkOutcome;
  comparisonMethod: BenchmarkComparisonMethod;
  polarity: IndicatorPolarity;
}>(({ outcome, comparisonMethod, polarity }) => {
  const theme = getBenchmarkTagStyle(comparisonMethod, outcome, polarity);

  return {
    padding: '5px 8px 4px 8px',
    alignItems: 'center',
    margin: '0.3125em',
    fontWeight: '300',
    textTransform: 'unset',
    ...theme,
  };
});

export const getBenchmarkLabelText = (type: BenchmarkOutcome) => {
  const validTypes = Object.values(BenchmarkOutcome);
  return validTypes.includes(type) && type !== BenchmarkOutcome.NotCompared
    ? type
    : 'Not compared';
};

export const BenchmarkLabel: React.FC<BenchmarkLabelProps> = ({
  outcome,
  method,
  polarity,
}) => {
  const outcomeParsed =
    (outcome as BenchmarkOutcome) ?? BenchmarkOutcome.NotCompared;
  const methodParsed =
    (method as BenchmarkComparisonMethod) ??
    BenchmarkComparisonMethod.CIOverlappingReferenceValue95;
  const polarityParsed =
    (polarity as IndicatorPolarity) ?? IndicatorPolarity.Unknown;

  const labelText = getBenchmarkLabelText(outcomeParsed);
  return (
    <BenchmarkTagStyle
      outcome={outcomeParsed}
      comparisonMethod={methodParsed}
      polarity={polarityParsed}
    >
      {labelText}
    </BenchmarkTagStyle>
  );
};

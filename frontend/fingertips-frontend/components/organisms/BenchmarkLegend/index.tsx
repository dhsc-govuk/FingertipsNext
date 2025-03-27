'use client';

import { BenchmarkLabel } from '@/components/organisms/BenchmarkLabel';
import styled from 'styled-components';
import { FC } from 'react';
import {
  BenchmarkComparisonMethod,
  BenchmarkOutcome,
  IndicatorPolarity,
} from '@/generated-sources/ft-api-client';
import { getConfidenceLimitNumber } from '@/lib/chartHelpers/chartHelpers';

const LegendContainer = styled.div({
  marginBottom: '2em',
});

const LegendGroup = styled('div')({
  position: 'relative',
  left: '-5px',
});

const DefaultBenchmarkLegendHeaderStyle = styled('h4')({
  alignSelf: 'stretch',
  margin: '1em 0.1em 0.1em 0.1em',
  fontFamily: 'nta,Arial,sans-serif',
  fontWeight: 300,
});

const StyledLegendLabel = styled('span')({
  fontFamily: 'nta,Arial,sans-serif',
  fontWeight: 300,
});

interface BenchmarkLegendProps {
  title?: string;
  benchmarkComparisonMethod?: BenchmarkComparisonMethod;
  polarity?: IndicatorPolarity;
}

const ragOutcomes = [
  BenchmarkOutcome.Better,
  BenchmarkOutcome.Similar,
  BenchmarkOutcome.Worse,
  BenchmarkOutcome.NotCompared,
];
const bobOutcomes = [
  BenchmarkOutcome.Lower,
  BenchmarkOutcome.Similar,
  BenchmarkOutcome.Higher,
  BenchmarkOutcome.NotCompared,
];
const quintilesOutcomes = [
  BenchmarkOutcome.Lowest,
  BenchmarkOutcome.Low,
  BenchmarkOutcome.Middle,
  BenchmarkOutcome.High,
  BenchmarkOutcome.Highest,
];
const quintilesOutcomesWithJudgement = [
  BenchmarkOutcome.Worst,
  BenchmarkOutcome.Worse,
  BenchmarkOutcome.Middle,
  BenchmarkOutcome.Better,
  BenchmarkOutcome.Best,
];

export const getOutcomes = (
  method: BenchmarkComparisonMethod,
  polarity: IndicatorPolarity
): BenchmarkOutcome[] => {
  const withJudement =
    polarity === IndicatorPolarity.HighIsGood ||
    polarity === IndicatorPolarity.LowIsGood;
  if (method === BenchmarkComparisonMethod.Quintiles)
    return withJudement ? quintilesOutcomesWithJudgement : quintilesOutcomes;

  return withJudement ? ragOutcomes : bobOutcomes;
};

export const BenchmarkLegend: FC<BenchmarkLegendProps> = ({
  title = 'Compared to England',
  benchmarkComparisonMethod = BenchmarkComparisonMethod.Unknown,
  polarity = IndicatorPolarity.Unknown,
}) => {
  const confidenceLimit = getConfidenceLimitNumber(benchmarkComparisonMethod);
  const suffix = confidenceLimit ? `(${confidenceLimit}% confidence)` : null;
  const outcomes = getOutcomes(benchmarkComparisonMethod, polarity);

  return (
    <LegendContainer data-testid="benchmarkLegend-component">
      <DefaultBenchmarkLegendHeaderStyle>
        {title}
      </DefaultBenchmarkLegendHeaderStyle>
      <LegendGroup>
        {outcomes.map((outcome) => (
          <BenchmarkLabel
            key={benchmarkComparisonMethod + '_' + outcome}
            method={benchmarkComparisonMethod}
            outcome={outcome}
            polarity={polarity}
          />
        ))}

        {suffix ? <StyledLegendLabel>{suffix}</StyledLegendLabel> : null}
      </LegendGroup>
    </LegendContainer>
  );
};

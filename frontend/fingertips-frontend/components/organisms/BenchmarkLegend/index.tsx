'use client';

import styled from 'styled-components';
import { FC } from 'react';
import {
  BenchmarkComparisonMethod,
  BenchmarkOutcome,
  IndicatorPolarity,
} from '@/generated-sources/ft-api-client';
import BenchmarkLegendGroup from '@/components/organisms/BenchmarkLegend/BenchmarkLegendGroup';

const LegendContainer = styled.div({
  marginBottom: '2em',
});

const BenchmarkLegendHeader = styled('h4')({
  alignSelf: 'stretch',
  margin: '1em 0.1em 0.1em 0',
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
  const outcomes = getOutcomes(benchmarkComparisonMethod, polarity);

  if (benchmarkComparisonMethod === BenchmarkComparisonMethod.Unknown)
    return <BenchmarkLegendAll title={title} />;

  return (
    <LegendContainer data-testid="benchmarkLegend-component">
      <BenchmarkLegendHeader>{title}</BenchmarkLegendHeader>
      <BenchmarkLegendGroup
        polarity={polarity}
        benchmarkComparisonMethod={benchmarkComparisonMethod}
        outcomes={outcomes}
      />
    </LegendContainer>
  );
};

interface BenchmarkLegendAllProps {
  title: string;
}

const BenchmarkLegendAll: FC<BenchmarkLegendAllProps> = ({ title }) => {
  const allRag = [...new Set([...ragOutcomes, ...bobOutcomes])];
  return (
    <LegendContainer data-testid="benchmarkLegend-component">
      <BenchmarkLegendHeader>{title}</BenchmarkLegendHeader>
      <BenchmarkLegendGroup
        polarity={IndicatorPolarity.HighIsGood}
        benchmarkComparisonMethod={
          BenchmarkComparisonMethod.CIOverlappingReferenceValue95
        }
        outcomes={allRag}
      />
      <BenchmarkLegendGroup
        polarity={IndicatorPolarity.HighIsGood}
        benchmarkComparisonMethod={
          BenchmarkComparisonMethod.CIOverlappingReferenceValue99_8
        }
        outcomes={allRag}
      />

      <BenchmarkLegendHeader>Quintiles</BenchmarkLegendHeader>
      <BenchmarkLegendGroup
        polarity={IndicatorPolarity.NoJudgement}
        benchmarkComparisonMethod={BenchmarkComparisonMethod.Quintiles}
        outcomes={quintilesOutcomes}
      />
      <BenchmarkLegendGroup
        polarity={IndicatorPolarity.LowIsGood}
        benchmarkComparisonMethod={BenchmarkComparisonMethod.Quintiles}
        outcomes={quintilesOutcomesWithJudgement}
      />
    </LegendContainer>
  );
};

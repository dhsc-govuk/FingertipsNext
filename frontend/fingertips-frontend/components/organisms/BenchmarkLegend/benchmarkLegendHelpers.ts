import {
  BenchmarkComparisonMethod,
  BenchmarkOutcome,
  IndicatorPolarity,
} from '@/generated-sources/ft-api-client';
import { BenchmarkLegendsToShow } from '@/components/organisms/BenchmarkLegend/benchmarkLegend.types';
import { SpineChartIndicatorData } from '../SpineChartTable/spineChartTableHelpers';

export const hasSomeMethodWithJudgement = (
  orderedIndicatorData: SpineChartIndicatorData[],
  method: BenchmarkComparisonMethod,
  judge: boolean
) => {
  return orderedIndicatorData.some((item) => {
    if (method !== item.benchmarkComparisonMethod) return false;

    const polarity = item.quartileData?.polarity;
    const hasJudgement = isJudgemental(polarity ?? IndicatorPolarity.Unknown);
    return hasJudgement === judge;
  });
};

export const getMethodsAndOutcomes = (orderedIndicatorData: SpineChartIndicatorData[]) => {
  const ci95 = BenchmarkComparisonMethod.CIOverlappingReferenceValue95;
  const ci99 = BenchmarkComparisonMethod.CIOverlappingReferenceValue99_8;
  const quin = BenchmarkComparisonMethod.Quintiles;
  const methods: BenchmarkLegendsToShow = {
    [ci95]: {
      judgement: hasSomeMethodWithJudgement(orderedIndicatorData, ci95, true),
      noJudgement: hasSomeMethodWithJudgement(orderedIndicatorData, ci95, false),
    },
    [ci99]: {
      judgement: hasSomeMethodWithJudgement(orderedIndicatorData, ci99, true),
      noJudgement: hasSomeMethodWithJudgement(orderedIndicatorData, ci99, false),
    },
    [quin]: {
      judgement: hasSomeMethodWithJudgement(orderedIndicatorData, quin, true),
      noJudgement: hasSomeMethodWithJudgement(orderedIndicatorData, quin, false),
    },
  };

  return methods;
};

export const ragOutcomes = [
  BenchmarkOutcome.Better,
  BenchmarkOutcome.Similar,
  BenchmarkOutcome.Worse,
  BenchmarkOutcome.NotCompared,
];

export const bobOutcomes = [
  BenchmarkOutcome.Lower,
  BenchmarkOutcome.Similar,
  BenchmarkOutcome.Higher,
  BenchmarkOutcome.NotCompared,
];

export const quintilesOutcomes = [
  BenchmarkOutcome.Lowest,
  BenchmarkOutcome.Low,
  BenchmarkOutcome.Middle,
  BenchmarkOutcome.High,
  BenchmarkOutcome.Highest,
];

export const quintilesOutcomesWithJudgement = [
  BenchmarkOutcome.Worst,
  BenchmarkOutcome.Worse,
  BenchmarkOutcome.Middle,
  BenchmarkOutcome.Better,
  BenchmarkOutcome.Best,
];

export const isJudgemental = (polarity: IndicatorPolarity) =>
  polarity === IndicatorPolarity.HighIsGood ||
  polarity === IndicatorPolarity.LowIsGood;

export const getOutcomes = (
  method: BenchmarkComparisonMethod,
  polarity: IndicatorPolarity
): BenchmarkOutcome[] => {
  const withJudgement = isJudgemental(polarity);
  if (method === BenchmarkComparisonMethod.Quintiles)
    return withJudgement ? quintilesOutcomesWithJudgement : quintilesOutcomes;

  return withJudgement ? ragOutcomes : bobOutcomes;
};

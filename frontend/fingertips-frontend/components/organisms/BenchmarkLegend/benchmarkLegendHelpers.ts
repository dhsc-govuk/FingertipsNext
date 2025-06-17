import {
  BenchmarkComparisonMethod,
  BenchmarkOutcome,
  IndicatorPolarity,
  QuartileData,
} from '@/generated-sources/ft-api-client';
import { BenchmarkLegendsToShow } from '@/components/organisms/BenchmarkLegend/benchmarkLegend.types';

export interface IndicatorBenchmarkSummary {
  benchmarkComparisonMethod?: BenchmarkComparisonMethod;
  polarity?: IndicatorPolarity;
  quartileData?: QuartileData;
}

export const hasSomeMethodWithJudgement = (
  indicatorData: IndicatorBenchmarkSummary[],
  method: BenchmarkComparisonMethod,
  judge: boolean
) => {
  return indicatorData.some((item) => {
    if (method !== item.benchmarkComparisonMethod) return false;

    const polarity = item.quartileData?.polarity ?? item.polarity;
    const hasJudgement = isJudgemental(polarity ?? IndicatorPolarity.Unknown);
    return hasJudgement === judge;
  });
};

export const getMethodsAndOutcomes = (
  indicatorData: IndicatorBenchmarkSummary[]
) => {
  const ci95 = BenchmarkComparisonMethod.CIOverlappingReferenceValue95;
  const ci99 = BenchmarkComparisonMethod.CIOverlappingReferenceValue99_8;
  const quin = BenchmarkComparisonMethod.Quintiles;
  const methods: BenchmarkLegendsToShow = {
    [ci95]: {
      judgement: hasSomeMethodWithJudgement(indicatorData, ci95, true),
      noJudgement: hasSomeMethodWithJudgement(indicatorData, ci95, false),
    },
    [ci99]: {
      judgement: hasSomeMethodWithJudgement(indicatorData, ci99, true),
      noJudgement: hasSomeMethodWithJudgement(indicatorData, ci99, false),
    },
    [quin]: {
      judgement: hasSomeMethodWithJudgement(indicatorData, quin, true),
      noJudgement: hasSomeMethodWithJudgement(indicatorData, quin, false),
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

const both = {
  judgement: true,
  noJudgement: true,
};

export const allLegendItems: BenchmarkLegendsToShow = {
  [BenchmarkComparisonMethod.CIOverlappingReferenceValue95]: both,
  [BenchmarkComparisonMethod.CIOverlappingReferenceValue99_8]: both,
  [BenchmarkComparisonMethod.Quintiles]: both,
};

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

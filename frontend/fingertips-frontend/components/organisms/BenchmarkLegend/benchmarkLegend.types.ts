import { BenchmarkComparisonMethod } from '@/generated-sources/ft-api-client';

export type BenchmarkLegendHasJudgmentTypes = {
  judgement: boolean;
  noJudgement: boolean;
};

export type BenchmarkLegendsToShow = Partial<
  Record<BenchmarkComparisonMethod, BenchmarkLegendHasJudgmentTypes>
>;

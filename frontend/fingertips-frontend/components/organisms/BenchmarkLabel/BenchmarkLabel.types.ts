import {
  BenchmarkComparisonMethod,
  BenchmarkOutcome,
} from '@/generated-sources/ft-api-client';

export type BenchmarkLabelGroupConfig = Partial<
  Record<BenchmarkComparisonMethod, BenchmarkLabelConfig>
>;

export type BenchmarkLabelConfig = Partial<
  Record<
    BenchmarkOutcome | 'default' | 'middleWithJudgement',
    BenchmarkLabelTypeConfig
  >
>;

export interface BenchmarkLabelTypeConfig {
  backgroundColor?: string;
  color?: string;
  border?: string;
  tint?: string;
}

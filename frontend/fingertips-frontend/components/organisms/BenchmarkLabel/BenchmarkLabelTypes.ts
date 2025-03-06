export const enum BenchmarkLabelType {
  HIGHER = 'Higher',
  LOWER = 'Lower',
  BETTER = 'Better',
  SIMILAR = 'Similar',
  LOWEST = 'Lowest',
  LOW = 'Low',
  MIDDLE = 'Middle',
  HIGH = 'High',
  HIGHEST = 'Highest',
  WORST = 'Worst',
  WORSE = 'Worse',
  BEST = 'Best',
  NOT_COMPARED = 'not_compared',
}

export type TBenchmarkLabelGroupConfig = Partial<
  Record<BenchmarkLabelGroupType, TBenchmarkLabelConfig>
>;

export type TBenchmarkLabelConfig = Partial<
  Record<BenchmarkLabelType | 'default', BenchmarkLabelTypeConfig>
>;

export interface BenchmarkLabelTypeConfig {
  backgroundColor?: string;
  color?: string;
  border?: string;
  tint?: string;
}

export const enum BenchmarkLabelGroupType {
  RAG = 'rag',
  QUINTILES = 'quintiles',
  QUINTILES_WITH_VALUE = 'quintiles_wv',
}

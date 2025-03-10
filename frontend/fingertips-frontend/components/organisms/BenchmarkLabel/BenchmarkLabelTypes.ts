export enum BenchmarkLabelType {
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
  NOT_COMPARED = 'Not compared',
}

export type BenchmarkLabelGroupConfig = Partial<
  Record<BenchmarkLabelGroupType, BenchmarkLabelConfig>
>;

export type BenchmarkLabelConfig = Partial<
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
  RAG_99 = 'rag_99',
  QUINTILES = 'quintiles',
  QUINTILES_WITH_JUDGEMENT = 'quintiles_with_judgement',
}


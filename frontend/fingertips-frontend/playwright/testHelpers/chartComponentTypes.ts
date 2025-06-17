export type BaseChartComponentProps = {
  hasConfidenceIntervals?: boolean;
  isTabTable?: boolean;
  hasDetailsExpander?: boolean;
  hasInequalitiesTimePeriodDropDown?: boolean;
  hasInequalityTypeDropDown?: boolean;
  isWideComponent?: boolean;
  hasRecentTrend?: boolean;
  hasBenchmarkComparisons?: boolean;
  hasPNGExport?: boolean;
  hasSVGExport?: boolean;
  hasCSVExport?: boolean;
  hasTooltipHovers?: boolean;
};

export type ChartComponentDefinition = {
  chartComponentLocator: string;
  chartComponentProps: BaseChartComponentProps;
};

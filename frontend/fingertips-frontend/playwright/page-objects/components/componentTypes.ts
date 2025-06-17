export type BaseComponentProps = {
  hasConfidenceIntervals?: boolean;
  isTabTable?: boolean;
  hasDetailsExpander?: boolean;
  hasInequalitiesTimePeriodDropDown?: boolean;
  hasInequalityTypeDropDown?: boolean;
  isWideComponent?: boolean;
  hasRecentTrend?: boolean;
  showsBenchmarkComparisons?: boolean;
  hasPNGExport?: boolean;
  hasSVGExport?: boolean;
  hasCSVExport?: boolean;
  hasTooltipHovers?: boolean;
};

export type ComponentDefinition = {
  componentLocator: string;
  componentProps: BaseComponentProps;
};

export type BaseComponentProps = {
  hasConfidenceIntervals?: boolean;
  isTabTable?: boolean;
  hasDetailsExpander?: boolean;
  hasTimePeriodDropDown?: boolean;
  hasInequalityTypeDropDown?: boolean;
  isWideComponent?: boolean;
  hasRecentTrend?: boolean;
  showsBenchmarkComparisons?: boolean;
  hasTooltipHovers?: boolean;
  selectDeprivationInequality?: boolean;
};

export type ComponentDefinition = {
  componentLocator: string;
  componentProps: BaseComponentProps;
};

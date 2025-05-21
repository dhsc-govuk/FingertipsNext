export type BaseComponentProps = {
  hasConfidenceIntervals?: boolean;
  isTabTable?: boolean;
  hasDetailsExpander?: boolean;
  hasTimePeriodDropDown?: boolean;
  hasTypeDropDown?: boolean;
  isWideComponent?: boolean;
  hasRecentTrend?: boolean;
  typeDropDownOptionToSelect?: boolean;
};

export type ComponentDefinition = {
  componentLocator: string;
  componentProps: BaseComponentProps;
};

interface IndicatorDocument {
  indicatorId: string;
  name: string;
  definition: string;
  dataSource: string;
  latestDataPeriod: string;
  lastUpdated: string;
}

export function getIndicatorIDByName(
  indicators: IndicatorDocument[],
  searchTerm: string
): IndicatorDocument[] {
  return indicators.filter((indicator) =>
    indicator.name.toLowerCase().includes(searchTerm.toLowerCase())
  );
}

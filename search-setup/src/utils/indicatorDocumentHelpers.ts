import { IndicatorDocument } from '../constants';

export function parseIndicatorData(
  rawIndicatorData: object
): IndicatorDocument[] {
  const unparsedIndicatorData = rawIndicatorData as IndicatorDocument[];
  const parseIndicatorData = unparsedIndicatorData.map(
    ({
      indicatorID,
      indicatorName,
      earliestDataPeriod,
      latestDataPeriod,
      lastUpdatedDate,
      indicatorDefinition,
      dataSource,
      associatedAreaCodes,
      hasInequalities,
      unitLabel,
    }): IndicatorDocument => {
      return {
        indicatorID: String(indicatorID),
        indicatorName,
        indicatorDefinition,
        dataSource,
        earliestDataPeriod: String(earliestDataPeriod),
        latestDataPeriod: String(latestDataPeriod),
        lastUpdatedDate: new Date(lastUpdatedDate),
        associatedAreaCodes,
        hasInequalities,
        unitLabel,
      };
    }
  );
  return parseIndicatorData;
}

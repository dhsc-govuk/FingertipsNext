import { IndicatorDocument } from './searchTypes';

export const generateIndicatorDocument = (id: string): IndicatorDocument => ({
  indicatorID: id,
  indicatorName: `indicator name for id ${id}`,
  indicatorDefinition: `Some definition for id ${id}`,
  dataSource: `Some data source for id ${id}`,
  earliestDataPeriod: '2022',
  latestDataPeriod: '2023',
  lastUpdatedDate: new Date(),
  associatedAreaCodes: [],
  unitLabel: 'some unit label',
  hasInequalities: true,
  usedInPoc: true,
});

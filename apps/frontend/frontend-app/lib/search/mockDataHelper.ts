import { HealthDataPointTrendEnum } from '@/generated-sources/ft-api-client/models/HealthDataPoint';
import { IndicatorDocument, RawIndicatorDocument } from './searchTypes';

const currentDate = new Date();

export const generateIndicatorDocument = (id: string): IndicatorDocument => ({
  indicatorID: id,
  indicatorName: `indicator name for id ${id}`,
  indicatorDefinition: `Some definition for id ${id}`,
  dataSource: `Some data source for id ${id}`,
  earliestDataPeriod: '2022',
  latestDataPeriod: '2023',
  lastUpdatedDate: currentDate,
  unitLabel: 'some unit label',
  hasInequalities: true,
});

export const generateRawIndicatorDocument = (
  id: string
): RawIndicatorDocument => ({
  indicatorID: id,
  indicatorName: `indicator name for id ${id}`,
  indicatorDefinition: `Some definition for id ${id}`,
  dataSource: `Some data source for id ${id}`,
  earliestDataPeriod: '2022',
  latestDataPeriod: '2023',
  lastUpdatedDate: currentDate,
  unitLabel: 'some unit label',
  hasInequalities: true,
  usedInPoc: true,
  associatedAreaCodes: ['Area1'],
  trendsByArea: [
    {
      areaCode: 'Area1',
      trend: HealthDataPointTrendEnum.CannotBeCalculated,
    },
  ],
});

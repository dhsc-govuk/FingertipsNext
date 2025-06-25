import { IndicatorDocument } from '@/lib/search/searchTypes';

export const mockIndicatorDocument = (
  overrides?: Partial<IndicatorDocument>
): IndicatorDocument => ({
  indicatorID: '352',
  indicatorName:
    'MOCK People with caring responsibility aged 16 years and over',
  indicatorDefinition:
    'This indicator measures the percentage of people with caring responsibility aged 16 years and over',
  dataSource: 'NHS England',
  earliestDataPeriod: '2013',
  latestDataPeriod: '2023',
  lastUpdatedDate: new Date('2025-01-15T14:03:34.000Z'),
  hasInequalities: true,
  unitLabel: '%',
  ...overrides,
});

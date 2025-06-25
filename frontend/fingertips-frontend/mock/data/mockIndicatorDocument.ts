import { IndicatorDocument } from '@/lib/search/searchTypes';

export const mockIndicatorDocument = (
  overrides?: Partial<IndicatorDocument>
): IndicatorDocument => ({
  indicatorID: '41101',
  indicatorName:
    'Emergency readmissions within 30 days of discharge from hospital',
  indicatorDefinition:
    'This indicator measures the percentage of emergency admissions',
  dataSource: 'NHS England',
  earliestDataPeriod: '2013',
  latestDataPeriod: '2023',
  lastUpdatedDate: new Date('2025-01-15T14:03:34.000Z'),
  hasInequalities: true,
  unitLabel: '%',
  ...overrides,
});

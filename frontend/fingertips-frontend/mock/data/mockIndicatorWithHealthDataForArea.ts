import { IndicatorWithHealthDataForArea } from '@/generated-sources/ft-api-client';
import { mockHealthDataForArea } from '@/mock/data/mockHealthDataForArea';

export const mockIndicatorWithHealthDataForArea = (
  overrides?: Partial<IndicatorWithHealthDataForArea>
): IndicatorWithHealthDataForArea => ({
  indicatorId: 41101,
  name: 'Emergency readmissions within 30 days of discharge from hospital',
  polarity: 'LowIsGood',
  benchmarkMethod: 'CIOverlappingReferenceValue95',
  areaHealthData: [mockHealthDataForArea()],
  ...overrides,
});

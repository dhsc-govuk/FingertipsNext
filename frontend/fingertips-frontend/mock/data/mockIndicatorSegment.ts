import { IndicatorSegment } from '@/generated-sources/ft-api-client';
import { mockHealthDataPoint } from '@/mock/data/mockHealthDataPoint';
import { mockSexData } from '@/mock/data/mockSexData';

export const mockIndicatorSegment = (
  overrides?: Partial<IndicatorSegment>
): IndicatorSegment => ({
  sex: mockSexData(),
  isAggregate: true,
  healthData: [mockHealthDataPoint()],
  ...overrides,
});

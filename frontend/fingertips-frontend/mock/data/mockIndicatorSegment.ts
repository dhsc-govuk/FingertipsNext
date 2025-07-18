import { IndicatorSegment } from '@/generated-sources/ft-api-client';
import { mockHealthDataPoint } from '@/mock/data/mockHealthDataPoint';
import { mockSexData } from '@/mock/data/mockSexData';
import { mockAgeData } from '@/mock/data/mockAgeData';

export const mockIndicatorSegment = (
  overrides?: Partial<IndicatorSegment>
): IndicatorSegment => ({
  sex: mockSexData(),
  age: mockAgeData(),
  isAggregate: true,
  healthData: [mockHealthDataPoint()],
  ...overrides,
});

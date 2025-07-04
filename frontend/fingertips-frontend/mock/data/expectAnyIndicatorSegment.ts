import { IndicatorSegment } from '@/generated-sources/ft-api-client';
import { expectAnyHealthDataPoint } from '@/mock/data/expectAnyHealthDataPoint';
import { expectAnySexData } from '@/mock/data/expectAnySexData';

export const expectAnyIndicatorSegment = (
  overrides?: Partial<IndicatorSegment>
) => ({
  sex: expectAnySexData(),
  isAggregate: expect.any(Boolean),
  healthData: [expectAnyHealthDataPoint()],
  ...overrides,
});

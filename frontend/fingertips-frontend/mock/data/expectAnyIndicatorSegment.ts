import {
  IndicatorSegment,
  ReportingPeriod,
} from '@/generated-sources/ft-api-client';
import { expectAnyHealthDataPoint } from '@/mock/data/expectAnyHealthDataPoint';
import { expectAnyAgeData } from '@/mock/data/expectAnyAgeData';
import { expectAnySexData } from '@/mock/data/expectAnySexData';

export const expectAnyIndicatorSegment = (
  overrides?: Partial<IndicatorSegment>
) => ({
  age: expectAnyAgeData(),
  sex: expectAnySexData(),
  reportingPeriod: ReportingPeriod.Yearly,
  isAggregate: expect.any(Boolean),
  healthData: [expectAnyHealthDataPoint()],
  ...overrides,
});

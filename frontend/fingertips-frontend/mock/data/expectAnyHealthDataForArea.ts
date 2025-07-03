import { expectAnyHealthDataPoint } from '@/mock/data/expectAnyHealthDataPoint';
import { HealthDataForArea } from '@/generated-sources/ft-api-client';

export const expectAnyHealthDataForArea = (
  overrides?: Partial<HealthDataForArea>
) => ({
  areaCode: expect.any(String),
  areaName: expect.any(String),
  healthData: [expectAnyHealthDataPoint()],
  ...overrides,
});

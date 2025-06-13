import { HealthDataForArea } from '@/generated-sources/ft-api-client';
import { mockHealthDataPoint } from '@/mock/data/mockHealthDataPoint';

export const mockHealthDataForArea = (
  overrides?: Partial<HealthDataForArea>
): HealthDataForArea => ({
  areaCode: 'E06000015',
  areaName: 'Derby',
  healthData: [mockHealthDataPoint()],
  ...overrides,
});

export const mockHealthDataForArea_Group = (
  overrides?: Partial<HealthDataForArea>
) =>
  mockHealthDataForArea({
    areaCode: 'E12000002',
    areaName: 'North West Region',
    ...overrides,
  });

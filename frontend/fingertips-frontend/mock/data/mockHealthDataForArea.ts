import { HealthDataForArea } from '@/generated-sources/ft-api-client';
import { mockHealthDataPoint } from '@/mock/data/mockHealthDataPoint';
import { areaCodeForEngland } from '@/lib/chartHelpers/constants';

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

export const mockHealthDataForArea_England = (
  overrides?: Partial<HealthDataForArea>
) =>
  mockHealthDataForArea({
    areaCode: areaCodeForEngland,
    areaName: 'England',
    ...overrides,
  });

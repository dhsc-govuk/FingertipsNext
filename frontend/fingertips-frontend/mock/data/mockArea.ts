import { Area } from '@/generated-sources/ft-api-client';
import { regionsAreaType } from '@/lib/areaFilterHelpers/areaType';

export const mockArea = (overrides?: Partial<Area>) => ({
  code: 'E12000002',
  name: 'North West region',
  areaType: regionsAreaType,
  ...overrides,
});

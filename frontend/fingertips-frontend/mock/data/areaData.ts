import { AreaType, AreaWithRelations } from '@/generated-sources/ft-api-client';

export const mockAreaTypes: AreaType[] = [
  {
    name: 'Region',
    level: 1,
    hierarchyName: 'Region hierarchyName',
  },
  {
    name: 'City',
    level: 2,
    hierarchyName: 'City hierarchyName',
  },
  {
    name: 'Town',
    level: 3,
    hierarchyName: 'Town hierarchyName',
  },
  {
    name: 'GP',
    level: 4,
    hierarchyName: 'GP hierarchyName',
  },
];

export const mockAreaData: Record<string, AreaWithRelations> = {
  E001: {
    code: 'E001',
    name: 'Greater Manchester',
    hierarchyName: 'NHS',
    areaType: 'PCN',
    level: 3,
  },
  E002: {
    code: 'E002',
    name: 'Leeds',
    hierarchyName: 'NHS',
    areaType: 'PCN',
    level: 3,
  },
  E003: {
    code: 'E003',
    name: 'Sheffield',
    hierarchyName: 'NHS',
    areaType: 'PCN',
    level: 3,
  },
};

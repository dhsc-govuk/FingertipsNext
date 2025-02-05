import { AreaType, AreaWithRelations } from '@/generated-sources/ft-api-client';

export const mockAreaTypes: AreaType[] = [
  {
    name: 'Counties & UAs',
    level: 2,
    hierarchyName: 'Admin',
  },
  {
    name: 'Country',
    level: 0,
    hierarchyName: 'All',
  },
  {
    name: 'GP',
    level: 4,
    hierarchyName: 'NHS',
  },
  {
    name: 'ICB',
    level: 2,
    hierarchyName: 'NHS',
  },
  {
    name: 'NHS region',
    level: 1,
    hierarchyName: 'NHS',
  },
  {
    name: 'PCN',
    level: 3,
    hierarchyName: 'NHS',
  },
  {
    name: 'Regions Statistical',
    level: 1,
    hierarchyName: 'Admin',
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

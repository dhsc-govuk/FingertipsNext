import { AreaWithRelations } from '@/generated-sources/ft-api-client';

export const mockAvailableAreaTypes = [
  'Integrated Care Board sub-locations',
  'Integrated Care Board pub-locations',
  'Integrated Care Board hub-locations',
  'Integrated Care Board tub-locations',
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

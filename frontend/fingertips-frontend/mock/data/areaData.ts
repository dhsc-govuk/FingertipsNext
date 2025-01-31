import { AreaType } from '@/generated-sources/ft-api-client';

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

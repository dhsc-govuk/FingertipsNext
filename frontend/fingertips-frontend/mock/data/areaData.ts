import {
  Area,
  AreaType,
  AreaWithRelations,
} from '@/generated-sources/ft-api-client';

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

export const mockAvailableAreas: Record<string, Area[]> = {
  'Counties & UAs': [
    {
      code: 'E06000047',
      name: 'County Durham',
      hierarchyName: 'Admin',
      areaType: 'Counties & UAs',
      level: 2,
    },
    {
      code: 'E06000005',
      name: 'Darlington',
      hierarchyName: 'Admin',
      areaType: 'Counties & UAs',
      level: 2,
    },
    {
      code: 'E08000037',
      name: 'Gateshead',
      hierarchyName: 'Admin',
      areaType: 'Counties & UAs',
      level: 2,
    },
  ],
  'Country': [
    {
      code: 'E92000001',
      name: 'England',
      hierarchyName: 'All',
      areaType: 'Country',
      level: 0,
    },
  ],
  'GP': [
    {
      code: 'F81186',
      name: 'Felmores Medical Centre',
      hierarchyName: 'NHS',
      areaType: 'GP',
      level: 4,
    },
    {
      code: 'F81640',
      name: 'Aryan Medical Centre',
      hierarchyName: 'NHS',
      areaType: 'GP',
      level: 4,
    },
    {
      code: 'F83004',
      name: 'Archway Medical Centre',
      hierarchyName: 'NHS',
      areaType: 'GP',
      level: 4,
    },
    {
      code: 'F83008',
      name: 'The Goodinge Group Practice',
      hierarchyName: 'NHS',
      areaType: 'GP',
      level: 4,
    },
  ],
  'ICB': [
    {
      code: 'E38000007',
      name: 'NHS Basildon And Brentwood ICB',
      hierarchyName: 'NHS',
      areaType: 'ICB',
      level: 2,
    },
    {
      code: 'E38000026',
      name: 'NHS Cambridgeshire and Peterborough ICB',
      hierarchyName: 'NHS',
      areaType: 'ICB',
      level: 2,
    },
    {
      code: 'E38000240',
      name: 'NHS North Central London ICB',
      hierarchyName: 'NHS',
      areaType: 'ICB',
      level: 2,
    },
    {
      code: 'E38000244',
      name: 'NHS South East London ICB',
      hierarchyName: 'NHS',
      areaType: 'ICB',
      level: 2,
    },
  ],
  'NHS region': [
    {
      code: 'E40000007',
      name: 'East of England NHS Region',
      hierarchyName: 'NHS',
      areaType: 'NHS region',
      level: 1,
    },
    {
      code: 'E40000003',
      name: 'London NHS Region',
      hierarchyName: 'NHS',
      areaType: 'NHS region',
      level: 1,
    },
    {
      code: 'E40000005',
      name: 'South East NHS Region',
      hierarchyName: 'NHS',
      areaType: 'NHS region',
      level: 1,
    },
    {
      code: 'E40000006',
      name: 'South West NHS Region',
      hierarchyName: 'NHS',
      areaType: 'NHS region',
      level: 1,
    },
    {
      code: 'E40000010',
      name: 'North West NHS Region',
      hierarchyName: 'NHS',
      areaType: 'NHS region',
      level: 1,
    },
    {
      code: 'E40000011',
      name: 'Midlands NHS Region',
      hierarchyName: 'NHS',
      areaType: 'NHS region',
      level: 1,
    },
    {
      code: 'E40000012',
      name: 'North East and Yorkshire NHS Region',
      hierarchyName: 'NHS',
      areaType: 'NHS region',
      level: 1,
    },
  ],
  'PCN': [
    {
      code: 'U15488',
      name: 'East Basildon PCN',
      hierarchyName: 'NHS',
      areaType: 'PCN',
      level: 3,
    },
    {
      code: 'U55146',
      name: 'Central Basildon PCN',
      hierarchyName: 'NHS',
      areaType: 'PCN',
      level: 3,
    },
    {
      code: 'U02795',
      name: 'North 2 Islington PCN',
      hierarchyName: 'NHS',
      areaType: 'PCN',
      level: 3,
    },
    {
      code: 'U05885',
      name: 'South Camden PCN',
      hierarchyName: 'NHS',
      areaType: 'PCN',
      level: 3,
    },
  ],
  'Regions Statistical': [
    {
      code: 'E12000001',
      name: 'North East region (statistical)',
      hierarchyName: 'Admin',
      areaType: 'Regions Statistical',
      level: 1,
    },
    {
      code: 'E12000002',
      name: 'North West region (statistical)',
      hierarchyName: 'Admin',
      areaType: 'Regions Statistical',
      level: 1,
    },
    {
      code: 'E12000003',
      name: 'Yorkshire and the Humber region (statistical)',
      hierarchyName: 'Admin',
      areaType: 'Regions Statistical',
      level: 1,
    },
  ],
};

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

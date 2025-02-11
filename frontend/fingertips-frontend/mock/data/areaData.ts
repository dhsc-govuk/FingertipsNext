import { AreaType, AreaWithRelations } from '@/generated-sources/ft-api-client';

export const mockAreaTypes: AreaType[] = [
  {
    name: 'England',
    level: 1,
    hierarchyName: 'All',
  },
  {
    name: 'NHS Regions',
    level: 2,
    hierarchyName: 'NHS',
  },
  {
    name: 'NHS Integrated Care Boards',
    level: 3,
    hierarchyName: 'NHS',
  },
  {
    name: 'NHS Sub Integrated Care Boards',
    level: 4,
    hierarchyName: 'NHS',
  },
  {
    name: 'NHS Primary Care Networks',
    level: 5,
    hierarchyName: 'NHS',
  },
  {
    name: 'GPs',
    level: 6,
    hierarchyName: 'NHS',
  },
  {
    name: 'Regions',
    level: 2,
    hierarchyName: 'Admin',
  },
  {
    name: 'Combined Authorities',
    level: 3,
    hierarchyName: 'Admin',
  },
  {
    name: 'Counties and Unitary Authorities',
    level: 4,
    hierarchyName: 'Admin',
  },
  {
    name: 'Districts and Unitary Authorities',
    level: 5,
    hierarchyName: 'Admin',
  },
];

export const mockAreaDataForCountry: Record<string, AreaWithRelations> = {
  E92000001: {
    code: 'E92000001',
    name: 'England',
    hierarchyName: 'All',
    areaType: 'Country',
    level: 0,
  },
};

export const mockAreaDataForRegionsStatistical: Record<
  string,
  AreaWithRelations
> = {
  E12000001: {
    code: 'E12000001',
    name: 'North East region (statistical)',
    hierarchyName: 'Admin',
    areaType: 'Regions',
    level: 2,
  },
  E12000002: {
    code: 'E12000002',
    name: 'North West region (statistical)',
    hierarchyName: 'Admin',
    areaType: 'Regions',
    level: 2,
  },
  E12000003: {
    code: 'E12000003',
    name: 'Yorkshire and the Humber region (statistical)',
    hierarchyName: 'Admin',
    areaType: 'Regions',
    level: 2,
  },
};

export const mockAreaDataForNHSRegion: Record<string, AreaWithRelations> = {
  E40000007: {
    code: 'E40000007',
    name: 'East of England NHS Region',
    hierarchyName: 'NHS',
    areaType: 'NHS Regions',
    level: 2,
  },
  E40000003: {
    code: 'E40000003',
    name: 'London NHS Region',
    hierarchyName: 'NHS',
    areaType: 'NHS Regions',
    level: 2,
  },
  E40000005: {
    code: 'E40000005',
    name: 'South East NHS Region',
    hierarchyName: 'NHS',
    areaType: 'NHS Regions',
    level: 2,
  },
  E40000006: {
    code: 'E40000006',
    name: 'South West NHS Region',
    hierarchyName: 'NHS',
    areaType: 'NHS Regions',
    level: 2,
  },
  E40000010: {
    code: 'E40000010',
    name: 'North West NHS Region',
    hierarchyName: 'NHS',
    areaType: 'NHS Regions',
    level: 2,
  },
  E40000011: {
    code: 'E40000011',
    name: 'Midlands NHS Region',
    hierarchyName: 'NHS',
    areaType: 'NHS Regions',
    level: 2,
  },
  E40000012: {
    code: 'E40000012',
    name: 'North East and Yorkshire NHS Region',
    hierarchyName: 'NHS',
    areaType: 'NHS Regions',
    level: 2,
  },
};

export const mockAreaDataForCountiesAndUAs: Record<string, AreaWithRelations> =
  {
    E06000047: {
      code: 'E06000047',
      name: 'County Durham',
      hierarchyName: 'Admin',
      areaType: 'Counties and Unitary Authorities',
      level: 4,
    },
    E06000005: {
      code: 'E06000005',
      name: 'Darlington',
      hierarchyName: 'Admin',
      areaType: 'Counties and Unitary Authorities',
      level: 4,
    },
    E08000037: {
      code: 'E08000037',
      name: 'Gateshead',
      hierarchyName: 'Admin',
      areaType: 'Counties and Unitary Authorities',
      level: 4,
    },
  };

export const mockAreaDataForICB: Record<string, AreaWithRelations> = {
  E38000007: {
    code: 'E38000007',
    name: 'NHS Basildon And Brentwood ICB',
    hierarchyName: 'NHS',
    areaType: 'NHS Integrated Care Boards',
    level: 3,
  },
  E38000026: {
    code: 'E38000026',
    name: 'NHS Cambridgeshire and Peterborough ICB',
    hierarchyName: 'NHS',
    areaType: 'NHS Integrated Care Boards',
    level: 3,
  },
  E38000240: {
    code: 'E38000240',
    name: 'NHS North Central London ICB',
    hierarchyName: 'NHS',
    areaType: 'NHS Integrated Care Boards',
    level: 3,
  },
  E38000244: {
    code: 'E38000244',
    name: 'NHS South East London ICB',
    hierarchyName: 'NHS',
    areaType: 'NHS Integrated Care Boards',
    level: 3,
  },
};

export const mockAreaDataForPCN: Record<string, AreaWithRelations> = {
  U15488: {
    code: 'U15488',
    name: 'East Basildon PCN',
    hierarchyName: 'NHS',
    areaType: 'NHS Primary Care Networks',
    level: 5,
  },
  U55146: {
    code: 'U55146',
    name: 'Central Basildon PCN',
    hierarchyName: 'NHS',
    areaType: 'NHS Primary Care Networks',
    level: 5,
  },
  U02795: {
    code: 'U02795',
    name: 'North 2 Islington PCN',
    hierarchyName: 'NHS',
    areaType: 'NHS Primary Care Networks',
    level: 5,
  },
  U05885: {
    code: 'U05885',
    name: 'South Camden PCN',
    hierarchyName: 'NHS',
    areaType: 'NHS Primary Care Networks',
    level: 5,
  },
};

export const mockAreaDataForGP: Record<string, AreaWithRelations> = {
  F81186: {
    code: 'F81186',
    name: 'Felmores Medical Centre',
    hierarchyName: 'NHS',
    areaType: 'GPs',
    level: 6,
  },
  F81640: {
    code: 'F81640',
    name: 'Aryan Medical Centre',
    hierarchyName: 'NHS',
    areaType: 'GPs',
    level: 6,
  },
  F83004: {
    code: 'F83004',
    name: 'Archway Medical Centre',
    hierarchyName: 'NHS',
    areaType: 'GPs',
    level: 6,
  },
  F83008: {
    code: 'F83008',
    name: 'The Goodinge Group Practice',
    hierarchyName: 'NHS',
    areaType: 'GPs',
    level: 6,
  },
};

export const mockAreaData: Record<string, AreaWithRelations> = {
  ...mockAreaDataForCountry,
  ...mockAreaDataForNHSRegion,
  ...mockAreaDataForRegionsStatistical,
  ...mockAreaDataForCountiesAndUAs,
  ...mockAreaDataForICB,
  ...mockAreaDataForPCN,
  ...mockAreaDataForGP,
};

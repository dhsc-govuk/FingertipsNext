import { Area, AreaWithRelations } from '@/generated-sources/ft-api-client';
import {
  AreaTypeKeys,
  countiesAndUnitaryAuthoritiesAreaType,
  englandAreaType,
  gpsAreaType,
  nhsIntegratedCareBoardsAreaType,
  nhsPrimaryCareNetworksAreaType,
  nhsRegionsAreaType,
  regionsAreaType,
} from '../../lib/areaFilterHelpers/areaType';
import { englandArea } from './areas/englandAreas';
import {
  northEastRegion,
  northWestRegion,
  yorkshireAndHumberRegion,
} from './areas/regionsAreas';
import {
  eastEnglandNHSRegion,
  londonNHSRegion,
  midlandsNHSRegion,
  northEastAndYorkshireNHSRegion,
  southEastNHSRegion,
  southWestNHSRegion,
} from './areas/nhsRegionsAreas';
import {
  countyDurham,
  darlington,
  gateshead,
} from './areas/countiesAndUAAreas';
import {
  basildonAndBrentwoodICB,
  cambridgeAndPeterboroughICB,
  northCentralLondonICB,
  southEastLondonICB,
} from './areas/integratedCareBoardsAreas';
import {
  centralBasildonPCN,
  eastBasildonPCN,
  north2IslingtonPCN,
  southCamdenPCN,
} from './areas/primaryCareNetworksAreas';
import { archwayGP, aryanGP, felmoresGP, goodingeGP } from './areas/gpsAreas';

export const mockAreaDataForCountry: Record<string, AreaWithRelations> = {
  E92000001: {
    ...englandArea,
  },
};

export const mockAreaDataForRegionsStatistical: Record<
  string,
  AreaWithRelations
> = {
  E12000001: {
    ...northEastRegion,
    parent: {
      ...englandArea,
    },
  },
  E12000002: {
    ...northWestRegion,
    parent: {
      ...englandArea,
    },
  },
  E12000003: {
    ...yorkshireAndHumberRegion,
    parent: {
      ...englandArea,
    },
  },
};

export const mockAreaDataForNHSRegion: Record<string, AreaWithRelations> = {
  E40000007: {
    ...eastEnglandNHSRegion,
    parent: {
      ...englandArea,
    },
  },
  E40000003: {
    ...londonNHSRegion,
    parent: {
      ...englandArea,
    },
  },
  E40000005: {
    ...southEastNHSRegion,
    parent: {
      ...englandArea,
    },
  },
  E40000006: {
    ...southWestNHSRegion,
    parent: {
      ...englandArea,
    },
  },
  E40000010: {
    ...northWestRegion,
    parent: {
      ...englandArea,
    },
  },
  E40000011: {
    ...midlandsNHSRegion,
    parent: {
      ...englandArea,
    },
  },
  E40000012: {
    ...northEastAndYorkshireNHSRegion,
    parent: {
      ...englandArea,
    },
  },
};

export const mockAreaDataForCountiesAndUAs: Record<string, AreaWithRelations> =
  {
    E06000047: {
      ...countyDurham,
      parent: {
        ...northEastRegion,
      },
    },
    E06000005: {
      ...darlington,
      ...northEastRegion,
    },
    E08000037: {
      ...gateshead,
      ...northEastRegion,
    },
  };

export const mockAreaDataForICB: Record<string, AreaWithRelations> = {
  E38000007: {
    ...basildonAndBrentwoodICB,
  },
  E38000026: {
    ...cambridgeAndPeterboroughICB,
  },
  E38000240: {
    ...northCentralLondonICB,
  },
  E38000244: {
    ...southEastLondonICB,
  },
};

export const mockAreaDataForPCN: Record<string, AreaWithRelations> = {
  U15488: {
    ...eastBasildonPCN,
  },
  U55146: {
    ...centralBasildonPCN,
  },
  U02795: {
    ...north2IslingtonPCN,
  },
  U05885: {
    ...southCamdenPCN,
  },
};

export const mockAreaDataForGP: Record<string, AreaWithRelations> = {
  F81186: {
    ...felmoresGP,
  },
  F81640: {
    ...aryanGP,
  },
  F83004: {
    ...archwayGP,
  },
  F83008: {
    ...goodingeGP,
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

export const mockAvailableAreas: Record<AreaTypeKeys, Area[]> = {
  'combined-authorities': [],
  'districts-and-unitary-authorities': [],
  'nhs-sub-integrated-care-boards': [],
  'counties-and-unitary-authorities': [
    {
      code: 'E06000047',
      name: 'County Durham',
      areaType: countiesAndUnitaryAuthoritiesAreaType,
    },
    {
      code: 'E06000005',
      name: 'Darlington',
      areaType: countiesAndUnitaryAuthoritiesAreaType,
    },
    {
      code: 'E08000037',
      name: 'Gateshead',
      areaType: countiesAndUnitaryAuthoritiesAreaType,
    },
  ],
  'england': [
    {
      code: 'E92000001',
      name: 'England',
      areaType: englandAreaType,
    },
  ],
  'gps': [
    {
      code: 'F81186',
      name: 'Felmores Medical Centre',
      areaType: gpsAreaType,
    },
    {
      code: 'F81640',
      name: 'Aryan Medical Centre',
      areaType: gpsAreaType,
    },
    {
      code: 'F83004',
      name: 'Archway Medical Centre',
      areaType: gpsAreaType,
    },
    {
      code: 'F83008',
      name: 'The Goodinge Group Practice',
      areaType: gpsAreaType,
    },
  ],
  'nhs-integrated-care-boards': [
    {
      code: 'E38000007',
      name: 'NHS Basildon And Brentwood ICB',
      areaType: nhsIntegratedCareBoardsAreaType,
    },
    {
      code: 'E38000026',
      name: 'NHS Cambridgeshire and Peterborough ICB',
      areaType: nhsIntegratedCareBoardsAreaType,
    },
    {
      code: 'E38000240',
      name: 'NHS North Central London ICB',
      areaType: nhsIntegratedCareBoardsAreaType,
    },
    {
      code: 'E38000244',
      name: 'NHS South East London ICB',
      areaType: nhsIntegratedCareBoardsAreaType,
    },
  ],
  'nhs-regions': [
    {
      code: 'E40000007',
      name: 'East of England NHS Region',
      areaType: nhsRegionsAreaType,
    },
    {
      code: 'E40000003',
      name: 'London NHS Region',
      areaType: nhsRegionsAreaType,
    },
    {
      code: 'E40000005',
      name: 'South East NHS Region',
      areaType: nhsRegionsAreaType,
    },
    {
      code: 'E40000006',
      name: 'South West NHS Region',
      areaType: nhsRegionsAreaType,
    },
    {
      code: 'E40000010',
      name: 'North West NHS Region',
      areaType: nhsRegionsAreaType,
    },
    {
      code: 'E40000011',
      name: 'Midlands NHS Region',
      areaType: nhsRegionsAreaType,
    },
    {
      code: 'E40000012',
      name: 'North East and Yorkshire NHS Region',
      areaType: nhsRegionsAreaType,
    },
  ],
  'nhs-primary-care-networks': [
    {
      code: 'U15488',
      name: 'East Basildon PCN',
      areaType: nhsPrimaryCareNetworksAreaType,
    },
    {
      code: 'U55146',
      name: 'Central Basildon PCN',
      areaType: nhsPrimaryCareNetworksAreaType,
    },
    {
      code: 'U02795',
      name: 'North 2 Islington PCN',
      areaType: nhsPrimaryCareNetworksAreaType,
    },
    {
      code: 'U05885',
      name: 'South Camden PCN',
      areaType: nhsPrimaryCareNetworksAreaType,
    },
  ],
  'regions': [
    {
      code: 'E12000001',
      name: 'North East region (statistical)',
      areaType: regionsAreaType,
    },
    {
      code: 'E12000002',
      name: 'North West region (statistical)',
      areaType: regionsAreaType,
    },
    {
      code: 'E12000003',
      name: 'Yorkshire and the Humber region (statistical)',
      areaType: regionsAreaType,
    },
  ],
};

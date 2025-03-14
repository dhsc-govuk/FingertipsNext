import { Area, AreaWithRelations } from '@/generated-sources/ft-api-client';
import {
  AreaTypeKeys,
  gpsAreaType,
} from '../../lib/areaFilterHelpers/areaType';
import { allEngland, englandArea } from './areas/englandAreas';
import {
  allRegions,
  northEastRegion,
  northWestRegion,
  yorkshireAndHumberRegion,
} from './areas/regionsAreas';
import {
  allNhsRegions,
  eastEnglandNHSRegion,
  londonNHSRegion,
  midlandsNHSRegion,
  northEastAndYorkshireNHSRegion,
  northWestNHSRegion,
  southEastNHSRegion,
  southWestNHSRegion,
} from './areas/nhsRegionsAreas';
import {
  allCountiesAndUAAreas,
  countyDurham,
  darlington,
  gateshead,
} from './areas/countiesAndUAAreas';
import {
  allIntegratedCareBoards,
  basildonAndBrentwoodICB,
  cambridgeAndPeterboroughICB,
  northCentralLondonICB,
  southEastLondonICB,
} from './areas/integratedCareBoardsAreas';
import {
  allPrimaryCareNetworks,
  centralBasildonPCN,
  eastBasildonPCN,
  north2IslingtonPCN,
  southCamdenPCN,
} from './areas/primaryCareNetworksAreas';
import {
  allGpsAreas,
  archwayGP,
  aryanGP,
  felmoresGP,
  goodingeGP,
} from './areas/gpsAreas';
import {ErrorAreaCode} from "@/mock/ErrorTriggeringIds";

export const mockAreaDataForCountry: Record<string, AreaWithRelations> = {
  E92000001: {
    ...englandArea,
    children: [
      ...allEngland,
      ...allCountiesAndUAAreas,
      ...allGpsAreas,
      ...allIntegratedCareBoards,
      ...allNhsRegions,
      ...allPrimaryCareNetworks,
      ...allRegions,
    ],
  },
};

export const mockAreaDataForRegionsStatistical: Record<
  string,
  AreaWithRelations
> = {
  E12000001: {
    ...northEastRegion,
    parents: [englandArea],
    children: [],
  },
  E12000002: {
    ...northWestRegion,
    parents: [englandArea],
    children: [],
  },
  E12000003: {
    ...yorkshireAndHumberRegion,
    parents: [englandArea],
    children: [],
  },
};

export const mockAreaDataForNHSRegion: Record<string, AreaWithRelations> = {
  E40000007: {
    ...eastEnglandNHSRegion,
    parents: [englandArea],
    children: [
      basildonAndBrentwoodICB,
      cambridgeAndPeterboroughICB,
      eastBasildonPCN,
      centralBasildonPCN,
      felmoresGP,
      aryanGP,
    ],
  },
  E40000003: {
    ...londonNHSRegion,
    parents: [englandArea],
    children: [
      northCentralLondonICB,
      southEastLondonICB,
      north2IslingtonPCN,
      southCamdenPCN,
      archwayGP,
      goodingeGP,
    ],
  },
  E40000005: {
    ...southEastNHSRegion,
    parents: [englandArea],
    children: [],
  },
  E40000006: {
    ...southWestNHSRegion,
    parents: [englandArea],
    children: [],
  },
  E40000010: {
    ...northWestNHSRegion,
    parents: [englandArea],
    children: [],
  },
  E40000011: {
    ...midlandsNHSRegion,
    parents: [englandArea],
    children: [],
  },
  E40000012: {
    ...northEastAndYorkshireNHSRegion,
    parents: [englandArea],
    children: [],
  },
};

export const mockAreaDataForCountiesAndUAs: Record<string, AreaWithRelations> =
  {
    E06000047: {
      ...countyDurham,
      parents: [northEastRegion],
      children: [],
    },
    E06000005: {
      ...darlington,
      parents: [northEastRegion],
      children: [],
    },
    E08000037: {
      ...gateshead,
      parents: [northEastRegion],
      children: [],
    },
  };

export const mockAreaDataForICB: Record<string, AreaWithRelations> = {
  E38000007: {
    ...basildonAndBrentwoodICB,
    children: [eastBasildonPCN, centralBasildonPCN, felmoresGP, aryanGP],
  },
  E38000026: {
    ...cambridgeAndPeterboroughICB,
    children: [],
  },
  E38000240: {
    ...northCentralLondonICB,
    children: [north2IslingtonPCN, southCamdenPCN, archwayGP, goodingeGP],
  },
  E38000244: {
    ...southEastLondonICB,
    children: [],
  },
};

export const mockAreaDataForPCN: Record<string, AreaWithRelations> = {
  U15488: {
    ...eastBasildonPCN,
    children: [felmoresGP, aryanGP],
  },
  U55146: {
    ...centralBasildonPCN,
    children: [],
  },
  U02795: {
    ...north2IslingtonPCN,
    children: [archwayGP, goodingeGP],
  },
  U05885: {
    ...southCamdenPCN,
    children: [],
  },
};

export const mockAreaDataForGP: Record<string, AreaWithRelations> = {
  F81186: {
    ...felmoresGP,
    children: [],
  },
  F81640: {
    ...aryanGP,
    children: [],
  },
  F83004: {
    ...archwayGP,
    children: [],
  },
  F83008: {
    ...goodingeGP,
    children: [],
  },
    [`${ErrorAreaCode}`]: {
    code: `${ErrorAreaCode}`,
    name: 'Error House GP Surgery',
    areaType: gpsAreaType,
    children: [],
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
      ...countyDurham,
    },
    {
      ...darlington,
    },
    {
      ...gateshead,
    },
  ],
  'england': [
    {
      ...englandArea,
    },
  ],
  'gps': [
    {
      ...felmoresGP,
    },
    {
      ...aryanGP,
    },
    {
      ...archwayGP,
    },
    {
      ...goodingeGP,
    },
  ],
  'nhs-integrated-care-boards': [
    {
      ...basildonAndBrentwoodICB,
    },
    {
      ...cambridgeAndPeterboroughICB,
    },
    {
      ...northCentralLondonICB,
    },
    {
      ...southEastLondonICB,
    },
  ],
  'nhs-regions': [
    {
      ...eastEnglandNHSRegion,
    },
    {
      ...londonNHSRegion,
    },
    {
      ...southEastNHSRegion,
    },
    {
      ...southWestNHSRegion,
    },
    {
      ...northWestNHSRegion,
    },
    {
      ...midlandsNHSRegion,
    },
    {
      ...northEastAndYorkshireNHSRegion,
    },
  ],
  'nhs-primary-care-networks': [
    {
      ...eastBasildonPCN,
    },
    {
      ...centralBasildonPCN,
    },
    {
      ...north2IslingtonPCN,
    },
    {
      ...southCamdenPCN,
    },
  ],
  'regions': [
    {
      ...northEastRegion,
    },
    {
      ...northWestRegion,
    },
    {
      ...yorkshireAndHumberRegion,
    },
  ],
};

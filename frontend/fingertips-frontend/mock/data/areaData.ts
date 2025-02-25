import { Area, AreaWithRelations } from '@/generated-sources/ft-api-client';
import { AreaTypeKeys } from '../../lib/areaFilterHelpers/areaType';
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
    siblings: allEngland,
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
    children: [],
    siblings: [],
  },
  E12000002: {
    ...northWestRegion,
    parent: {
      ...englandArea,
    },
    children: [],
    siblings: [],
  },
  E12000003: {
    ...yorkshireAndHumberRegion,
    parent: {
      ...englandArea,
    },
    children: [],
    siblings: [],
  },
};

export const mockAreaDataForNHSRegion: Record<string, AreaWithRelations> = {
  E40000007: {
    ...eastEnglandNHSRegion,
    parent: {
      ...englandArea,
    },
    children: [
      basildonAndBrentwoodICB,
      cambridgeAndPeterboroughICB,
      eastBasildonPCN,
      centralBasildonPCN,
      felmoresGP,
      aryanGP,
    ],
    siblings: allNhsRegions,
  },
  E40000003: {
    ...londonNHSRegion,
    parent: {
      ...englandArea,
    },
    children: [
      northCentralLondonICB,
      southEastLondonICB,
      north2IslingtonPCN,
      southCamdenPCN,
      archwayGP,
      goodingeGP,
    ],
    siblings: allNhsRegions,
  },
  E40000005: {
    ...southEastNHSRegion,
    parent: {
      ...englandArea,
    },
    children: [],
    siblings: allNhsRegions,
  },
  E40000006: {
    ...southWestNHSRegion,
    parent: {
      ...englandArea,
    },
    children: [],
    siblings: allNhsRegions,
  },
  E40000010: {
    ...northWestRegion,
    parent: {
      ...englandArea,
    },
    children: [],
    siblings: allNhsRegions,
  },
  E40000011: {
    ...midlandsNHSRegion,
    parent: {
      ...englandArea,
    },
    children: [],
    siblings: allNhsRegions,
  },
  E40000012: {
    ...northEastAndYorkshireNHSRegion,
    parent: {
      ...englandArea,
    },
    children: [],
    siblings: allNhsRegions,
  },
};

export const mockAreaDataForCountiesAndUAs: Record<string, AreaWithRelations> =
  {
    E06000047: {
      ...countyDurham,
      parent: {
        ...northEastRegion,
      },
      children: [],
      siblings: [],
    },
    E06000005: {
      ...darlington,
      parent: { ...northEastRegion },
      children: [],
      siblings: [],
    },
    E08000037: {
      ...gateshead,
      parent: { ...northEastRegion },
      children: [],
      siblings: [],
    },
  };

export const mockAreaDataForICB: Record<string, AreaWithRelations> = {
  E38000007: {
    ...basildonAndBrentwoodICB,
    children: [eastBasildonPCN, centralBasildonPCN, felmoresGP, aryanGP],
    siblings: allIntegratedCareBoards,
  },
  E38000026: {
    ...cambridgeAndPeterboroughICB,
    children: [],
    siblings: allIntegratedCareBoards,
  },
  E38000240: {
    ...northCentralLondonICB,
    children: [north2IslingtonPCN, southCamdenPCN, archwayGP, goodingeGP],
    siblings: allIntegratedCareBoards,
  },
  E38000244: {
    ...southEastLondonICB,
    children: [],
    siblings: allIntegratedCareBoards,
  },
};

export const mockAreaDataForPCN: Record<string, AreaWithRelations> = {
  U15488: {
    ...eastBasildonPCN,
    children: [felmoresGP, aryanGP],
    siblings: allPrimaryCareNetworks,
  },
  U55146: {
    ...centralBasildonPCN,
    children: [],
    siblings: allPrimaryCareNetworks,
  },
  U02795: {
    ...north2IslingtonPCN,
    children: [archwayGP, goodingeGP],
    siblings: allPrimaryCareNetworks,
  },
  U05885: {
    ...southCamdenPCN,
    children: [],
    siblings: allPrimaryCareNetworks,
  },
};

export const mockAreaDataForGP: Record<string, AreaWithRelations> = {
  F81186: {
    ...felmoresGP,
    children: [],
    siblings: allGpsAreas,
  },
  F81640: {
    ...aryanGP,
    children: [],
    siblings: allGpsAreas,
  },
  F83004: {
    ...archwayGP,
    children: [],
    siblings: allGpsAreas,
  },
  F83008: {
    ...goodingeGP,
    children: [],
    siblings: allGpsAreas,
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

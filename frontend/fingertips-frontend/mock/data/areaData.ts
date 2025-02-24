import { Area, AreaWithRelations } from '@/generated-sources/ft-api-client';
import { AreaTypeKeys } from '../../lib/areaFilterHelpers/areaType';
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
  northWestNHSRegion,
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
    ...northWestNHSRegion,
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
      parent: { ...northEastRegion },
    },
    E08000037: {
      ...gateshead,
      parent: { ...northEastRegion },
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

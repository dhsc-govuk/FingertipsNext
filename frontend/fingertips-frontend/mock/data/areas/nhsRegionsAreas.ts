import { Area, AreaWithRelations } from '@/generated-sources/ft-api-client';
import { nhsRegionsAreaType } from '../../../lib/areaFilterHelpers/areaType';
import {
  basildonAndBrentwoodICB,
  cambridgeAndPeterboroughICB,
  northCentralLondonICB,
  southEastLondonICB,
} from './integratedCareBoardsAreas';

export const eastEnglandNHSRegion: Area = {
  code: 'E40000007',
  name: 'East of England NHS Region',
  areaType: nhsRegionsAreaType,
};

export const eastEnglandNHSRegionWithRelations: AreaWithRelations = {
  ...eastEnglandNHSRegion,
  children: [basildonAndBrentwoodICB, cambridgeAndPeterboroughICB],
};

export const londonNHSRegion: Area = {
  code: 'E40000003',
  name: 'London NHS Region',
  areaType: nhsRegionsAreaType,
};

export const londonNHSRegionWithRelations: AreaWithRelations = {
  ...londonNHSRegion,
  children: [northCentralLondonICB, southEastLondonICB],
};

export const southEastNHSRegion: Area = {
  code: 'E40000005',
  name: 'South East NHS Region',
  areaType: nhsRegionsAreaType,
};

export const southEastNHSRegionWithRelations: AreaWithRelations = {
  ...southEastNHSRegion,
  children: [],
};

export const southWestNHSRegion: Area = {
  code: 'E40000006',
  name: 'South West NHS Region',
  areaType: nhsRegionsAreaType,
};

export const southWestNHSRegionWithRelations: AreaWithRelations = {
  ...southWestNHSRegion,
  children: [],
};

export const northWestNHSRegion: Area = {
  code: 'E40000010',
  name: 'North West NHS Region',
  areaType: nhsRegionsAreaType,
};

export const northWestNHSRegionWithRelations: AreaWithRelations = {
  ...northWestNHSRegion,
  children: [],
};

export const midlandsNHSRegion: Area = {
  code: 'E40000011',
  name: 'Midlands NHS Region',
  areaType: nhsRegionsAreaType,
};

export const midlandsNHSRegionWithRelations: AreaWithRelations = {
  ...midlandsNHSRegion,
  children: [],
};

export const northEastAndYorkshireNHSRegion: Area = {
  code: 'E40000012',
  name: 'North East and Yorkshire NHS Region',
  areaType: nhsRegionsAreaType,
};

export const northEastAndYorkshireNHSRegionWithRelations: AreaWithRelations = {
  ...northEastAndYorkshireNHSRegion,
  children: [],
};

export const allNhsRegions = [
  eastEnglandNHSRegion,
  londonNHSRegion,
  southEastNHSRegion,
  southWestNHSRegion,
  northWestNHSRegion,
  midlandsNHSRegion,
  northEastAndYorkshireNHSRegion,
];

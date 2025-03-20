import union from '@turf/union';
import { GeoJSON } from 'highcharts';
import { Feature, Polygon, MultiPolygon, FeatureCollection } from 'geojson';

import regionsMap from '@/assets/maps/Regions_December_2023_Boundaries_EN_BUC_1958740832896680092.geo.json';
import countiesAndUAsMap from '@/assets/maps/Counties_and_Unitary_Authorities_December_2023_Boundaries_UK_BSC_4952317392296043005.geo.json';
import districtsAndUAsMap from '@/assets/maps/Local_Authority_Districts_May_2024_Boundaries__UK_BSC_-5684348521832897108.geo.json';
import combinedAuthoritiesMap from '@/assets/maps/Combined_Authorities_December_2023_Boundaries_EN_BUC_2257483154257386964.geo.json';
import NHSRegionsMap from '@/assets/maps/NHS_England_Regions_January_2024_EN_BSC_7500404208533377417.geo.json';
import NHSICBMap from '@/assets/maps/Integrated_Care_Boards_April_2023_EN_BSC_-187828753279616787.geo.json';
import NHSSubICBMap from '@/assets/maps/NHS_SubICB_April_2023_EN_BSC_8040841744469859785.geo.json';
import { AreaTypeKeys } from '../areaFilterHelpers/areaType';

export type MapData = {
  mapJoinKey: string;
  mapFile: GeoJSON;
  mapGroupBoundary: GeoJSON;
};

export type AreaTypeKeysForMapMeta = Extract<
  AreaTypeKeys,
  | 'regions'
  | 'combined-authorities'
  | 'counties-and-unitary-authorities'
  | 'districts-and-unitary-authorities'
  | 'nhs-regions'
  | 'nhs-integrated-care-boards'
  | 'nhs-sub-integrated-care-boards'
>;

export function getMapData(
  areaType: AreaTypeKeysForMapMeta,
  areaCodes: string[]
): MapData {
  const mapJoinKey = mapMetaDataEncoder[areaType]?.joinKey;
  const mapFile = mapMetaDataEncoder[areaType]?.mapFile;

  const groupAreas = mapFile.features.filter((feature) =>
    areaCodes.includes(feature.properties[mapJoinKey])
  );
  const groupFeatureCollection = {
    type: 'FeatureCollection',
    features: groupAreas as Feature<Polygon | MultiPolygon>[],
  } satisfies FeatureCollection<Polygon | MultiPolygon>;

  return {
    mapJoinKey: mapJoinKey,
    mapFile: mapFile,
    mapGroupBoundary: {
      type: 'FeatureCollection',
      features: [union(groupFeatureCollection)!], // TODO: business logic should prevent this from ever being 'null'
    },
  };
}

interface MapMetaData {
  joinKey: string;
  mapFile: GeoJSON;
}

const mapMetaDataEncoder: Record<AreaTypeKeysForMapMeta, MapMetaData> = {
  'regions': { joinKey: 'RGN23CD', mapFile: regionsMap },
  'combined-authorities': {
    joinKey: 'CAUTH23CD',
    mapFile: combinedAuthoritiesMap,
  },
  'counties-and-unitary-authorities': {
    joinKey: 'CTYUA23CD',
    mapFile: countiesAndUAsMap,
  },
  'districts-and-unitary-authorities': {
    joinKey: 'LAD24CD',
    mapFile: districtsAndUAsMap,
  },
  'nhs-regions': { joinKey: 'NHSER24CD', mapFile: NHSRegionsMap },
  'nhs-integrated-care-boards': { joinKey: 'ICB23CD', mapFile: NHSICBMap },
  'nhs-sub-integrated-care-boards': {
    joinKey: 'SICBL23CD',
    mapFile: NHSSubICBMap,
  },
};

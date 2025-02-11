import union from '@turf/union';
import { GeoJSON } from 'highcharts';
import { Feature, Polygon, MultiPolygon, FeatureCollection } from 'geojson';

import regionsMap from '@/assets/maps/Regions_December_2023_Boundaries_EN_BUC_1958740832896680092.geo.json';
import countiesAndUAsMap from '@/assets/maps/Counties_and_Unitary_Authorities_December_2023_Boundaries_UK_BSC_4952317392296043005.geo.json';
import districtsAndUAsMap from '@/assets/maps/Local_Authority_Districts_May_2024_Boundaries__UK_BSC_-5684348521832897108.geo.json';
import combinedAuthorities from '@/assets/maps/Combined_Authorities_December_2023_Boundaries_EN_BUC_2257483154257386964.geo.json';
import NHSRegionsMap from '@/assets/maps/NHS_England_Regions_January_2024_EN_BSC_7500404208533377417.geo.json';
import NHSICBMap from '@/assets/maps/Integrated_Care_Boards_April_2023_EN_BSC_-187828753279616787.geo.json';
import NHSSubICBMap from '@/assets/maps/NHS_SubICB_April_2023_EN_BSC_8040841744469859785.geo.json';

export type MapData = {
  mapJoinKey: string;
  mapFile: GeoJSON;
  mapGroupBoundary: GeoJSON;
};
export function getMapData(areaType: string, areaCodes: string[]): MapData {
  const mapJoinKey = mapJoinKeyEncoder[areaType];
  const mapFile = mapFileEncoder[areaType];

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

const mapJoinKeyEncoder: Record<string, string> = {
  'Regions Statistical': 'RGN23CD',
  'Counties & UAs': 'CTYUA23CD',
  'Districts & UAs': 'LAD24CD',
  'Combined Authorities': 'CAUTH23CD',
  'NHS region': 'NHSER24CD',
  'ICB': 'ICB23CD',
  'Sub ICB': 'SICBL23CD',
};

const mapFileEncoder: Record<string, GeoJSON> = {
  'Regions Statistical': regionsMap,
  'Counties & UAs': countiesAndUAsMap,
  'Districts & UAs': districtsAndUAsMap,
  'Combined Authorities': combinedAuthorities,
  'NHS region': NHSRegionsMap,
  'ICB': NHSICBMap,
  'Sub ICB': NHSSubICBMap,
};

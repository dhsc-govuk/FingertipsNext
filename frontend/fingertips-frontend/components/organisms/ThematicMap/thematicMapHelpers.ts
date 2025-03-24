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
import { AreaTypeKeys } from '../../../lib/areaFilterHelpers/areaType';
import { GovukColours } from '../../../lib/styleHelpers/colours';
import {
  HealthDataForArea,
  HealthDataPointBenchmarkComparisonOutcomeEnum,
} from '@/generated-sources/ft-api-client';

export type MapData = {
  mapJoinKey: string;
  mapFile: GeoJSON;
  mapGroupBoundary: GeoJSON;
  mapSource?: string;
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
interface MapMetaData {
  joinKey: string;
  mapFile: GeoJSON;
  mapSource?: string;
}

const mapMetaDataEncoder: Record<AreaTypeKeysForMapMeta, MapMetaData> = {
  'regions': { joinKey: 'RGN23CD', mapFile: regionsMap, mapSource: 'ONS' },
  'combined-authorities': {
    joinKey: 'CAUTH23CD',
    mapFile: combinedAuthoritiesMap,
    mapSource: '<a href=#>ONS<a />',
  },
  'counties-and-unitary-authorities': {
    joinKey: 'CTYUA23CD',
    mapFile: countiesAndUAsMap,
  },
  'districts-and-unitary-authorities': {
    joinKey: 'LAD24CD',
    mapFile: districtsAndUAsMap,
    mapSource:
      '<span><a href="https://geoportal.statistics.gov.uk/maps/b67464d872004bfd91dc1b6211efefd1" target="_blank">ONS: Local Authority Districts May 2024 Boundaries UK BSC</a></span>' +
      '<br /><span>Office for National Statistics licensed under the Open Government Licence v.3.0</span>' +
      '<br /><span>Contains OS data © Crown copyright and database right 2025</span>',
  },
  'nhs-regions': { joinKey: 'NHSER24CD', mapFile: NHSRegionsMap },
  'nhs-integrated-care-boards': { joinKey: 'ICB23CD', mapFile: NHSICBMap },
  'nhs-sub-integrated-care-boards': {
    joinKey: 'SICBL23CD',
    mapFile: NHSSubICBMap,
  },
};

export function getMapData(
  areaType: AreaTypeKeysForMapMeta,
  areaCodes: string[]
): MapData {
  const mapJoinKey = mapMetaDataEncoder[areaType]?.joinKey;
  const mapFile = mapMetaDataEncoder[areaType]?.mapFile;
  const mapSource = mapMetaDataEncoder[areaType]?.mapSource;

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
    mapSource: mapSource,
  };
}

export const mapBenchmarkToColourRef: Record<
  HealthDataPointBenchmarkComparisonOutcomeEnum,
  number
> = {
  None: 5,
  Better: 15,
  Similar: 25,
  Worse: 35,
  Lower: 45,
  Higher: 55,
};

export const benchmarkColourScale = [
  {
    to: 10,
    name: 'None',
    color: GovukColours.White,
  },
  {
    from: 10,
    to: 20,
    name: 'Better',
    color: GovukColours.Green,
  },
  {
    from: 20,
    to: 30,
    name: 'Similar',
    color: GovukColours.Yellow,
  },
  {
    from: 30,
    to: 40,
    name: 'Worse',
    color: GovukColours.Red,
  },
  {
    from: 40,
    to: 50,
    name: 'Lower',
    color: GovukColours.LightBlue,
  },
  {
    from: 50,
    name: 'Higher',
    color: GovukColours.DarkBlue,
  },
];
export function prepareThematicMapSeriesData(
  data: HealthDataForArea[],
  // groupAreaCodes: string[],
  mapData: MapData
) {
  // const preparedDataForAllAreas = groupAreaCodes.map((groupAreaCode) => {
  //   // cannot use data, as it doesn't have the names for missing areas - needs to come from mapData
  //   // mapData.find() for fine-grained areas is better suited to server-side
  //   // refactor to use prepareThematicMapSeriesData() in View
  //   // pass dataForMap through on props
  //   // OR
  //   // get this from the filterdata...
  //   const areaName = mapData.mapFile.features.find(
  //     ({ properties }) => properties[mapData.mapJoinKey] === groupAreaCode
  //   )?.properties.LAD24NM; // TODO replace MAGICKEY with nameKey like joinKey

  //   // value has to come from data
  //   const value = data.find((areaData) => {
  //     areaData.areaCode === groupAreaCode;
  //   })?.healthData;
  //   console.log({ value });
  //   const preparedDataPoint = {
  //     areaName: areaName,
  //     areaCode: groupAreaCode,
  //     // value: data.find(),
  //     // value: areaData.healthData[0].value,
  //     // benchmarkComparison:
  //     //   areaData.healthData[0].benchmarkComparison?.outcome || 'None', // TODO: change fallback to 'Not Compared'
  //     // benchmarkColourCode: benchmarkColourCode,
  //   };
  //   console.log(preparedDataPoint);
  // });
  const preparedData = data.map((areaData) => {
    let benchmarkColourCode = 0;
    if (areaData.healthData[0].benchmarkComparison) {
      benchmarkColourCode =
        mapBenchmarkToColourRef[
          areaData.healthData[0].benchmarkComparison.outcome || 'None'
        ];
    }
    const preparedDataPoint = {
      areaName: areaData.areaName,
      areaCode: areaData.areaCode,
      value: areaData.healthData[0].value,
      benchmarkComparison:
        areaData.healthData[0].benchmarkComparison?.outcome || 'None', // TODO: change fallback to 'Not Compared'
      benchmarkColourCode: benchmarkColourCode,
    };
    return preparedDataPoint;
  });
  return preparedData;
}

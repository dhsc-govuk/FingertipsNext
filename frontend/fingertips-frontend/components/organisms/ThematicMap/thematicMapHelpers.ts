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
  BenchmarkOutcome,
  HealthDataForArea,
} from '@/generated-sources/ft-api-client';
import {
  getBenchmarkColour,
  getHealthDataForAreasForMostRecentYearOnly,
} from '@/lib/chartHelpers/chartHelpers';

export type MapGeographyData = {
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

export function getMapData(
  areaType: AreaTypeKeysForMapMeta,
  areaCodes: string[]
): MapGeographyData {
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
      features: [union(groupFeatureCollection)!], // business logic should prevent this from ever being 'null'
    },
  };
}

export const mapBenchmarkToColourRef: Record<BenchmarkOutcome, number> = {
  NotCompared: 5,
  Better: 15,
  Similar: 25,
  Worse: 35,
  Lower: 45,
  Higher: 55,
  Lowest: 0, // DHSCFT-528 will define mapping for Quintiles
  Low: 0,
  Middle: 0,
  High: 0,
  Highest: 0,
  Best: 0,
  Worst: 0,
};

export const benchmarkColourScale = [
  {
    to: 10,
    name: 'No Compared',
    color: GovukColours.White, // function won't return white
  },
  {
    from: 10,
    to: 20,
    name: 'Better',
    color: GovukColours.Green, //getBenchmarkColour()
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

export function prepareThematicMapSeriesData(data: HealthDataForArea[]) {
  return getHealthDataForAreasForMostRecentYearOnly(data).map((areaData) => {
    const [firstDataPoint] = areaData.healthData;
    return {
      areaName: areaData.areaName,
      areaCode: areaData.areaCode,
      value: firstDataPoint.value,
      benchmarkComparisonOutcome: firstDataPoint.benchmarkComparison?.outcome,
      benchmarkColourCode:
        mapBenchmarkToColourRef[
          firstDataPoint?.benchmarkComparison?.outcome ??
            BenchmarkOutcome.NotCompared
        ],
    };
  });
}

export function createThematicMapChartOptions(
  mapData: MapGeographyData,
  healthIndicatorData: HealthDataForArea[]
): Highcharts.Options {
  const data = prepareThematicMapSeriesData(healthIndicatorData);
  const options: Highcharts.Options = {
    chart: {
      height: 800,
      animation: false,
      borderWidth: 0.2,
      borderColor: 'black',
    },
    title: { text: undefined },
    accessibility: { enabled: false },
    credits: { enabled: false },
    legend: {
      enabled: false,
      verticalAlign: 'top',
    },
    mapView: {
      projection: { name: 'Miller' },
      fitToGeometry: mapData.mapGroupBoundary.features[0].geometry,
      padding: 20,
    },
    mapNavigation: { enabled: true },
    colorAxis: {
      dataClasses: benchmarkColourScale,
    },
    series: [
      {
        type: 'map',
        name: 'basemap',
        showInLegend: false,
        mapData: mapData.mapFile,
        borderColor: GovukColours.Black,
        borderWidth: 0.2,
      },
      {
        type: 'map',
        name: 'group border',
        showInLegend: false,
        mapData: mapData.mapGroupBoundary,
        borderColor: GovukColours.Black,
        borderWidth: 6,
      },
      {
        type: 'map',
        colorKey: 'benchmarkColourCode',
        name: 'data',
        mapData: mapData.mapFile,
        data: data,
        joinBy: [mapData.mapJoinKey, 'areaCode'],
        borderColor: GovukColours.Black,
        allAreas: false,
        borderWidth: 0.5,
        states: {
          hover: {
            borderWidth: 2,
            borderColor: GovukColours.Black,
          },
        },
        tooltip: {
          headerFormat:
            '<span style="font-size: large; font-weight: bold">{point.areaName}</span><br />',
          pointFormat:
            '<span style="font-size: large">Value: {point.value} units</span>' +
            '<br /><span>benchmark: {point.benchmarkComparison}</span>',
        },
      },
    ],
  };

  return options;
}

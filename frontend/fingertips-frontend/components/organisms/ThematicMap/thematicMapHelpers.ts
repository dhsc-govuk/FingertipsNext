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
  BenchmarkComparisonMethod,
  BenchmarkOutcome,
  HealthDataForArea,
  IndicatorPolarity,
} from '@/generated-sources/ft-api-client';
import {
  getBenchmarkColour,
  getIndicatorDataForAreasForMostRecentYearOnly,
} from '@/lib/chartHelpers/chartHelpers';

export type MapGeographyData = {
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

export function getMapGeographyData(
  areaType: AreaTypeKeysForMapMeta,
  areaCodes: string[]
): MapGeographyData {
  const mapFile = mapMetaDataEncoder[areaType]?.mapFile;

  const groupAreas = mapFile.features.filter((feature) =>
    areaCodes.includes(
      feature.properties[mapMetaDataEncoder[areaType]?.joinKey]
    )
  );
  const groupFeatureCollection = {
    type: 'FeatureCollection',
    features: groupAreas as Feature<Polygon | MultiPolygon>[],
  } satisfies FeatureCollection<Polygon | MultiPolygon>;

  return {
    mapFile: mapFile,
    mapGroupBoundary: {
      type: 'FeatureCollection',
      features: [union(groupFeatureCollection)!], // business logic should prevent this from ever being 'null'
    },
  };
}

const mapBenchmarkToColourRef: Record<BenchmarkOutcome, number> = {
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

function getBenchmarkColourScale(
  benchmarkComparisonMethod: BenchmarkComparisonMethod,
  polarity: IndicatorPolarity
) {
  return [
    {
      to: 10,
      color: getBenchmarkColour(
        benchmarkComparisonMethod,
        BenchmarkOutcome.NotCompared,
        polarity
      ),
    },
    {
      from: 10,
      to: 20,
      color: getBenchmarkColour(
        benchmarkComparisonMethod,
        BenchmarkOutcome.Better,
        polarity
      ),
    },
    {
      from: 20,
      to: 30,
      color: getBenchmarkColour(
        benchmarkComparisonMethod,
        BenchmarkOutcome.Similar,
        polarity
      ),
    },
    {
      from: 30,
      to: 40,
      color: getBenchmarkColour(
        benchmarkComparisonMethod,
        BenchmarkOutcome.Worse,
        polarity
      ),
    },
    {
      from: 40,
      to: 50,
      color: getBenchmarkColour(
        benchmarkComparisonMethod,
        BenchmarkOutcome.Lower,
        polarity
      ),
    },
    {
      from: 50,
      color: getBenchmarkColour(
        benchmarkComparisonMethod,
        BenchmarkOutcome.Higher,
        polarity
      ),
    },
  ];
}

export function prepareThematicMapSeriesData(data: HealthDataForArea[]) {
  return getIndicatorDataForAreasForMostRecentYearOnly(data).map((areaData) => {
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
  healthIndicatorData: HealthDataForArea[],
  groupType: AreaTypeKeysForMapMeta,
  benchmarkComparisonMethod: BenchmarkComparisonMethod,
  polarity: IndicatorPolarity
): Highcharts.Options {
  const data = prepareThematicMapSeriesData(healthIndicatorData);
  const options: Highcharts.Options = {
    chart: {
      height: 800,
      animation: false,
      borderWidth: 0.2,
      borderColor: GovukColours.Black,
    },
    title: { text: undefined },
    accessibility: { enabled: false },
    credits: { enabled: false },
    legend: {
      enabled: false,
    },
    mapView: {
      projection: { name: 'Miller' },
      fitToGeometry: mapData.mapGroupBoundary.features[0].geometry,
      padding: 20,
    },
    mapNavigation: { enabled: true },
    colorAxis: {
      dataClasses: getBenchmarkColourScale(benchmarkComparisonMethod, polarity),
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
        joinBy: [mapMetaDataEncoder[groupType].joinKey, 'areaCode'],
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
            `<br /><span>benchmark method: ${benchmarkComparisonMethod}</span>` +
            '<br /><span>benchmark outcome: {point.benchmarkComparisonOutcome}</span>',
        },
      },
    ],
  };

  return options;
}

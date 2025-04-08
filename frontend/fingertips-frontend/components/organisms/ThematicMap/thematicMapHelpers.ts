import union from '@turf/union';
import { GeoJSON } from 'highcharts';
import { Feature, FeatureCollection, MultiPolygon, Polygon } from 'geojson';
import { GovukColours } from '@/lib/styleHelpers/colours';
import {
  BenchmarkComparisonMethod,
  BenchmarkOutcome,
  HealthDataForArea,
  IndicatorPolarity,
} from '@/generated-sources/ft-api-client';
import {
  getAreaIndicatorDataForYear,
  getBenchmarkColour,
  getConfidenceLimitNumber,
  getIndicatorDataForAreasForMostRecentYearOnly,
} from '@/lib/chartHelpers/chartHelpers';
import { SymbolsEnum } from '@/lib/chartHelpers/pointFormatterHelper';
import { formatNumber } from '@/lib/numberFormatter';
import { IndicatorDocument } from '@/lib/search/searchTypes';

export type MapGeographyData = {
  mapFile: GeoJSON;
  mapGroupBoundary: GeoJSON;
};

export const allowedAreaTypeMapMetaKeys = [
  'regions',
  'combined-authorities',
  'counties-and-unitary-authorities',
  'districts-and-unitary-authorities',
  'nhs-regions',
  'nhs-integrated-care-boards',
  'nhs-sub-integrated-care-boards',
] as const;

export type AreaTypeKeysForMapMeta =
  (typeof allowedAreaTypeMapMetaKeys)[number];

interface MapMetaData {
  joinKey: string;
  mapFile: () => Promise<{ default: GeoJSON }>;
  mapSource: string;
  mapCopyright: string;
  mapSourceURL: string;
}

// where to find map data, the compiler needs to see import('@/...') it cannot accept a variable in import
const regionsMap = () =>
  import(
    '@/assets/maps/Regions_December_2023_Boundaries_EN_BUC_1958740832896680092.geo.json'
  );
const countiesAndUAsMap = () =>
  import(
    '@/assets/maps/Counties_and_Unitary_Authorities_December_2023_Boundaries_UK_BSC_4952317392296043005.geo.json'
  );
const districtsAndUAsMap = () =>
  import(
    '@/assets/maps/Local_Authority_Districts_May_2024_Boundaries__UK_BSC_-5684348521832897108.geo.json'
  );
const combinedAuthoritiesMap = () =>
  import(
    '@/assets/maps/Combined_Authorities_December_2023_Boundaries_EN_BUC_2257483154257386964.geo.json'
  );
const NHSRegionsMap = () =>
  import(
    '@/assets/maps/NHS_England_Regions_January_2024_EN_BSC_7500404208533377417.geo.json'
  );
const NHSICBMap = () =>
  import(
    '@/assets/maps/Integrated_Care_Boards_April_2023_EN_BSC_-187828753279616787.geo.json'
  );
const NHSSubICBMap = () =>
  import(
    '@/assets/maps/NHS_SubICB_April_2023_EN_BSC_8040841744469859785.geo.json'
  );

export const mapMetaDataEncoder: Record<AreaTypeKeysForMapMeta, MapMetaData> = {
  'regions': {
    joinKey: 'RGN23CD',
    mapFile: regionsMap,
    mapSource: `Office for National Statistics: Regions 2023`,
    mapCopyright: `Office for National Statistics licensed under the Open Government Licence v.3.0
    Contains OS data © Crown copyright and database right ${new Date().getFullYear()}`,
    mapSourceURL:
      'https://geoportal.statistics.gov.uk/maps/cc7bb689f5cc4bce9d03af8f519119a9',
  },
  'combined-authorities': {
    joinKey: 'CAUTH23CD',
    mapFile: combinedAuthoritiesMap,
    mapSource: `Office for National Statistics: Combined Authorities December 2023`,
    mapCopyright: `Office for National Statistics licensed under the Open Government Licence v.3.0
    Contains OS data © Crown copyright and database right ${new Date().getFullYear()}`,
    mapSourceURL:
      'https://geoportal.statistics.gov.uk/maps/269d91ffb2de4c618c4cb6960444a08a',
  },
  'counties-and-unitary-authorities': {
    joinKey: 'CTYUA23CD',
    mapFile: countiesAndUAsMap,
    mapSource: `Office for National Statistics: Counties and Unitary Authorities December 2023`,
    mapCopyright: `Office for National Statistics licensed under the Open Government Licence v.3.0
    Contains OS data © Crown copyright and database right ${new Date().getFullYear()}`,
    mapSourceURL:
      'https://geoportal.statistics.gov.uk/maps/1d8e75f9179b4048ab1d7cbf712edc4e',
  },
  'districts-and-unitary-authorities': {
    joinKey: 'LAD24CD',
    mapFile: districtsAndUAsMap,
    mapSource: `Office for National Statistics: Local Authority Districts May 2024`,
    mapCopyright: `Office for National Statistics licensed under the Open Government Licence v.3.0
    Contains OS data © Crown copyright and database right ${new Date().getFullYear()}`,
    mapSourceURL:
      'https://geoportal.statistics.gov.uk/maps/1d4189a8b5db4c28afea8832ab73f93c',
  },
  'nhs-regions': {
    joinKey: 'NHSER24CD',
    mapFile: NHSRegionsMap,
    mapSource: `Office for National Statistics: NHS Regions January 2024`,
    mapCopyright: `Office for National Statistics licensed under the Open Government Licence v.3.0
    Contains OS data © Crown copyright and database right ${new Date().getFullYear()}`,
    mapSourceURL:
      'https://geoportal.statistics.gov.uk/maps/e9c506682a204bf6952a140af8e99bca',
  },
  'nhs-integrated-care-boards': {
    joinKey: 'ICB23CD',
    mapFile: NHSICBMap,
    mapSource: `Office for National Statistics: NHS Integrated Care Boards April 2023`,
    mapCopyright: `Office for National Statistics licensed under the Open Government Licence v.3.0
    Contains OS data © Crown copyright and database right ${new Date().getFullYear()}`,
    mapSourceURL:
      'https://geoportal.statistics.gov.uk/maps/76dad7f9577147b2b636d4f95345d28d',
  },
  'nhs-sub-integrated-care-boards': {
    joinKey: 'SICBL23CD',
    mapFile: NHSSubICBMap,
    mapSource: `Office for National Statistics: Sub NHS Integrated Care Boards April 2023 `,
    mapCopyright: `Office for National Statistics licensed under the Open Government Licence v.3.0
    Contains OS data © Crown copyright and database right ${new Date().getFullYear()}`,
    mapSourceURL:
      'https://geoportal.statistics.gov.uk/maps/fe17bb9ca66446b6b8faf992b5d24274',
  },
};

export async function getMapGeographyData(
  areaType: AreaTypeKeysForMapMeta,
  areaCodes: string[]
): Promise<MapGeographyData> {
  const mapModule = await mapMetaDataEncoder[areaType].mapFile();
  const mapFile: GeoJSON = mapModule.default;
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
  Lowest: 105,
  Low: 115,
  Middle: 125,
  High: 135,
  Highest: 145,
  Best: 155,
  Worst: 165,
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
      to: 60,
      color: getBenchmarkColour(
        benchmarkComparisonMethod,
        BenchmarkOutcome.Higher,
        polarity
      ),
    },
    {
      from: 100,
      to: 110,
      color: getBenchmarkColour(
        benchmarkComparisonMethod,
        BenchmarkOutcome.Lowest,
        polarity
      ),
    },
    {
      from: 110,
      to: 120,
      color: getBenchmarkColour(
        benchmarkComparisonMethod,
        BenchmarkOutcome.Low,
        polarity
      ),
    },
    {
      from: 120,
      to: 130,
      color: getBenchmarkColour(
        benchmarkComparisonMethod,
        BenchmarkOutcome.Middle,
        polarity
      ),
    },
    {
      from: 130,
      to: 140,
      color: getBenchmarkColour(
        benchmarkComparisonMethod,
        BenchmarkOutcome.High,
        polarity
      ),
    },
    {
      from: 140,
      to: 150,
      color: getBenchmarkColour(
        benchmarkComparisonMethod,
        BenchmarkOutcome.Highest,
        polarity
      ),
    },
    {
      from: 150,
      to: 160,
      color: getBenchmarkColour(
        benchmarkComparisonMethod,
        BenchmarkOutcome.Best,
        polarity
      ),
    },
    {
      from: 160,
      to: 170,
      color: getBenchmarkColour(
        benchmarkComparisonMethod,
        BenchmarkOutcome.Worst,
        polarity
      ),
    },
  ];
}

export function prepareThematicMapSeriesData(data: HealthDataForArea[]) {
  return getIndicatorDataForAreasForMostRecentYearOnly(data).map((areaData) => {
    const [mostRecentDataPoint] = areaData.healthData;
    return {
      areaName: areaData.areaName,
      areaCode: areaData.areaCode,
      value: mostRecentDataPoint.value,
      year: mostRecentDataPoint.year,
      benchmarkComparisonOutcome:
        mostRecentDataPoint.benchmarkComparison?.outcome,
      benchmarkColourCode:
        mapBenchmarkToColourRef[
          mostRecentDataPoint?.benchmarkComparison?.outcome ??
            BenchmarkOutcome.NotCompared
        ],
    };
  });
}

export function createThematicMapChartOptions(
  healthIndicatorData: HealthDataForArea[],
  mapGeographyData: MapGeographyData,
  areaType: AreaTypeKeysForMapMeta,
  benchmarkComparisonMethod: BenchmarkComparisonMethod,
  polarity: IndicatorPolarity,
  indicatorMetadata?: IndicatorDocument,
  benchmarkIndicatorData?: HealthDataForArea,
  groupIndicatorData?: HealthDataForArea
): Highcharts.Options {
  const data = prepareThematicMapSeriesData(healthIndicatorData);
  const options: Highcharts.Options = {
    chart: {
      height: 800,
      animation: false,
      marginLeft: 0,
      marginRight: 0,
    },
    title: { text: undefined },
    accessibility: { enabled: false },
    credits: { enabled: false },
    legend: {
      enabled: false,
    },
    mapView: {
      projection: { name: 'Miller' },
      fitToGeometry: mapGeographyData.mapGroupBoundary.features[0].geometry,
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
        mapData: mapGeographyData.mapFile,
        borderColor: GovukColours.Black,
        borderWidth: 0.2,
      },
      {
        type: 'map',
        name: 'group border',
        showInLegend: false,
        mapData: mapGeographyData.mapGroupBoundary,
        borderColor: GovukColours.Black,
        borderWidth: 3,
      },
      {
        type: 'map',
        colorKey: 'benchmarkColourCode',
        name: 'data',
        mapData: mapGeographyData.mapFile,
        data: data,
        joinBy: [mapMetaDataEncoder[areaType].joinKey, 'areaCode'],
        borderColor: GovukColours.Black,
        allAreas: false,
        borderWidth: 0.5,
        states: {
          hover: {
            borderWidth: 2,
            borderColor: GovukColours.Black,
          },
        },
      },
    ],
    tooltip: {
      headerFormat: '',
      useHTML: true,
      pointFormatter: function (this: Highcharts.Point) {
        return generateThematicMapTooltipString(
          this,
          benchmarkIndicatorData,
          groupIndicatorData,
          benchmarkComparisonMethod,
          polarity,
          indicatorMetadata?.unitLabel
        );
      },
    },
  };

  return options;
}

export function generateThematicMapTooltipString(
  // any required to allow customisation of Highcharts tooltips
  /* eslint-disable @typescript-eslint/no-explicit-any */
  point: any,
  benchmarkIndicatorData: HealthDataForArea | undefined,
  groupIndicatorData: HealthDataForArea | undefined,
  benchmarkComparisonMethod: BenchmarkComparisonMethod,
  polarity: IndicatorPolarity,
  measurementUnit?: string
): string {
  const benchmarkArea = benchmarkIndicatorData?.areaName ?? 'England';
  const benchmarkConfidenceLimit = getConfidenceLimitNumber(
    benchmarkComparisonMethod
  );
  const benchmarkConfidenceLimitLabel = benchmarkConfidenceLimit
    ? `${benchmarkConfidenceLimit}%`
    : null;

  const areaMarkerSymbol =
    (point.benchmarkComparisonOutcome as BenchmarkOutcome) ===
    BenchmarkOutcome.NotCompared
      ? SymbolsEnum.MultiplicationX
      : SymbolsEnum.Circle;

  const groupMarkerSymbol =
    groupIndicatorData?.healthData[0].benchmarkComparison?.outcome ===
    BenchmarkOutcome.NotCompared
      ? SymbolsEnum.MultiplicationX
      : SymbolsEnum.Diamond;

  const tooltipString = [
    `<br /><span style="font-weight: bold">${point.areaName}</span>` +
      `<br /><span>${point.year}</span>` +
      `<br /><span style="color: ${
        getBenchmarkColour(
          benchmarkComparisonMethod,
          point.benchmarkComparisonOutcome,
          polarity
        ) ?? GovukColours.Black
      }; font-size: large;">${areaMarkerSymbol}</span>` +
      `<span>${formatNumber(point.value)} ${measurementUnit}</span>` +
      `<br /><span>${point.benchmarkComparisonOutcome} than ${benchmarkArea}</span>` +
      `<br /><span>(${benchmarkConfidenceLimitLabel})</span>`,
  ];

  if (groupIndicatorData !== undefined) {
    const groupIndicatorDataForYear = getAreaIndicatorDataForYear(
      groupIndicatorData,
      point.year
    );
    tooltipString.unshift(
      `<br /><span style="font-weight: bold">Group: ${groupIndicatorDataForYear.areaName}</span>` +
        `<br /><span>${groupIndicatorDataForYear.healthData[0].year}</span>` +
        `<br /><span style="color: ${
          getBenchmarkColour(
            benchmarkComparisonMethod,
            groupIndicatorDataForYear.healthData[0].benchmarkComparison
              ?.outcome ?? 'NotCompared',
            polarity
          ) ?? GovukColours.Black
        }; font-size: large;">${groupMarkerSymbol}</span>` +
        `<span>${formatNumber(groupIndicatorDataForYear.healthData[0].value)} ${measurementUnit}</span>` +
        `<br /><span>${
          groupIndicatorDataForYear.healthData[0].benchmarkComparison?.outcome
        } than ${benchmarkArea}</span>` +
        `<br /><span>(${benchmarkConfidenceLimitLabel})</span>`
    );
  }

  if (benchmarkIndicatorData !== undefined) {
    const benchmarkIndicatorDataForYear = getAreaIndicatorDataForYear(
      benchmarkIndicatorData,
      point.year
    );
    tooltipString.unshift(
      `<span style="font-weight: bold">Benchmark: ${benchmarkIndicatorDataForYear.areaName}</span>` +
        `<br /><span>${benchmarkIndicatorDataForYear.healthData[0].year}</span>` +
        `<br /><span style="color: ${GovukColours.Black}; font-size: large;">${SymbolsEnum.Circle}</span>` +
        `<span>${formatNumber(benchmarkIndicatorDataForYear.healthData[0].value)} ${measurementUnit}</span>`
    );
  }

  return tooltipString.join('');
}

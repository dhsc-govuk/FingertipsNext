import { IndicatorDocument, AreaDocument } from '@/lib/search/searchTypes';
import ChartPage from './page-objects/pages/chartPage';

export enum SearchMode {
  ONLY_SUBJECT = 'ONLY_SUBJECT',
  ONLY_AREA = 'ONLY_AREA',
  BOTH_SUBJECT_AND_AREA = 'BOTH_SUBJECT_AND_AREA',
}

export enum IndicatorMode {
  ONE_INDICATOR = 'ONE_INDICATOR',
  TWO_INDICATORS = 'TWO_INDICATORS',
}

export enum AreaMode {
  ONE_AREA = 'ONE_AREA',
  TWO_AREAS = 'TWO_AREAS', // in the same group
  THREE_PLUS_AREAS = 'THREE_PLUS_AREAS', // 3+ areas in a group
  ALL_AREAS_IN_A_GROUP = 'ALL_AREAS_IN_A_GROUP',
  ENGLAND_AREA = 'ENGLAND_AREA',
}

type ScenarioConfig = {
  visibleComponents: string[];
  hiddenComponents: string[];
};

export function getScenarioConfig(
  indicatorMode: IndicatorMode,
  areaMode: AreaMode
): ScenarioConfig {
  // Enable in DHSCFT-148
  // const defaultVisible = [this.populationPyramidComponent];
  const defaultVisible: never[] = [];

  const defaultHidden = [
    ChartPage.lineChartComponent,
    ChartPage.lineChartTableComponent,
    ChartPage.inequalitiesComponent,
    // DHSCFT-220 will implement this logic
    // this.barChartComponent,
  ];

  // Single indicator scenarios show all charts
  const singleIndicatorOneAreaConfig: ScenarioConfig = {
    visibleComponents: [
      ChartPage.lineChartComponent,
      ChartPage.lineChartTableComponent,
      ChartPage.barChartComponent,
      // Enable in DHSCFT-148
      // ChartPage.populationPyramidComponent,
      ChartPage.inequalitiesComponent,
    ],
    hiddenComponents: [],
  };

  // Single indicator scenarios show all charts
  const singleIndicatorTwoAreasConfig: ScenarioConfig = {
    visibleComponents: [
      ChartPage.barChartComponent,
      ChartPage.lineChartComponent,
      ChartPage.lineChartTableComponent,
      ChartPage.barChartEmbeddedTableComponent,
      // Enable in DHSCFT-148
      // ChartPage.populationPyramidComponent,
      // Enable in DHSCFT-317
      // ChartPage.thematicMapComponent
    ],
    hiddenComponents: [],
  };

  // Map of the four supported scenarios, known as the core journeys, to their chart page configurations
  const scenarioConfigs = new Map<[IndicatorMode, AreaMode], ScenarioConfig>([
    [
      [IndicatorMode.ONE_INDICATOR, AreaMode.ONE_AREA],
      singleIndicatorOneAreaConfig,
    ],
    [
      [IndicatorMode.ONE_INDICATOR, AreaMode.TWO_AREAS],
      singleIndicatorTwoAreasConfig,
    ],
    [
      [IndicatorMode.TWO_INDICATORS, AreaMode.TWO_AREAS],
      { visibleComponents: defaultVisible, hiddenComponents: defaultHidden },
    ],
    // [
    //   [IndicatorMode.TWO_INDICATORS, AreaMode.ENGLAND_AREA],
    //   { visibleComponents: defaultVisible, hiddenComponents: defaultHidden },
    // ],
  ]);

  const config = Array.from(scenarioConfigs.entries()).find(
    ([[mode, area]]) => mode === indicatorMode && area === areaMode
  )?.[1];

  if (!config) {
    throw new Error(
      `Combination of indicator mode: ${indicatorMode} + area mode: ${areaMode} is not one of the four core journeys`
    );
  }

  return config;
}

function filterIndicatorsByName(
  indicators: IndicatorDocument[],
  searchTerm: string
): IndicatorDocument[] {
  if (!searchTerm) return [];

  const normalizedSearchTerm = searchTerm.toLowerCase();
  return indicators.filter(
    (indicator) =>
      indicator.usedInPoc === true &&
      indicator.indicatorName.toLowerCase().includes(normalizedSearchTerm) &&
      // the following filters are needed due to an API bug see DHSCFT-434
      !indicator.indicatorName.includes('years') &&
      !indicator.indicatorName.includes('females') &&
      !indicator.indicatorName.includes('sex')
  );
}

export function getAllIndicatorIdsForSearchTerm(
  indicators: IndicatorDocument[],
  searchTerm: string
): string[] {
  return filterIndicatorsByName(indicators, searchTerm).map(
    (indicator) => indicator.indicatorID
  );
}

export function getAllNHSRegionAreas(areas: AreaDocument[]): AreaDocument[] {
  const nhsRegionAreas = areas.filter((area) =>
    area.areaType.includes('NHS Region')
  );

  return nhsRegionAreas;
}

export function returnIndicatorIDsByIndicatorMode(
  indicators: string[],
  indicatorMode: IndicatorMode
): string[] {
  switch (indicatorMode) {
    case IndicatorMode.ONE_INDICATOR:
      return [indicators[0]];
    case IndicatorMode.TWO_INDICATORS:
      return [indicators[0], indicators[1]];
    default:
      throw new Error('Invalid indicator mode');
  }
}

export function sortAlphabetically(array: (string | null)[]) {
  array.sort((a, b) => a!.localeCompare(b!));
}

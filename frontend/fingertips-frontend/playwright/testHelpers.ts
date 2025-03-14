import { IndicatorDocument, AreaDocument } from '@/lib/search/searchTypes';
import ChartPage from './page-objects/pages/chartPage';

export enum SearchMode {
  ONLY_SUBJECT = 'ONLY_SUBJECT',
  ONLY_AREA = 'ONLY_AREA',
  BOTH_SUBJECT_AND_AREA = 'BOTH_SUBJECT_AND_AREA',
}

export enum IndicatorMode {
  ONE_INDICATOR = 'ONE_INDICATOR',
  TWO_PLUS_INDICATORS = 'TWO_PLUS_INDICATORS',
}

export enum AreaMode {
  ONE_AREA = 'ONE_AREA',
  TWO_PLUS_AREAS = 'TWO_PLUS_AREAS',
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
  // Define all available components
  const allComponents = [
    ChartPage.lineChartComponent,
    ChartPage.lineChartTableComponent,
    ChartPage.inequalitiesComponent,
    // Enable in DHSCFT-220
    // ChartPage.inequalitiesBarChartComponent,
    // Enable in DHSCFT-220
    // ChartPage.inequalitiesLineChartComponent,
    // Enable in DHSCFT-148
    // ChartPage.populationPyramidComponent,
    // Enable in DHSCFT-317
    // ChartPage.thematicMapComponent,
    ChartPage.barChartEmbeddedTableComponent,
    // Pending
    // ChartPage.basicTableComponent,
    // ChartPage.spineChartComponent,
    // ChartPage.heatMapComponent,
  ];

  let visibleComponents: string[] = [];

  // 1 indicator, 1 area
  if (
    indicatorMode === IndicatorMode.ONE_INDICATOR &&
    areaMode === AreaMode.ONE_AREA
  ) {
    visibleComponents = [
      ChartPage.lineChartComponent,
      ChartPage.lineChartTableComponent,
      ChartPage.inequalitiesComponent,
      // Enable in DHSCFT-220
      // ChartPage.inequalitiesBarChartComponent,
      // ChartPage.inequalitiesLineChartComponent,
      // Enable in DHSCFT-148
      // ChartPage.populationPyramidComponent,
    ];
  }
  // 1 indicator, 2+ areas
  else if (
    indicatorMode === IndicatorMode.ONE_INDICATOR &&
    areaMode === AreaMode.TWO_PLUS_AREAS
  ) {
    visibleComponents = [
      // Enable in DHSCFT-148
      // ChartPage.populationPyramidComponent,
      // Enable in DHSCFT-317
      // ChartPage.thematicMapComponent,
      ChartPage.lineChartComponent,
      ChartPage.lineChartTableComponent,
      ChartPage.barChartEmbeddedTableComponent,
    ];
  }
  // 2+ indicators, England area
  else if (
    indicatorMode === IndicatorMode.TWO_PLUS_INDICATORS &&
    areaMode === AreaMode.ENGLAND_AREA
  ) {
    visibleComponents = [
      // Pending
      // ChartPage.basicTableComponent,
      // Enable in DHSCFT-148
      // ChartPage.populationPyramidComponent,
    ];
  }
  // 2+ indicators, 2+ areas (not England)
  else if (
    indicatorMode === IndicatorMode.TWO_PLUS_INDICATORS &&
    areaMode === AreaMode.TWO_PLUS_AREAS
  ) {
    visibleComponents = [
      // Pending
      // ChartPage.spineChartComponent,
      // ChartPage.heatMapComponent,
      // Enable in DHSCFT-148
      // ChartPage.populationPyramidComponent,
    ];
  } else {
    throw new Error(
      `Combination of indicator mode: ${indicatorMode} + area mode: ${areaMode} is not supported.`
    );
  }

  // Work out which components should be hidden
  const hiddenComponents = allComponents.filter(
    (component) => !visibleComponents.includes(component)
  );

  const config: ScenarioConfig = {
    visibleComponents,
    hiddenComponents,
  };

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
    case IndicatorMode.TWO_PLUS_INDICATORS:
      return [indicators[0], indicators[1]];
    default:
      throw new Error('Invalid indicator mode');
  }
}

export function sortAlphabetically(array: (string | null)[]) {
  array.sort((a, b) => a!.localeCompare(b!));
}

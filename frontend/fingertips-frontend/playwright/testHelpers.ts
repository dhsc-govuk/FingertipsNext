import { IndicatorDocument, AreaDocument } from '@/lib/search/searchTypes';
import ChartPage from './page-objects/pages/chartPage';
import { SimpleIndicatorDocument } from './tests/data_quality_testing/loop_all_indicators.spec';

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
  TWO_AREAS = 'TWO_AREAS',
  TWO_PLUS_AREAS = 'TWO_PLUS_AREAS',
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
  // Define all available components
  const allComponents = [
    ChartPage.lineChartComponent,
    ChartPage.lineChartTableComponent,
    ChartPage.inequalitiesComponent,
    ChartPage.inequalitiesBarChartComponent,
    ChartPage.inequalitiesLineChartComponent,
    ChartPage.inequalitiesBarChartTableComponent,
    ChartPage.inequalitiesLineChartTableComponent,
    // Enable in DHSCFT-148
    // ChartPage.populationPyramidComponent,
    ChartPage.thematicMapComponent,
    ChartPage.barChartEmbeddedTableComponent,
    // Pending
    // ChartPage.basicTableComponent,
    // ChartPage.spineChartComponent,
    // ChartPage.heatMapComponent,
  ];

  let visibleComponents: string[] = [];

  // 1 indicator, 1 area
  if (
    (indicatorMode === IndicatorMode.ONE_INDICATOR &&
      areaMode === AreaMode.ONE_AREA) ||
    (indicatorMode === IndicatorMode.ONE_INDICATOR &&
      areaMode === AreaMode.ENGLAND_AREA)
  ) {
    visibleComponents = [
      ChartPage.lineChartComponent,
      ChartPage.lineChartTableComponent,
      ChartPage.inequalitiesComponent,
      ChartPage.inequalitiesBarChartComponent,
      ChartPage.inequalitiesLineChartComponent,
      ChartPage.inequalitiesBarChartTableComponent,
      ChartPage.inequalitiesLineChartTableComponent,
      // Enable in DHSCFT-148
      // ChartPage.populationPyramidComponent,
    ];
  }
  // 1 indicator, 2 areas
  else if (
    indicatorMode === IndicatorMode.ONE_INDICATOR &&
    areaMode === AreaMode.TWO_AREAS
  ) {
    visibleComponents = [
      // Enable in DHSCFT-148
      // ChartPage.populationPyramidComponent,
      ChartPage.lineChartComponent,
      ChartPage.lineChartTableComponent,
      ChartPage.barChartEmbeddedTableComponent,
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
      ChartPage.barChartEmbeddedTableComponent,
    ];
  }
  // 1 indicator, all areas in a group
  else if (
    indicatorMode === IndicatorMode.ONE_INDICATOR &&
    areaMode === AreaMode.ALL_AREAS_IN_A_GROUP
  ) {
    visibleComponents = [
      ChartPage.thematicMapComponent,
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
      indicator.indicatorName.toLowerCase().includes(normalizedSearchTerm)
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

function filterIndicatorsOnlyPOC(
  indicators: IndicatorDocument[]
): SimpleIndicatorDocument[] {
  return indicators.filter(
    (indicator) =>
      indicator.usedInPoc === true &&
      // filters needed for one indicator (in loop) + all but one areas in group + only subject - log a bug for filtering by all regions - ticket 1
      !indicator.indicatorName.includes(
        `People reporting Alzheimer's disease or dementia`
      ) &&
      !indicator.indicatorName.includes(
        `People with caring responsibility aged 16 years and over`
      ) &&
      // filters needed for one indicator (in loop) + ( all areas in a group || ENGLAND ) + only subject - log a bug for these 4 data issues - ticket 2
      !indicator.indicatorName.includes(
        'Hepatitis B vaccination coverage aged 2 years'
      ) &&
      !indicator.indicatorName.includes(
        'Obesity prevalence (including severe obesity) in Year 6 children aged 10 to 11 years'
      ) &&
      !indicator.indicatorName.includes(
        'Physically inactive in adults aged 19 years and over'
      ) &&
      !indicator.indicatorName.includes(
        'Overweight prevalence (including obesity) in adults aged 18 years and over'
      )
  );
}

export function getAllPOCIndicators(
  indicators: IndicatorDocument[]
): SimpleIndicatorDocument[] {
  return filterIndicatorsOnlyPOC(indicators).map((indicator) => ({
    indicatorName: indicator.indicatorName,
    indicatorID: indicator.indicatorID,
    associatedAreaCodes: indicator.associatedAreaCodes,
  }));
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

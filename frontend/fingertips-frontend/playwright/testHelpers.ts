import { AreaDocument, RawIndicatorDocument } from '@/lib/search/searchTypes';
import ChartPage from './page-objects/pages/chartPage';
import { AreaTypeKeys } from '@/lib/areaFilterHelpers/areaType';

export enum SearchMode {
  ONLY_SUBJECT = 'ONLY_SUBJECT',
  ONLY_AREA = 'ONLY_AREA',
  BOTH_SUBJECT_AND_AREA = 'BOTH_SUBJECT_AND_AREA',
}

export enum IndicatorMode {
  ONE_INDICATOR = 'ONE_INDICATOR',
  TWO_INDICATORS = 'TWO_INDICATORS',
  THREE_PLUS_INDICATORS = 'THREE_PLUS_INDICATORS',
}

export enum AreaMode {
  ONE_AREA = 'ONE_AREA',
  TWO_AREAS = 'TWO_AREAS',
  THREE_PLUS_AREAS = 'THREE_PLUS_AREAS',
  ALL_AREAS_IN_A_GROUP = 'ALL_AREAS_IN_A_GROUP',
  ENGLAND_AREA = 'ENGLAND_AREA',
}

type componentProps = {
  hasConfidenceIntervals: boolean;
  isTabTable: boolean;
  hasDetailsExpander: boolean;
  hasTimePeriodDropDown: boolean;
  hasTypeDropDown: boolean;
};

type component = {
  componentLocator: string;
  componentProps: componentProps;
};

type ScenarioConfig = {
  visibleComponents: component[];
  hiddenComponents: component[];
};

export function getScenarioConfig(
  indicatorMode: IndicatorMode,
  areaMode: AreaMode
): ScenarioConfig {
  // Define all available components and their properties
  const allComponents: component[] = [
    {
      componentLocator: ChartPage.lineChartComponent,
      componentProps: {
        hasConfidenceIntervals: true,
        isTabTable: false,
        hasDetailsExpander: false,
        hasTimePeriodDropDown: false,
        hasTypeDropDown: false,
      },
    },
    {
      componentLocator: ChartPage.lineChartTableComponent,
      componentProps: {
        hasConfidenceIntervals: false,
        isTabTable: true,
        hasDetailsExpander: false,
        hasTimePeriodDropDown: false,
        hasTypeDropDown: false,
      },
    },
    {
      componentLocator: ChartPage.inequalitiesBarChartComponent,
      componentProps: {
        hasConfidenceIntervals: true,
        isTabTable: false,
        hasDetailsExpander: false,
        hasTimePeriodDropDown: false,
        hasTypeDropDown: false,
      },
    },
    {
      componentLocator: ChartPage.inequalitiesForSingleTimePeriodComponent,
      componentProps: {
        hasConfidenceIntervals: true,
        isTabTable: false,
        hasTimePeriodDropDown: true,
        hasDetailsExpander: false,
        hasTypeDropDown: true,
      },
    },
    {
      componentLocator: ChartPage.inequalitiesTrendComponent,
      componentProps: {
        hasConfidenceIntervals: false,
        isTabTable: false,
        hasTimePeriodDropDown: false,
        hasDetailsExpander: false,
        hasTypeDropDown: true,
      },
    },
    {
      componentLocator: ChartPage.inequalitiesLineChartComponent,
      componentProps: {
        hasConfidenceIntervals: true,
        isTabTable: false,
        hasDetailsExpander: false,
        hasTimePeriodDropDown: false,
        hasTypeDropDown: false,
      },
    },
    {
      componentLocator: ChartPage.inequalitiesBarChartTableComponent,
      componentProps: {
        hasConfidenceIntervals: false,
        isTabTable: true,
        hasDetailsExpander: false,
        hasTimePeriodDropDown: false,
        hasTypeDropDown: false,
      },
    },
    {
      componentLocator: ChartPage.inequalitiesLineChartTableComponent,
      componentProps: {
        hasConfidenceIntervals: false,
        isTabTable: true,
        hasDetailsExpander: false,
        hasTimePeriodDropDown: false,
        hasTypeDropDown: false,
      },
    },
    {
      componentLocator: ChartPage.populationPyramidComponent,
      componentProps: {
        hasConfidenceIntervals: false,
        isTabTable: false,
        hasDetailsExpander: true,
        hasTimePeriodDropDown: false,
        hasTypeDropDown: false,
      },
    },
    {
      componentLocator: ChartPage.thematicMapComponent,
      componentProps: {
        hasConfidenceIntervals: false,
        isTabTable: false,
        hasDetailsExpander: false,
        hasTimePeriodDropDown: false,
        hasTypeDropDown: false,
      },
    },
    {
      componentLocator: ChartPage.barChartEmbeddedTableComponent,
      componentProps: {
        hasConfidenceIntervals: true,
        isTabTable: false,
        hasDetailsExpander: false,
        hasTimePeriodDropDown: false,
        hasTypeDropDown: false,
      },
    },
    {
      componentLocator: ChartPage.spineChartTableComponent,
      componentProps: {
        hasConfidenceIntervals: false,
        isTabTable: false,
        hasDetailsExpander: false,
        hasTimePeriodDropDown: false,
        hasTypeDropDown: false,
      },
    },
    {
      componentLocator: ChartPage.OneAreaMultipleIndicatorsTableComponent,
      componentProps: {
        hasConfidenceIntervals: false,
        isTabTable: false,
        hasDetailsExpander: false,
        hasTimePeriodDropDown: false,
        hasTypeDropDown: false,
      },
    },
    {
      componentLocator: ChartPage.heatMapComponent,
      componentProps: {
        hasConfidenceIntervals: false,
        isTabTable: false,
        hasDetailsExpander: false,
        hasTimePeriodDropDown: false,
        hasTypeDropDown: false,
      },
    },
  ];

  let visibleComponents: component[] = [];

  // 1 indicator, 1 area
  if (
    indicatorMode === IndicatorMode.ONE_INDICATOR &&
    areaMode === AreaMode.ONE_AREA
  ) {
    visibleComponents = allComponents.filter((component) =>
      [
        ChartPage.lineChartComponent,
        ChartPage.lineChartTableComponent,
        ChartPage.inequalitiesBarChartComponent,
        ChartPage.inequalitiesLineChartComponent,
        ChartPage.inequalitiesBarChartTableComponent,
        ChartPage.inequalitiesLineChartTableComponent,
        ChartPage.inequalitiesForSingleTimePeriodComponent,
        ChartPage.inequalitiesTrendComponent,
        ChartPage.populationPyramidComponent,
      ].includes(component.componentLocator)
    );
  }
  // 1 indicator, 2+ areas
  else if (
    indicatorMode === IndicatorMode.ONE_INDICATOR &&
    areaMode === AreaMode.THREE_PLUS_AREAS
  ) {
    visibleComponents = allComponents.filter((component) =>
      [
        ChartPage.lineChartComponent,
        ChartPage.lineChartTableComponent,
        ChartPage.barChartEmbeddedTableComponent,
        ChartPage.populationPyramidComponent,
      ].includes(component.componentLocator)
    );
  }
  // 1 indicator, all areas in a group
  else if (
    indicatorMode === IndicatorMode.ONE_INDICATOR &&
    areaMode === AreaMode.ALL_AREAS_IN_A_GROUP
  ) {
    visibleComponents = allComponents.filter((component) =>
      [
        ChartPage.thematicMapComponent,
        ChartPage.barChartEmbeddedTableComponent,
        ChartPage.populationPyramidComponent,
      ].includes(component.componentLocator)
    );
  }
  // 2 indicators, England area
  else if (
    indicatorMode === IndicatorMode.TWO_INDICATORS &&
    areaMode === AreaMode.ENGLAND_AREA
  ) {
    visibleComponents = allComponents.filter((component) =>
      [
        ChartPage.OneAreaMultipleIndicatorsTableComponent,
        ChartPage.populationPyramidComponent,
      ].includes(component.componentLocator)
    );
  }
  // 2 indicators, 2+ areas (not England)
  else if (
    indicatorMode === IndicatorMode.TWO_INDICATORS &&
    areaMode === AreaMode.THREE_PLUS_AREAS
  ) {
    visibleComponents = allComponents.filter((component) =>
      [
        ChartPage.spineChartTableComponent,
        ChartPage.heatMapComponent,
        ChartPage.populationPyramidComponent,
      ].includes(component.componentLocator)
    );
  }
  // > 2 indicators, 2 areas (not England)
  else if (
    indicatorMode === IndicatorMode.THREE_PLUS_INDICATORS &&
    areaMode === AreaMode.TWO_AREAS
  ) {
    visibleComponents = allComponents.filter((component) =>
      [
        ChartPage.spineChartTableComponent,
        ChartPage.heatMapComponent,
        ChartPage.populationPyramidComponent,
      ].includes(component.componentLocator)
    );
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
  indicators: RawIndicatorDocument[],
  searchTerm: string
): RawIndicatorDocument[] {
  if (!searchTerm) return [];

  const normalizedSearchTerm = searchTerm.toLowerCase();
  return indicators.filter((indicator) => {
    return (
      indicator.usedInPoc === true &&
      (indicator.indicatorName.toLowerCase().includes(normalizedSearchTerm) ||
        indicator.indicatorDefinition
          .toLowerCase()
          .includes(normalizedSearchTerm))
    );
  });
}

export function getAllIndicatorIdsForSearchTerm(
  indicators: RawIndicatorDocument[],
  searchTerm: string
): string[] {
  return filterIndicatorsByName(indicators, searchTerm).map(
    (indicator) => indicator.indicatorID
  );
}

export function getAllAreasByAreaType(
  areas: AreaDocument[],
  areaType: AreaTypeKeys
): AreaDocument[] {
  const sanitisedAreaType = areaType.toLowerCase().replaceAll('-', ' ');
  console.log(sanitisedAreaType);
  return areas.filter((area) =>
    area.areaType.toLowerCase().includes(sanitisedAreaType)
  );
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
    case IndicatorMode.THREE_PLUS_INDICATORS:
      return [indicators[0], indicators[1], indicators[2]];
    default:
      throw new Error('Invalid indicator mode');
  }
}

export function sortAlphabetically(array: (string | null)[]) {
  array.sort((a, b) => a!.localeCompare(b!));
}

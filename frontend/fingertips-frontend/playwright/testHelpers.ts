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
        hasConfidenceIntervals: false,
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

  const scenarioKey = `${indicatorMode}-${areaMode}`;

  const visibleComponentMap: Record<string, string[]> = {
    [`${IndicatorMode.ONE_INDICATOR}-${AreaMode.ONE_AREA}`]: [
      ChartPage.lineChartComponent,
      ChartPage.lineChartTableComponent,
      ChartPage.inequalitiesBarChartComponent,
      ChartPage.inequalitiesLineChartComponent,
      ChartPage.inequalitiesBarChartTableComponent,
      ChartPage.inequalitiesLineChartTableComponent,
      ChartPage.inequalitiesForSingleTimePeriodComponent,
      ChartPage.inequalitiesTrendComponent,
      ChartPage.populationPyramidComponent,
    ],
    [`${IndicatorMode.ONE_INDICATOR}-${AreaMode.ENGLAND_AREA}`]: [
      ChartPage.lineChartComponent,
      ChartPage.lineChartTableComponent,
      ChartPage.inequalitiesLineChartComponent,
      ChartPage.inequalitiesBarChartComponent,
      ChartPage.inequalitiesLineChartTableComponent,
      ChartPage.inequalitiesBarChartTableComponent,
      ChartPage.inequalitiesForSingleTimePeriodComponent,
      ChartPage.inequalitiesTrendComponent,
      ChartPage.populationPyramidComponent,
    ],
    [`${IndicatorMode.ONE_INDICATOR}-${AreaMode.THREE_PLUS_AREAS}`]: [
      ChartPage.barChartEmbeddedTableComponent,
      ChartPage.populationPyramidComponent,
    ],
    [`${IndicatorMode.ONE_INDICATOR}-${AreaMode.ALL_AREAS_IN_A_GROUP}`]: [
      ChartPage.thematicMapComponent,
      ChartPage.barChartEmbeddedTableComponent,
      ChartPage.populationPyramidComponent,
    ],
    [`${IndicatorMode.TWO_INDICATORS}-${AreaMode.ENGLAND_AREA}`]: [
      ChartPage.OneAreaMultipleIndicatorsTableComponent,
      ChartPage.populationPyramidComponent,
    ],
    [`${IndicatorMode.TWO_INDICATORS}-${AreaMode.THREE_PLUS_AREAS}`]: [
      ChartPage.spineChartTableComponent,
      ChartPage.heatMapComponent,
      ChartPage.populationPyramidComponent,
    ],
    [`${IndicatorMode.TWO_INDICATORS}-${AreaMode.ALL_AREAS_IN_A_GROUP}`]: [
      ChartPage.heatMapComponent,
      ChartPage.populationPyramidComponent,
    ],
    [`${IndicatorMode.THREE_PLUS_INDICATORS}-${AreaMode.TWO_AREAS}`]: [
      ChartPage.spineChartTableComponent,
      ChartPage.heatMapComponent,
      ChartPage.populationPyramidComponent,
    ],
  };

  const visibleLocators = visibleComponentMap[scenarioKey];

  if (!visibleLocators) {
    throw new Error(
      `Combination of indicator mode: ${indicatorMode} + area mode: ${areaMode} is not supported.`
    );
  }

  const visibleComponents = allComponents.filter((component) =>
    visibleLocators.includes(component.componentLocator)
  );

  const hiddenComponents = allComponents.filter(
    (component) => !visibleLocators.includes(component.componentLocator)
  );

  return { visibleComponents, hiddenComponents };
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

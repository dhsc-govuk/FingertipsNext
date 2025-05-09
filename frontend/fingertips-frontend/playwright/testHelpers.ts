import { AreaDocument, RawIndicatorDocument } from '@/lib/search/searchTypes';
import ChartPage from './page-objects/pages/chartPage';
import { AreaTypeKeys } from '@/lib/areaFilterHelpers/areaType';

export type SimpleIndicatorDocument = {
  indicatorID: string;
  indicatorName: string;
  associatedAreaCodes: string[];
  dataSource: string;
  knownTrend?: string;
};

export interface IndicatorInfo {
  indicatorID: string;
  knownTrend?: string;
}
export interface TestParams {
  indicatorMode: IndicatorMode;
  areaMode: AreaMode;
  searchMode: SearchMode;
  indicatorsToSelect: IndicatorInfo[];
  subjectSearchTerm?: string;
}

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

// Tags to mark when certain tests should be run
export enum TestTag {
  CI = '@ci',
  CD = '@cd',
}

type componentProps = {
  hasConfidenceIntervals?: boolean;
  isTabTable?: boolean;
  hasDetailsExpander?: boolean;
  hasTimePeriodDropDown?: boolean;
  hasTypeDropDown?: boolean;
  isWideComponent?: boolean;
  hasRecentTrend?: boolean;
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
      },
    },
    {
      componentLocator: ChartPage.lineChartTableComponent,
      componentProps: {
        isTabTable: true,
        hasRecentTrend: true,
      },
    },
    {
      componentLocator: ChartPage.inequalitiesBarChartComponent,
      componentProps: {
        hasConfidenceIntervals: true,
      },
    },
    {
      componentLocator: ChartPage.inequalitiesForSingleTimePeriodComponent,
      componentProps: {
        hasConfidenceIntervals: true,
        hasTimePeriodDropDown: true,
        hasTypeDropDown: false, // even though it has a type dropdown, we want to test the default view
      },
    },
    {
      componentLocator: ChartPage.inequalitiesTrendComponent,
      componentProps: {
        hasConfidenceIntervals: true,
        hasTypeDropDown: true, // and in this case we want to test the type dropdown
      },
    },
    {
      componentLocator: ChartPage.inequalitiesLineChartComponent,
      componentProps: {
        hasConfidenceIntervals: true,
      },
    },
    {
      componentLocator: ChartPage.inequalitiesBarChartTableComponent,
      componentProps: {
        isTabTable: true,
      },
    },
    {
      componentLocator: ChartPage.inequalitiesLineChartTableComponent,
      componentProps: {
        isTabTable: true,
      },
    },
    {
      componentLocator: ChartPage.populationPyramidComponent,
      componentProps: {
        hasDetailsExpander: true,
      },
    },
    {
      componentLocator: ChartPage.thematicMapComponent,
      componentProps: {},
    },
    {
      componentLocator: ChartPage.barChartEmbeddedTableComponent,
      componentProps: {
        hasConfidenceIntervals: true,
        hasRecentTrend: true,
      },
    },
    {
      componentLocator: ChartPage.basicTableComponent,
      componentProps: { hasRecentTrend: true },
    },
    {
      componentLocator: ChartPage.heatMapComponent,
      componentProps: {
        isWideComponent: true,
      },
    },
    {
      componentLocator: ChartPage.spineChartTableComponent,
      componentProps: {
        isWideComponent: true,
        hasRecentTrend: true,
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
      ChartPage.basicTableComponent,
      ChartPage.populationPyramidComponent,
    ],
    [`${IndicatorMode.TWO_INDICATORS}-${AreaMode.THREE_PLUS_AREAS}`]: [
      ChartPage.heatMapComponent,
      ChartPage.populationPyramidComponent,
    ],
    [`${IndicatorMode.TWO_INDICATORS}-${AreaMode.ALL_AREAS_IN_A_GROUP}`]: [
      ChartPage.heatMapComponent,
      ChartPage.populationPyramidComponent,
    ],
    [`${IndicatorMode.THREE_PLUS_INDICATORS}-${AreaMode.ONE_AREA}`]: [
      ChartPage.populationPyramidComponent,
      ChartPage.spineChartTableComponent,
    ],
    [`${IndicatorMode.THREE_PLUS_INDICATORS}-${AreaMode.TWO_AREAS}`]: [
      ChartPage.heatMapComponent,
      ChartPage.populationPyramidComponent,
      ChartPage.spineChartTableComponent,
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

const indicatorsUsedInPOC = (indicator: RawIndicatorDocument): boolean =>
  indicator.usedInPoc === true;

const indicatorsMatchingSearchTerm = (
  indicator: RawIndicatorDocument,
  normalizedSearchTerm: string
): boolean =>
  indicator.indicatorName.toLowerCase().includes(normalizedSearchTerm) ||
  indicator.indicatorDefinition.toLowerCase().includes(normalizedSearchTerm);

const indicatorMatchingIndicatorID = (
  indicator: RawIndicatorDocument,
  indicatorID: string
): boolean => {
  // First convert to string
  const indicatorIDString = String(indicator.indicatorID);

  return indicatorIDString.toLowerCase() === indicatorID.toLowerCase();
};

export function getAllIndicators(
  indicators: RawIndicatorDocument[]
): SimpleIndicatorDocument[] {
  return indicators
    .filter((indicator) => indicatorsUsedInPOC(indicator))
    .map((indicator) => ({
      indicatorName: indicator.indicatorName,
      indicatorID: indicator.indicatorID,
      associatedAreaCodes: indicator.associatedAreaCodes,
      dataSource: indicator.dataSource,
    }));
}

export function getAllIndicatorIDsForSearchTerm(
  indicators: RawIndicatorDocument[],
  searchTerm: string
): string[] {
  if (!searchTerm) return [];

  const lowerCasedSearchTerm = searchTerm.toLowerCase();
  return indicators
    .filter(
      (indicator) =>
        indicatorsUsedInPOC(indicator) &&
        indicatorsMatchingSearchTerm(indicator, lowerCasedSearchTerm)
    )
    .map((indicator) => indicator.indicatorID);
}

export function getAllIndicatorsForSearchTerm(
  indicators: RawIndicatorDocument[],
  searchTerm: string
): SimpleIndicatorDocument[] {
  if (!searchTerm) return [];

  const lowerCasedSearchTerm = searchTerm.toLowerCase();
  return indicators
    .filter(
      (indicator) =>
        indicatorsUsedInPOC(indicator) &&
        indicatorsMatchingSearchTerm(indicator, lowerCasedSearchTerm)
    )
    .map((indicator) => ({
      indicatorName: indicator.indicatorName,
      indicatorID: indicator.indicatorID,
      associatedAreaCodes: indicator.associatedAreaCodes,
      dataSource: indicator.dataSource,
    }));
}

export function getIndicatorDataByIndicatorID(
  indicators: RawIndicatorDocument[],
  indicatorID: string
): SimpleIndicatorDocument[] {
  if (!indicatorID) return [];

  return indicators
    .filter((indicator) => indicatorMatchingIndicatorID(indicator, indicatorID))
    .map((indicator) => ({
      indicatorName: indicator.indicatorName,
      indicatorID: indicator.indicatorID,
      associatedAreaCodes: indicator.associatedAreaCodes,
      dataSource: indicator.dataSource,
    }));
}

export function getAllAreasByAreaType(
  areas: AreaDocument[],
  areaType: AreaTypeKeys
): AreaDocument[] {
  const sanitisedAreaType = areaType.toLowerCase().replaceAll('-', ' ');

  return areas.filter((area) =>
    area.areaType.toLowerCase().includes(sanitisedAreaType)
  );
}

export function returnIndicatorIDsByIndicatorMode(
  indicators: string[],
  indicatorMode: IndicatorMode
): IndicatorInfo[] {
  switch (indicatorMode) {
    case IndicatorMode.ONE_INDICATOR:
      return [{ indicatorID: indicators[0] }];
    case IndicatorMode.TWO_INDICATORS:
      return [{ indicatorID: indicators[0] }, { indicatorID: indicators[1] }];
    case IndicatorMode.THREE_PLUS_INDICATORS:
      return [
        { indicatorID: indicators[0] },
        { indicatorID: indicators[1] },
        { indicatorID: indicators[2] },
      ];
    default:
      throw new Error('Invalid indicator mode');
  }
}

export function sortAlphabetically(array: (string | null)[]) {
  array.sort((a, b) => a!.localeCompare(b!));
}

export const checkTrendsOnResultsPage = (): boolean => {
  const checkTrends =
    process.env.CHECK_RESULTS_TRENDS !== 'false' ? false : true;
  return checkTrends;
};

// This function gets the selected indicators indicator data and merges its knownTrend into one object
export function mergeIndicatorData(
  selectedIndicators: IndicatorInfo[],
  typedIndicatorData: RawIndicatorDocument[]
): SimpleIndicatorDocument[] {
  let selectedIndicatorsData: SimpleIndicatorDocument[] = [];

  for (const selectedIndicator of selectedIndicators) {
    const indicatorDataArray = getIndicatorDataByIndicatorID(
      typedIndicatorData,
      selectedIndicator.indicatorID
    );

    // Add the knownTrend to all returned selected indicators
    const enhancedIndicatorData = indicatorDataArray.map((indicator) => ({
      ...indicator,
      knownTrend: selectedIndicator.knownTrend,
    }));

    selectedIndicatorsData = [
      ...selectedIndicatorsData,
      ...enhancedIndicatorData,
    ];
  }

  return selectedIndicatorsData;
}

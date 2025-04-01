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
  ALL_AREAS_IN_A_GROUP = 'ALL_AREAS_IN_A_GROUP',
  ENGLAND_AREA = 'ENGLAND_AREA',
}

type componentProps = {
  hasConfidenceIntervals: boolean;
  isTabTable: boolean;
  hasDetailsExpander: boolean;
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
      },
    },
    {
      componentLocator: ChartPage.lineChartTableComponent,
      componentProps: {
        hasConfidenceIntervals: false,
        isTabTable: true,
        hasDetailsExpander: false,
      },
    },
    {
      componentLocator: ChartPage.inequalitiesComponent,
      componentProps: {
        hasConfidenceIntervals: false,
        isTabTable: false,
        hasDetailsExpander: false,
      },
    },
    {
      componentLocator: ChartPage.inequalitiesBarChartComponent,
      componentProps: {
        hasConfidenceIntervals: true,
        isTabTable: false,
        hasDetailsExpander: false,
      },
    },
    {
      componentLocator: ChartPage.inequalitiesLineChartComponent,
      componentProps: {
        hasConfidenceIntervals: true,
        isTabTable: false,
        hasDetailsExpander: false,
      },
    },
    {
      componentLocator: ChartPage.inequalitiesBarChartTableComponent,
      componentProps: {
        hasConfidenceIntervals: false,
        isTabTable: true,
        hasDetailsExpander: false,
      },
    },
    {
      componentLocator: ChartPage.inequalitiesLineChartTableComponent,
      componentProps: {
        hasConfidenceIntervals: false,
        isTabTable: true,
        hasDetailsExpander: false,
      },
    },
    {
      componentLocator: ChartPage.populationPyramidComponent,
      componentProps: {
        hasConfidenceIntervals: false,
        isTabTable: false,
        hasDetailsExpander: true,
      },
    },
    {
      componentLocator: ChartPage.thematicMapComponent,
      componentProps: {
        hasConfidenceIntervals: false,
        isTabTable: false,
        hasDetailsExpander: false,
      },
    },
    {
      componentLocator: ChartPage.barChartEmbeddedTableComponent,
      componentProps: {
        hasConfidenceIntervals: true,
        isTabTable: false,
        hasDetailsExpander: false,
      },
    },
    {
      componentLocator: ChartPage.spineChartTableComponent,
      componentProps: {
        hasConfidenceIntervals: false,
        isTabTable: false,
        hasDetailsExpander: false,
      },
    },
    // Enable in DHSCFT-237
    // ChartPage.basicTableComponent,
    // Enable in DHSCFT-230
    // ChartPage.heatMapComponent,
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
        ChartPage.inequalitiesComponent,
        ChartPage.inequalitiesBarChartComponent,
        ChartPage.inequalitiesLineChartComponent,
        ChartPage.inequalitiesBarChartTableComponent,
        ChartPage.inequalitiesLineChartTableComponent,
        ChartPage.populationPyramidComponent,
      ].includes(component.componentLocator)
    );
  }
  // 1 indicator, 2+ areas
  else if (
    indicatorMode === IndicatorMode.ONE_INDICATOR &&
    areaMode === AreaMode.TWO_PLUS_AREAS
  ) {
    visibleComponents = allComponents.filter((component) =>
      [
        ChartPage.lineChartComponent,
        ChartPage.lineChartTableComponent,
        ChartPage.barChartEmbeddedTableComponent,
        // Enable in DHSCFT-225
        // ChartPage.populationPyramidComponent,
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
        // Enable in DHSCFT-225
        // ChartPage.populationPyramidComponent,
      ].includes(component.componentLocator)
    );
  }
  // 2+ indicators, England area
  else if (
    indicatorMode === IndicatorMode.TWO_PLUS_INDICATORS &&
    areaMode === AreaMode.ENGLAND_AREA
  ) {
    // visibleComponents = allComponents.filter((component) =>
    //   [
    //     // Enable in DHSCFT-237
    //     // ChartPage.basicTableComponent,
    //     // Enable in DHSCFT-225
    //     // ChartPage.populationPyramidComponent,
    //   ].includes(component.componentLocator)
    // );
  }
  // 2+ indicators, 2+ areas (not England)
  else if (
    indicatorMode === IndicatorMode.TWO_PLUS_INDICATORS &&
    areaMode === AreaMode.TWO_PLUS_AREAS
  ) {
    visibleComponents = allComponents.filter((component) =>
      [
        ChartPage.spineChartTableComponent,
        ChartPage.heatMapComponent,
        // Enable in DHSCFT-225
        // ChartPage.populationPyramidComponent,
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
  indicators: IndicatorDocument[],
  searchTerm: string
): IndicatorDocument[] {
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

export function getIndicatorNameById(
  indicatorId: string,
  indicators: IndicatorDocument[]
): string | undefined {
  const indicator = indicators.find((ind) => ind.indicatorID === indicatorId);
  return indicator ? indicator.indicatorName : undefined;
}

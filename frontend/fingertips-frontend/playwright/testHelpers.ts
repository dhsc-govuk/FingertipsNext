import {
  AreaDocument,
  IndicatorDocument,
  RawIndicatorDocument,
} from '@/lib/search/searchTypes';
import ChartPage from './page-objects/pages/chartPage';
import { AreaTypeKeys } from '@/lib/areaFilterHelpers/areaType';
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

type componentProps = {
  hasConfidenceIntervals: boolean;
  isTabTable: boolean;
  hasDetailsExpander: boolean;
  hasTimePeriodDropDown: boolean;
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
      },
    },
    {
      componentLocator: ChartPage.lineChartTableComponent,
      componentProps: {
        hasConfidenceIntervals: false,
        isTabTable: true,
        hasDetailsExpander: false,
        hasTimePeriodDropDown: false,
      },
    },
    {
      componentLocator: ChartPage.inequalitiesComponent,
      componentProps: {
        hasConfidenceIntervals: false,
        isTabTable: false,
        hasDetailsExpander: false,
        hasTimePeriodDropDown: false,
      },
    },
    {
      componentLocator: ChartPage.inequalitiesBarChartComponent,
      componentProps: {
        hasConfidenceIntervals: true,
        isTabTable: false,
        hasDetailsExpander: false,
        hasTimePeriodDropDown: false,
      },
    },
    {
      componentLocator: ChartPage.inequalitiesForSingleTimePeriodComponent,
      componentProps: {
        hasConfidenceIntervals: false,
        isTabTable: false,
        hasTimePeriodDropDown: true,
        hasDetailsExpander: false,
      },
    },
    {
      componentLocator: ChartPage.inequalitiesLineChartComponent,
      componentProps: {
        hasConfidenceIntervals: true,
        isTabTable: false,
        hasDetailsExpander: false,
        hasTimePeriodDropDown: false,
      },
    },
    {
      componentLocator: ChartPage.inequalitiesBarChartTableComponent,
      componentProps: {
        hasConfidenceIntervals: false,
        isTabTable: true,
        hasDetailsExpander: false,
        hasTimePeriodDropDown: false,
      },
    },
    {
      componentLocator: ChartPage.inequalitiesLineChartTableComponent,
      componentProps: {
        hasConfidenceIntervals: false,
        isTabTable: true,
        hasDetailsExpander: false,
        hasTimePeriodDropDown: false,
      },
    },
    {
      componentLocator: ChartPage.populationPyramidComponent,
      componentProps: {
        hasConfidenceIntervals: false,
        isTabTable: false,
        hasDetailsExpander: true,
        hasTimePeriodDropDown: false,
      },
    },
    {
      componentLocator: ChartPage.thematicMapComponent,
      componentProps: {
        hasConfidenceIntervals: false,
        isTabTable: false,
        hasDetailsExpander: false,
        hasTimePeriodDropDown: false,
      },
    },
    {
      componentLocator: ChartPage.barChartEmbeddedTableComponent,
      componentProps: {
        hasConfidenceIntervals: true,
        isTabTable: false,
        hasDetailsExpander: false,
        hasTimePeriodDropDown: false,
      },
    },
    {
      componentLocator: ChartPage.spineChartTableComponent,
      componentProps: {
        hasConfidenceIntervals: false,
        isTabTable: false,
        hasDetailsExpander: false,
        hasTimePeriodDropDown: false,
      },
    },
    // Enable in DHSCFT-237
    // ChartPage.basicTableComponent,
    {
      componentLocator: ChartPage.heatMapComponent,
      componentProps: {
        hasConfidenceIntervals: false,
        isTabTable: false,
        hasDetailsExpander: false,
        hasTimePeriodDropDown: false,
      },
    },
  ];

  let visibleComponents: component[] = [];

  // 1 indicator, 1 area or England area
  if (
    (indicatorMode === IndicatorMode.ONE_INDICATOR &&
      areaMode === AreaMode.ONE_AREA) ||
    (indicatorMode === IndicatorMode.ONE_INDICATOR &&
      areaMode === AreaMode.ENGLAND_AREA)
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
        ChartPage.inequalitiesForSingleTimePeriodComponent,
        ChartPage.populationPyramidComponent,
      ].includes(component.componentLocator)
    );
  }
  // 1 indicator, 2 areas
  else if (
    indicatorMode === IndicatorMode.ONE_INDICATOR &&
    areaMode === AreaMode.TWO_AREAS
  ) {
    visibleComponents = allComponents.filter((component) =>
      [
        // Enable in DHSCFT-148
        // ChartPage.populationPyramidComponent,
        ChartPage.lineChartComponent,
        ChartPage.lineChartTableComponent,
        ChartPage.barChartEmbeddedTableComponent,
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

export function getAllPOCIndicators(
  indicators: IndicatorDocument[]
): SimpleIndicatorDocument[] {
  return filterIndicatorsOnlyPOC(indicators).map((indicator) => ({
    indicatorName: indicator.indicatorName,
    indicatorID: indicator.indicatorID,
    associatedAreaCodes: indicator.associatedAreaCodes,
  }));
}

export async function checkIfIndicatorAndAreaHasHealthData(
  indicatorID: string,
  areaCode: string
): Promise<boolean> {
  const url = `http://localhost:5144/indicators/${indicatorID}/data?area_codes=${areaCode}`;
  const options = { method: 'GET' };
  try {
    const response = await fetch(url, options);
    const data = await response.json();
    if (JSON.stringify(data).includes('"areaHealthData":[]')) {
      return false;
    }
    return true;
  } catch (error) {
    console.error(error);
    return false;
  }
}

function filterIndicatorsOnlyPOC(
  indicators: IndicatorDocument[]
): SimpleIndicatorDocument[] {
  return indicators.filter(
    (indicator) =>
      indicator.usedInPoc === true &&
      // DHSCFT-382 will add the data type dropdown for the line chart. DHSCFT-224 will do it for the bar.
      // another ticket for area
      // finding out off andy which dont have sex inequality data
      // One indicator + England area:
      !indicator.indicatorName.includes(
        'Dementia prevelence (Quality and Outcomes Framework)'
      ) &&
      !indicator.indicatorName.includes(
        'Conception rate in females aged 17 years and under'
      ) &&
      !indicator.indicatorName.includes(
        'Preventable sight loss from diabetic eye disease'
      ) &&
      !indicator.indicatorName.includes(
        'Diabetes prevelence aged 17 years and over (Quality and Outcomes Framework)'
      ) &&
      !indicator.indicatorName.includes(
        'NHS Health Checks offered to the total eligible population in the quarter'
      ) &&
      !indicator.indicatorName.includes('Urgent suspected cancer referrals') &&
      !indicator.indicatorName.includes(
        'Deaths in hospital for people with dementia aged 65 years and over'
      ) &&
      !indicator.indicatorName.includes('General fertility rate in females') &&
      !indicator.indicatorName.includes(
        'Smokers at time of childbirth delivery'
      ) &&
      !indicator.indicatorName.includes('Acute hepatitis B incidence rate') &&
      !indicator.indicatorName.includes('Deaths in hospital') &&
      !indicator.indicatorName.includes(
        'Children in absolute low income families aged 15 years and under'
      ) &&
      !indicator.indicatorName.includes(
        'Smoking attributable mortality (new method)'
      ) &&
      !indicator.indicatorName.includes(
        'Particulate air pollution attributable mortality (new method)'
      ) &&
      !indicator.indicatorName.includes(
        'Hospital admissions for cataract surgery aged 65 years and over'
      ) &&
      !indicator.indicatorName.includes(
        'Breast screening coverage aged 53 to 70 years'
      )
    // OLD LOT
    // filters needed for one indicator (in loop) + all but one areas in group + only subject - log a bug for filtering by all regions - ticket 1
    // !indicator.indicatorName.includes(
    //   `People reporting Alzheimer's disease or dementia`
    // ) &&
    // !indicator.indicatorName.includes(
    //   `People with caring responsibility aged 16 years and over`
    // )
    // filters needed for one indicator (in loop) + ( all areas in a group || ENGLAND ) + only subject - log a bug for these 4 data issues - ticket 2
    // !indicator.indicatorName.includes(
    //   'Hepatitis B vaccination coverage aged 2 years'
    // ) &&
    // !indicator.indicatorName.includes(
    //   'Obesity prevalence (including severe obesity) in Year 6 children aged 10 to 11 years'
    // ) &&
    // !indicator.indicatorName.includes(
    //   'Physically inactive in adults aged 19 years and over'
    // ) &&
    // !indicator.indicatorName.includes(
    //   'Overweight prevalence (including obesity) in adults aged 18 years and over'
    // )
  );
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
    case IndicatorMode.TWO_PLUS_INDICATORS:
      return [indicators[0], indicators[1]];
    default:
      throw new Error('Invalid indicator mode');
  }
}

export function sortAlphabetically(array: (string | null)[]) {
  array.sort((a, b) => a!.localeCompare(b!));
}

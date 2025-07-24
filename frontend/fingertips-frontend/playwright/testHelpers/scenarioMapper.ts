import { AreaMode, IndicatorMode } from './genericTestUtilities';
import ChartPage from '../page-objects/pages/chartPage';
import { allComponents } from './chartComponentRegistry';
import { ChartComponentDefinition } from './testDefinitions';

type ScenarioConfig = {
  visibleComponents: ChartComponentDefinition[];
  hiddenComponents: ChartComponentDefinition[];
};

// as defined in https://ukhsa.atlassian.net/wiki/spaces/FTN/pages/171448117/Area+Indicator+journeys
const visibleComponentMap: Record<string, string[]> = {
  [`${IndicatorMode.ONE_INDICATOR}-${AreaMode.ONE_AREA}`]: [
    ChartPage.spineChartTableComponent,
    ChartPage.lineChartComponent,
    ChartPage.lineChartTableComponent,
    ChartPage.inequalitiesBarChartComponent,
    ChartPage.inequalitiesLineChartComponent,
    ChartPage.inequalitiesBarChartTableComponent,
    ChartPage.inequalitiesLineChartTableComponent,
    ChartPage.inequalitiesForSingleTimePeriodComponent,
    ChartPage.inequalitiesTrendComponent,
    ChartPage.populationPyramidChartComponent,
    ChartPage.populationPyramidTableComponent,
  ],
  [`${IndicatorMode.ONE_INDICATOR}-${AreaMode.TWO_AREAS}`]: [
    // ChartPage.spineChartTableComponent, // test will fail due to issue with indicator 383
    ChartPage.lineChartComponent,
    ChartPage.lineChartTableComponent,
    ChartPage.barChartEmbeddedTableComponent,
    ChartPage.populationPyramidChartComponent,
    ChartPage.populationPyramidTableComponent,
  ],
  [`${IndicatorMode.ONE_INDICATOR}-${AreaMode.THREE_PLUS_AREAS}`]: [
    ChartPage.barChartEmbeddedTableComponent,
    ChartPage.populationPyramidChartComponent,
    ChartPage.populationPyramidTableComponent,
    ChartPage.heatMapComponent,
  ],
  [`${IndicatorMode.ONE_INDICATOR}-${AreaMode.ALL_AREAS_IN_A_GROUP}`]: [
    ChartPage.thematicMapComponent,
    ChartPage.barChartEmbeddedTableComponent,
    ChartPage.populationPyramidChartComponent,
    ChartPage.populationPyramidTableComponent,
    ChartPage.heatMapComponent,
  ],
  [`${IndicatorMode.ONE_INDICATOR}-${AreaMode.ENGLAND_AREA}`]: [
    ChartPage.basicTableComponent,
    ChartPage.lineChartComponent,
    ChartPage.lineChartTableComponent,
    ChartPage.inequalitiesLineChartComponent,
    ChartPage.inequalitiesBarChartComponent,
    ChartPage.inequalitiesLineChartTableComponent,
    ChartPage.inequalitiesBarChartTableComponent,
    ChartPage.inequalitiesForSingleTimePeriodComponent,
    ChartPage.inequalitiesTrendComponent,
    ChartPage.populationPyramidChartComponent,
    ChartPage.populationPyramidTableComponent,
  ],
  [`${IndicatorMode.TWO_INDICATORS}-${AreaMode.ONE_AREA}`]: [
    ChartPage.spineChartTableComponent,
    ChartPage.populationPyramidChartComponent,
    ChartPage.populationPyramidTableComponent,
  ],
  [`${IndicatorMode.TWO_INDICATORS}-${AreaMode.TWO_AREAS}`]: [
    ChartPage.spineChartTableComponent,
    ChartPage.populationPyramidChartComponent,
    ChartPage.populationPyramidTableComponent,
  ],
  [`${IndicatorMode.TWO_INDICATORS}-${AreaMode.THREE_PLUS_AREAS}`]: [
    ChartPage.heatMapComponent,
    ChartPage.populationPyramidChartComponent,
    ChartPage.populationPyramidTableComponent,
  ],
  [`${IndicatorMode.TWO_INDICATORS}-${AreaMode.ALL_AREAS_IN_A_GROUP}`]: [
    ChartPage.heatMapComponent,
    ChartPage.populationPyramidChartComponent,
    ChartPage.populationPyramidTableComponent,
  ],
  [`${IndicatorMode.TWO_INDICATORS}-${AreaMode.ENGLAND_AREA}`]: [
    ChartPage.basicTableComponent,
    ChartPage.populationPyramidChartComponent,
    ChartPage.populationPyramidTableComponent,
  ],
  [`${IndicatorMode.THREE_PLUS_INDICATORS}-${AreaMode.ONE_AREA}`]: [
    ChartPage.spineChartTableComponent,
    ChartPage.populationPyramidChartComponent,
    ChartPage.populationPyramidTableComponent,
  ],
  [`${IndicatorMode.THREE_PLUS_INDICATORS}-${AreaMode.TWO_AREAS}`]: [
    ChartPage.spineChartTableComponent,
    ChartPage.spineChartTableComponent,
    ChartPage.populationPyramidChartComponent,
    ChartPage.populationPyramidTableComponent,
  ],
  [`${IndicatorMode.THREE_PLUS_INDICATORS}-${AreaMode.THREE_PLUS_AREAS}`]: [
    ChartPage.heatMapComponent,
    ChartPage.populationPyramidChartComponent,
    ChartPage.populationPyramidTableComponent,
  ],
  [`${IndicatorMode.THREE_PLUS_INDICATORS}-${AreaMode.ALL_AREAS_IN_A_GROUP}`]: [
    ChartPage.heatMapComponent,
    ChartPage.populationPyramidChartComponent,
    ChartPage.populationPyramidTableComponent,
  ],
  [`${IndicatorMode.THREE_PLUS_INDICATORS}-${AreaMode.ENGLAND_AREA}`]: [
    ChartPage.basicTableComponent,
    ChartPage.populationPyramidChartComponent,
    ChartPage.populationPyramidTableComponent,
  ],
};

export function getScenarioConfig(
  indicatorMode: IndicatorMode,
  areaMode: AreaMode
): ScenarioConfig {
  const scenarioKey = `${indicatorMode}-${areaMode}`;

  const visibleLocators = visibleComponentMap[scenarioKey];
  if (!visibleLocators) {
    throw new Error(`Unsupported combination: ${scenarioKey}`);
  }

  const visibleComponents = allComponents.filter((component) =>
    visibleLocators.includes(component.chartComponentLocator)
  );
  const hiddenComponents = allComponents.filter(
    (component) => !visibleLocators.includes(component.chartComponentLocator)
  );

  return { visibleComponents, hiddenComponents };
}

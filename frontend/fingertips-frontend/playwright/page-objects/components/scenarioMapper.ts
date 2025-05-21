import { IndicatorMode, AreaMode } from '../../testHelpers';
import ChartPage from '../pages/chartPage';
import { allComponents } from './componentRegistry';
import { ComponentDefinition } from './componentTypes';

type ScenarioKey = `${IndicatorMode}-${AreaMode}`;
type ScenarioConfig = {
  visibleComponents: ComponentDefinition[];
  hiddenComponents: ComponentDefinition[];
};

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
    ChartPage.populationPyramidTableComponent,
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
    ChartPage.populationPyramidTableComponent,
  ],
  [`${IndicatorMode.ONE_INDICATOR}-${AreaMode.THREE_PLUS_AREAS}`]: [
    ChartPage.barChartEmbeddedTableComponent,
    ChartPage.populationPyramidComponent,
    ChartPage.populationPyramidTableComponent,
  ],
  [`${IndicatorMode.ONE_INDICATOR}-${AreaMode.ALL_AREAS_IN_A_GROUP}`]: [
    ChartPage.thematicMapComponent,
    ChartPage.barChartEmbeddedTableComponent,
    ChartPage.populationPyramidComponent,
    ChartPage.populationPyramidTableComponent,
  ],
  [`${IndicatorMode.TWO_INDICATORS}-${AreaMode.ENGLAND_AREA}`]: [
    ChartPage.basicTableComponent,
    ChartPage.populationPyramidComponent,
    ChartPage.populationPyramidTableComponent,
  ],
  [`${IndicatorMode.TWO_INDICATORS}-${AreaMode.THREE_PLUS_AREAS}`]: [
    ChartPage.heatMapComponent,
    ChartPage.populationPyramidComponent,
    ChartPage.populationPyramidTableComponent,
  ],
  [`${IndicatorMode.TWO_INDICATORS}-${AreaMode.ALL_AREAS_IN_A_GROUP}`]: [
    ChartPage.heatMapComponent,
    ChartPage.populationPyramidComponent,
    ChartPage.populationPyramidTableComponent,
  ],
  [`${IndicatorMode.THREE_PLUS_INDICATORS}-${AreaMode.ONE_AREA}`]: [
    ChartPage.spineChartTableComponent,
    ChartPage.populationPyramidComponent,
    ChartPage.populationPyramidTableComponent,
  ],
  [`${IndicatorMode.THREE_PLUS_INDICATORS}-${AreaMode.TWO_AREAS}`]: [
    ChartPage.heatMapComponent,
    ChartPage.spineChartTableComponent,
    ChartPage.populationPyramidComponent,
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

  const visibleComponents = allComponents.filter((c) =>
    visibleLocators.includes(c.componentLocator)
  );
  const hiddenComponents = allComponents.filter(
    (c) => !visibleLocators.includes(c.componentLocator)
  );

  return { visibleComponents, hiddenComponents };
}

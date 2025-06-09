import ChartPage from '../../page-objects/pages/chartPage';
import { ComponentDefinition } from './componentTypes';

export const allComponents: ComponentDefinition[] = [
  {
    componentLocator: ChartPage.lineChartComponent,
    componentProps: {
      showsBenchmarkComparisons: true,
      hasTooltipHovers: true,
      hasConfidenceIntervals: true,
    },
  },
  {
    componentLocator: ChartPage.lineChartTableComponent,
    componentProps: {
      isTabTable: true,
      hasRecentTrend: true,
      showsBenchmarkComparisons: true,
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
      hasTimePeriodDropDown: true,
      hasTypeDropDown: false, // even though it has a type dropdown, we want to test the default view
      hasConfidenceIntervals: true,
    },
  },
  {
    componentLocator: ChartPage.inequalitiesTrendComponent,
    componentProps: {
      hasTypeDropDown: true, // and in this case we want to test the type dropdown
      hasConfidenceIntervals: true,
    },
  },
  {
    componentLocator: ChartPage.inequalitiesLineChartComponent,
    componentProps: {
      hasConfidenceIntervals: true,
      hasTypeDropDown: true,
      isWideComponent: true,
      typeDropDownOptionToSelect: true,
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
    componentLocator: ChartPage.populationPyramidTableComponent,
    componentProps: {
      isTabTable: true,
    },
  },
  {
    componentLocator: ChartPage.thematicMapComponent,
    componentProps: {
      showsBenchmarkComparisons: true,
      hasTooltipHovers: true,
    },
  },
  {
    componentLocator: ChartPage.barChartEmbeddedTableComponent,
    componentProps: {
      hasRecentTrend: true,
      showsBenchmarkComparisons: true,
      hasTooltipHovers: true,
      hasConfidenceIntervals: true,
    },
  },
  {
    componentLocator: ChartPage.basicTableComponent,
    componentProps: {
      hasRecentTrend: true,
    },
  },
  {
    componentLocator: ChartPage.heatMapComponent,
    componentProps: {
      isWideComponent: true,
      showsBenchmarkComparisons: true,
      hasTooltipHovers: true,
    },
  },
  {
    componentLocator: ChartPage.spineChartTableComponent,
    componentProps: {
      isWideComponent: true,
      hasRecentTrend: true,
      showsBenchmarkComparisons: true,
      hasTooltipHovers: true,
    },
  },
];

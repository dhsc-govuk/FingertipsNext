import ChartPage from '../../page-objects/pages/chartPage';
import { ComponentDefinition } from './componentTypes';

export const allComponents: ComponentDefinition[] = [
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
      hasTypeDropDown: false,
    },
  },
  {
    componentLocator: ChartPage.inequalitiesTrendComponent,
    componentProps: {
      hasConfidenceIntervals: true,
      hasTypeDropDown: true,
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
    componentProps: {
      hasRecentTrend: true,
    },
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

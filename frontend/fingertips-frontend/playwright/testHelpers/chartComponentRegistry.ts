import ChartPage from '../page-objects/pages/chartPage';
import { ChartComponentDefinition } from './testDefinitions';

export const allComponents: ChartComponentDefinition[] = [
  {
    chartComponentLocator: ChartPage.lineChartComponent,
    chartComponentProps: {
      hasPNGExport: true,
      hasSVGExport: true,
      hasBenchmarkComparisons: true,
      hasTooltipHovers: true,
      hasConfidenceIntervals: true,
    },
  },
  {
    chartComponentLocator: ChartPage.lineChartTableComponent,
    chartComponentProps: {
      hasPNGExport: true,
      hasCSVExport: true,
      isTabTable: true,
      hasRecentTrend: true,
      hasBenchmarkComparisons: true,
    },
  },
  {
    chartComponentLocator: ChartPage.inequalitiesBarChartComponent,
    chartComponentProps: {
      hasPNGExport: true,
      hasSVGExport: true,
      hasConfidenceIntervals: true,
      hasDetailsExpander: true,
    },
  },
  {
    chartComponentLocator: ChartPage.inequalitiesForSingleTimePeriodComponent,
    chartComponentProps: {
      hasInequalitiesExpander: true,
      hasInequalitiesTimePeriodDropDown: true,
      hasInequalityTypeDropDown: true,
      hasConfidenceIntervals: true,
    },
  },
  {
    chartComponentLocator: ChartPage.inequalitiesTrendComponent,
    chartComponentProps: {
      hasInequalitiesExpander: true,
      hasInequalityTypeDropDown: true,
      hasConfidenceIntervals: true,
    },
  },
  {
    chartComponentLocator: ChartPage.inequalitiesLineChartComponent,
    chartComponentProps: {
      hasInequalitiesExpander: true,
      hasPNGExport: true,
      hasSVGExport: true,
      hasInequalityTypeDropDown: true,
      isWideComponent: true,
      hasConfidenceIntervals: true,
    },
  },
  {
    chartComponentLocator: ChartPage.inequalitiesBarChartTableComponent,
    chartComponentProps: {
      hasInequalitiesExpander: true,
      hasInequalityTypeDropDown: true,
      hasPNGExport: true,
      hasCSVExport: true,
      isTabTable: true,
    },
  },
  {
    chartComponentLocator: ChartPage.inequalitiesLineChartTableComponent,
    chartComponentProps: {
      hasInequalitiesExpander: true,
      hasInequalityTypeDropDown: true,
      hasPNGExport: true,
      hasCSVExport: true,
      isTabTable: true,
    },
  },
  {
    chartComponentLocator: ChartPage.populationPyramidChartComponent,
    chartComponentProps: {
      hasPNGExport: true,
      hasSVGExport: true,
      hasDetailsExpander: true,
    },
  },
  {
    chartComponentLocator: ChartPage.populationPyramidTableComponent,
    chartComponentProps: {
      hasPNGExport: true,
      hasCSVExport: true,
      isTabTable: true,
    },
  },
  {
    chartComponentLocator: ChartPage.thematicMapComponent,
    chartComponentProps: {
      hasPNGExport: true,
      hasSVGExport: true,
      hasBenchmarkComparisons: true,
      hasTooltipHovers: true,
    },
  },
  {
    chartComponentLocator: ChartPage.barChartEmbeddedTableComponent,
    chartComponentProps: {
      hasPNGExport: true,
      hasCSVExport: true,
      hasRecentTrend: true,
      hasBenchmarkComparisons: true,
      hasTooltipHovers: true,
      hasConfidenceIntervals: true,
    },
  },
  {
    chartComponentLocator: ChartPage.basicTableComponent,
    chartComponentProps: {
      hasPNGExport: true,
      hasCSVExport: true,
      hasRecentTrend: true,
    },
  },
  {
    chartComponentLocator: ChartPage.heatMapComponent,
    chartComponentProps: {
      hasPNGExport: true,
      hasCSVExport: true,
      isWideComponent: true,
      hasBenchmarkComparisons: true,
      hasTooltipHovers: true,
    },
  },
  {
    chartComponentLocator: ChartPage.spineChartTableComponent,
    chartComponentProps: {
      hasPNGExport: true,
      hasCSVExport: true,
      isWideComponent: true,
      hasRecentTrend: true,
      hasBenchmarkComparisons: true,
      hasTooltipHovers: true,
    },
  },
];

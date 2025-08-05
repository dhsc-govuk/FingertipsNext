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
      hasTimePeriodInTitle: true,
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
      hasTimePeriodInTitle: true,
    },
  },
  {
    chartComponentLocator: ChartPage.inequalitiesBarChartComponent,
    chartComponentProps: {
      hasPNGExport: true,
      hasSVGExport: true,
      hasConfidenceIntervals: true,
      hasTimePeriodInTitle: true,
    },
  },
  {
    chartComponentLocator: ChartPage.inequalitiesForSingleTimePeriodComponent,
    chartComponentProps: {
      hasInequalitiesTimePeriodDropDown: true,
      hasInequalityTypeDropDown: true,
      hasConfidenceIntervals: true,
      hasTimePeriodInTitle: true,
    },
  },
  {
    chartComponentLocator: ChartPage.inequalitiesTrendComponent,
    chartComponentProps: {
      hasInequalityTypeDropDown: true,
      hasConfidenceIntervals: true,
      hasTimePeriodInTitle: true,
    },
  },
  {
    chartComponentLocator: ChartPage.inequalitiesLineChartComponent,
    chartComponentProps: {
      hasPNGExport: true,
      hasSVGExport: true,
      hasInequalityTypeDropDown: true,
      isWideComponent: true,
      hasConfidenceIntervals: true,
      hasTimePeriodInTitle: true,
    },
  },
  {
    chartComponentLocator: ChartPage.inequalitiesBarChartTableComponent,
    chartComponentProps: {
      hasInequalityTypeDropDown: true,
      hasPNGExport: true,
      hasCSVExport: true,
      isTabTable: true,
      hasTimePeriodInTitle: true,
    },
  },
  {
    chartComponentLocator: ChartPage.inequalitiesLineChartTableComponent,
    chartComponentProps: {
      hasInequalityTypeDropDown: true,
      hasPNGExport: true,
      hasCSVExport: true,
      isTabTable: true,
      hasTimePeriodInTitle: true,
    },
  },
  {
    chartComponentLocator: ChartPage.populationPyramidChartComponent,
    chartComponentProps: {
      hasPNGExport: true,
      hasSVGExport: true,
      hasDetailsExpander: true,
      hasTimePeriodInTitle: true,
    },
  },
  {
    chartComponentLocator: ChartPage.populationPyramidTableComponent,
    chartComponentProps: {
      isTabTable: true,
      hasPNGExport: true,
      hasCSVExport: true,
      hasTimePeriodInTitle: true,
    },
  },
  {
    chartComponentLocator: ChartPage.thematicMapComponent,
    chartComponentProps: {
      hasPNGExport: true,
      hasSVGExport: true,
      hasBenchmarkComparisons: true,
      hasTooltipHovers: true,
      hasTimePeriodInTitle: true,
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
      hasTimePeriodInTitle: true,
    },
  },
  {
    chartComponentLocator: ChartPage.basicTableComponent,
    chartComponentProps: {
      hasPNGExport: true,
      hasCSVExport: true,
      hasRecentTrend: true,
      hasTimePeriodInTitle: true,
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
      hasTimePeriodInTitle: true,
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
      hasTimePeriodInTitle: true,
    },
  },
];

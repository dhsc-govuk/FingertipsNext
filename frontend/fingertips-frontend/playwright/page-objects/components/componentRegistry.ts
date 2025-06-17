import ChartPage from '../../page-objects/pages/chartPage';
import { ComponentDefinition } from './componentTypes';

export const allComponents: ComponentDefinition[] = [
  {
    componentLocator: ChartPage.lineChartComponent,
    componentProps: {
      hasPNGExport: true,
      hasSVGExport: true,
      showsBenchmarkComparisons: true,
      hasTooltipHovers: true,
      hasConfidenceIntervals: true,
    },
  },
  {
    componentLocator: ChartPage.lineChartTableComponent,
    componentProps: {
      hasPNGExport: true,
      hasCSVExport: true,
      isTabTable: true,
      hasRecentTrend: true,
      showsBenchmarkComparisons: true,
    },
  },
  {
    componentLocator: ChartPage.inequalitiesBarChartComponent,
    componentProps: {
      hasPNGExport: true,
      hasSVGExport: true,
      hasConfidenceIntervals: true,
    },
  },
  {
    componentLocator: ChartPage.inequalitiesForSingleTimePeriodComponent,
    componentProps: {
      hasInequalitiesTimePeriodDropDown: true,
      hasInequalityTypeDropDown: true,
      hasConfidenceIntervals: true,
    },
  },
  {
    componentLocator: ChartPage.inequalitiesTrendComponent,
    componentProps: {
      hasInequalityTypeDropDown: true,
      hasConfidenceIntervals: true,
    },
  },
  {
    componentLocator: ChartPage.inequalitiesLineChartComponent,
    componentProps: {
      hasPNGExport: true,
      hasSVGExport: true,
      hasInequalityTypeDropDown: true,
      isWideComponent: true,
      hasConfidenceIntervals: true,
    },
  },
  {
    componentLocator: ChartPage.inequalitiesBarChartTableComponent,
    componentProps: {
      hasInequalityTypeDropDown: true,
      hasPNGExport: true,
      hasCSVExport: true,
      isTabTable: true,
    },
  },
  {
    componentLocator: ChartPage.inequalitiesLineChartTableComponent,
    componentProps: {
      hasInequalityTypeDropDown: true,
      hasPNGExport: true,
      hasCSVExport: true,
      isTabTable: true,
    },
  },
  {
    componentLocator: ChartPage.populationPyramidChartComponent,
    componentProps: {
      hasPNGExport: true,
      hasSVGExport: true,
      hasDetailsExpander: true,
    },
  },
  {
    componentLocator: ChartPage.populationPyramidTableComponent,
    componentProps: {
      hasPNGExport: true,
      hasCSVExport: true,
      isTabTable: true,
    },
  },
  {
    componentLocator: ChartPage.thematicMapComponent,
    componentProps: {
      hasPNGExport: true,
      hasSVGExport: true,
      showsBenchmarkComparisons: true,
      hasTooltipHovers: true,
    },
  },
  {
    componentLocator: ChartPage.barChartEmbeddedTableComponent,
    componentProps: {
      hasPNGExport: true,
      hasCSVExport: true,
      hasRecentTrend: true,
      showsBenchmarkComparisons: true,
      hasTooltipHovers: true,
      hasConfidenceIntervals: true,
    },
  },
  {
    componentLocator: ChartPage.basicTableComponent,
    componentProps: {
      hasPNGExport: true,
      hasCSVExport: true,
      hasRecentTrend: true,
    },
  },
  {
    componentLocator: ChartPage.heatMapComponent,
    componentProps: {
      hasPNGExport: true,
      hasCSVExport: true,
      isWideComponent: true,
      showsBenchmarkComparisons: true,
      hasTooltipHovers: true,
    },
  },
  {
    componentLocator: ChartPage.spineChartTableComponent,
    componentProps: {
      hasPNGExport: true,
      hasCSVExport: true,
      isWideComponent: true,
      hasRecentTrend: true,
      showsBenchmarkComparisons: true,
      hasTooltipHovers: true,
    },
  },
];

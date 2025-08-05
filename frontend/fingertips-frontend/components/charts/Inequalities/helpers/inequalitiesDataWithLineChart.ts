import { InequalitiesDataWithBarChart } from '@/components/charts/Inequalities/helpers/inequalitiesDataWithBarChart';
import {
  ChartType,
  getDynamicKeys,
  reorderItemsArraysToEnd,
} from '@/components/charts/Inequalities/helpers/inequalitiesHelpers';
import { inequalitiesLineChartData } from '@/components/charts/Inequalities/helpers/inequalitiesLineChartData';
import { inequalitiesLineChartTooltipForPoint } from '@/components/charts/Inequalities/helpers/inequalitiesLineChartTooltipForPoint';
import { determineAreaCodes } from '@/lib/chartHelpers/chartHelpers';
import { generateInequalitiesLineChartOptions } from '@/components/charts/Inequalities/helpers/generateInequalitiesLineChartOptions';

export const inequalitiesDataWithLineChart = (
  inequalitiesDataWithBarChart?: InequalitiesDataWithBarChart
) => {
  if (!inequalitiesDataWithBarChart) return;

  const {
    chartType,
    healthDataForArea,
    allData,
    type,
    healthDataGroupedByPeriodAndInequality,
    sequenceSelector,
    benchmarkMethod,
    indicatorMetaData,
    inequalityLineChartAreaSelected,
    areasSelected,
  } = inequalitiesDataWithBarChart;

  const lineChartData =
    chartType == ChartType.Trend
      ? inequalitiesLineChartData(healthDataForArea, allData)
      : null;

  const dynamicKeys = getDynamicKeys(
    healthDataGroupedByPeriodAndInequality,
    sequenceSelector
  );

  const inequalitiesLineChartOptions = lineChartData
    ? generateInequalitiesLineChartOptions(
        lineChartData,
        dynamicKeys,
        type,
        true,
        inequalitiesLineChartTooltipForPoint(
          lineChartData,
          type,
          benchmarkMethod,
          indicatorMetaData.unitLabel
        ),
        {
          areasSelected: determineAreaCodes(areasSelected),
          yAxisTitleText: 'Value',
          xAxisTitleText: 'Period',
          measurementUnit: indicatorMetaData?.unitLabel,
          inequalityLineChartAreaSelected,
          indicatorName: indicatorMetaData?.indicatorName,
          areaName: healthDataForArea.areaName,
        }
      )
    : null;

  const orderedDynamicKeys = reorderItemsArraysToEnd(dynamicKeys, ['Persons']);

  return {
    ...inequalitiesDataWithBarChart,
    inequalitiesLineChartOptions,
    orderedDynamicKeys,
    lineChartData,
  };
};

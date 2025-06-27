import { InequalitiesDataWithBarChart } from '@/components/charts/Inequalities/helpers/inequalitiesDataWithBarChart';
import {
  ChartType,
  generateInequalitiesLineChartOptions,
  getDynamicKeys,
  reorderItemsArraysToEnd,
} from '@/components/charts/Inequalities/helpers/inequalitiesHelpers';
import { inequalitiesLineChartData } from '@/components/charts/Inequalities/helpers/inequalitiesLineChartData';
import { inequalitiesLineChartTooltipForPoint } from '@/components/charts/Inequalities/helpers/inequalitiesLineChartTooltipForPoint';
import { determineAreaCodes } from '@/lib/chartHelpers/chartHelpers';

export const inequalitiesDataWithLineChart = (
  inequalitiesDataWithBarChart?: InequalitiesDataWithBarChart
) => {
  if (!inequalitiesDataWithBarChart) return;

  const {
    chartType,
    healthDataForArea,
    allData,
    yearsDesc,
    type,
    yearlyHealthDataGroupedByInequalities,
    sequenceSelector,
    benchmarkMethod,
    indicatorMetaData,
    inequalityLineChartAreaSelected,
    areasSelected,
  } = inequalitiesDataWithBarChart;

  const lineChartData =
    chartType == ChartType.Trend
      ? inequalitiesLineChartData(healthDataForArea, allData, yearsDesc)
      : null;

  const dynamicKeys = getDynamicKeys(
    yearlyHealthDataGroupedByInequalities,
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

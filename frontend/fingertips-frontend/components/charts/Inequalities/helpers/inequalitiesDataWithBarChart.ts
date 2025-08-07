import { InequalitiesDataWithHealthData } from '@/components/charts/Inequalities/helpers/inequalitiesDataWithPeriods';
import {
  ChartType,
  InequalitiesBarChartData,
} from '@/components/charts/Inequalities/helpers/inequalitiesHelpers';
import { inequalitiesBarChartData } from '@/components/charts/Inequalities/helpers/inequalitiesBarChartData';
import { getPeriodLabel } from '@/lib/timePeriodHelpers/getTimePeriodLabels';

export interface InequalitiesDataWithBarChart
  extends InequalitiesDataWithHealthData {
  chartTitle: string;
  barChartData: InequalitiesBarChartData | null;
}

export const inequalitiesDataWithBarChart = (
  inequalitiesDataWithYears?: InequalitiesDataWithHealthData
): InequalitiesDataWithBarChart | undefined => {
  if (!inequalitiesDataWithYears) return;

  const {
    chartType,
    healthDataForArea,
    allData,
    periodsDesc,
    selectedPeriod,
    dataPeriod,
    indicatorMetaData,
    frequency,
  } = inequalitiesDataWithYears;

  const barChartData =
    chartType == ChartType.SingleTimePeriod
      ? inequalitiesBarChartData(
          healthDataForArea,
          allData,
          periodsDesc,
          selectedPeriod
        )
      : null;

  const periodType = healthDataForArea.healthData.at(0)?.datePeriod?.type;
  const periodTypeLabel =
    periodType && frequency ? getPeriodLabel(periodType, frequency) : '';
  const chartTitle =
    `${indicatorMetaData?.indicatorName ?? ''} inequalities for ${healthDataForArea.areaName}, ${periodTypeLabel} ${dataPeriod}`
      .replaceAll(/\s+/g, ' ')
      .trim();

  return {
    ...inequalitiesDataWithYears,
    barChartData,
    chartTitle,
  };
};

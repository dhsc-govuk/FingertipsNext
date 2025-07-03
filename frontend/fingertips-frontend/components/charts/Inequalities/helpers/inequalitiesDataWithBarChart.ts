import { InequalitiesDataWithHealthData } from '@/components/charts/Inequalities/helpers/inequalitiesDataWithYears';
import {
  ChartType,
  InequalitiesBarChartData,
} from '@/components/charts/Inequalities/helpers/inequalitiesHelpers';
import { inequalitiesBarChartData } from '@/components/charts/Inequalities/helpers/inequalitiesBarChartData';

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
    yearsDesc,
    selectedYear,
    dataPeriod,
    indicatorMetaData,
  } = inequalitiesDataWithYears;

  const barChartData =
    chartType == ChartType.SingleTimePeriod
      ? inequalitiesBarChartData(
          healthDataForArea,
          allData,
          yearsDesc,
          selectedYear
        )
      : null;

  const chartTitle = `${indicatorMetaData?.indicatorName ?? ''} inequalities for ${healthDataForArea.areaName}, ${dataPeriod}`;

  return {
    ...inequalitiesDataWithYears,
    barChartData,
    chartTitle,
  };
};

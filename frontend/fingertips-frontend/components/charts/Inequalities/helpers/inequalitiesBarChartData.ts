import {
  InequalitiesBarChartData,
  InequalitiesTableRowData,
} from '@/components/charts/Inequalities/helpers/inequalitiesHelpers';
import { HealthDataForArea } from '@/generated-sources/ft-api-client';

export const inequalitiesBarChartData = (
  healthDataForArea: HealthDataForArea,
  allData: InequalitiesTableRowData[],
  periods: string[],
  selectedPeriod?: string
): InequalitiesBarChartData | null => {
  if (!periods.length) return null;

  const dataPeriod = selectedPeriod ?? periods[0];

  const periodData = allData.find((data) => data.period === dataPeriod);

  if (!periodData) return null;

  return {
    areaCode: healthDataForArea.areaCode,
    areaName: healthDataForArea.areaName,
    data: periodData,
  };
};

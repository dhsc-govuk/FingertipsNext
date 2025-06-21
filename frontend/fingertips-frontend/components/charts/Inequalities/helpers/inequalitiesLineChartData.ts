import {
  InequalitiesChartData,
  InequalitiesTableRowData,
} from '@/components/charts/Inequalities/helpers/inequalitiesHelpers';
import { HealthDataForArea } from '@/generated-sources/ft-api-client';

export const inequalitiesLineChartData = (
  healthDataForArea: HealthDataForArea,
  allData: InequalitiesTableRowData[],
  years: number[]
): InequalitiesChartData | null => {
  if (!years.length || allData.length < 2) return null;

  return {
    areaCode: healthDataForArea.areaCode,
    areaName: healthDataForArea.areaName,
    rowData: allData,
  };
};

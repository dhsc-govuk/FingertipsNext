import { determineHealthDataForArea } from '@/lib/chartHelpers/chartHelpers';
import { HealthDataForArea } from '@/generated-sources/ft-api-client';
import { InequalitiesDataBasicInfo } from '@/components/charts/Inequalities/helpers/inequalitiesDataBasicInfo';

export interface InequalitiesDataWithAreas extends InequalitiesDataBasicInfo {
  healthDataForArea: HealthDataForArea;
}

export const inequalitiesDataWithAreas = (
  basicInfo?: InequalitiesDataBasicInfo
): InequalitiesDataWithAreas | undefined => {
  if (!basicInfo) return;
  const { inequalityAreaSelected, areaHealthData } = basicInfo;

  const healthDataForArea = determineHealthDataForArea(
    areaHealthData,
    inequalityAreaSelected
  );

  if (!healthDataForArea) return;

  return {
    ...basicInfo,
    healthDataForArea,
  };
};

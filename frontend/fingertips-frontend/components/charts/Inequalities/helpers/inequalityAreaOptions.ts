import { IndicatorWithHealthDataForArea } from '@/generated-sources/ft-api-client';
import { AreaWithoutAreaType } from '@/lib/common-types';

export const inequalityAreaOptions = (
  healthData: IndicatorWithHealthDataForArea
): AreaWithoutAreaType[] => {
  const { areaHealthData = [] } = healthData;
  return areaHealthData.map((area) => ({
    code: area.areaCode,
    name: area.areaName,
  }));
};

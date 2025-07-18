import {
  HealthDataForArea,
  IndicatorWithHealthDataForArea,
} from '@/generated-sources/ft-api-client';

export const findHealthDataForArea = (
  indicator: IndicatorWithHealthDataForArea,
  areaCode: string
): HealthDataForArea | undefined => {
  const arr = indicator.areaHealthData ?? [];
  return arr.find((area) => area.areaCode === areaCode);
};

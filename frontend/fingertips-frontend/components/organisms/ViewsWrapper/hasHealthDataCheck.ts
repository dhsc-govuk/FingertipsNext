import { IndicatorWithHealthDataForArea } from '@/generated-sources/ft-api-client';

const hasAreaHealthData = (
  indicatorDataForArea: IndicatorWithHealthDataForArea,
  areasSelected: string[]
): boolean => {
  if (indicatorDataForArea.areaHealthData) {
    return indicatorDataForArea.areaHealthData.reduce<boolean>(
      (hasHealthData, healthData) => {
        const hasAreaSelectedHealthData = areasSelected?.find(
          (areaSelected) => areaSelected === healthData.areaCode
        );

        if (hasAreaSelectedHealthData) {
          return true;
        }
        return hasHealthData;
      },
      false
    );
  }
  return false;
};

export const hasHealthDataCheck = (
  indicatorsDataForAreas: IndicatorWithHealthDataForArea[] = [],
  areasSelected: string[] = []
): boolean => {
  const hasHealthDataForAllSelectedAreasAndIndicators = indicatorsDataForAreas
    ?.map((indicatorData) => {
      return hasAreaHealthData(indicatorData, areasSelected);
    })
    .some(
      (hasNoHealthDataForAllSelectedArea) => hasNoHealthDataForAllSelectedArea
    );

  return hasHealthDataForAllSelectedAreasAndIndicators;
};

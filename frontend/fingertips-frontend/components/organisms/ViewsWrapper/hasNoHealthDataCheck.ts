import { IndicatorWithHealthDataForArea } from '@/generated-sources/ft-api-client';

const hasNoAreaHealthData = (
  indicatorDataForArea: IndicatorWithHealthDataForArea,
  areasSelected: string[]
): boolean => {
  if (indicatorDataForArea.areaHealthData) {
    return indicatorDataForArea.areaHealthData.reduce<boolean>(
      (hasNoHealthData, healthData) => {
        const hasAreaSelectedHealthData = areasSelected?.find(
          (areaSelected) => areaSelected === healthData.areaCode
        );

        if (hasAreaSelectedHealthData) {
          return false;
        }
        return hasNoHealthData;
      },
      true
    );
  }
  return true;
};

export const hasNoHealthDataCheck = (
  indicatorsDataForAreas: IndicatorWithHealthDataForArea[],
  areasSelected: string[]
): boolean => {
  const hasNoHealthDataForAllSelectedAreasAndIndicators = indicatorsDataForAreas
    ?.map((indicatorData) => {
      return hasNoAreaHealthData(indicatorData, areasSelected);
    })
    .every(
      (hasNoHealthDataForAllSelectedArea) => hasNoHealthDataForAllSelectedArea
    );

  return hasNoHealthDataForAllSelectedAreasAndIndicators;
};

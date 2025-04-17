import { IndicatorWithHealthDataForArea } from '@/generated-sources/ft-api-client';

const hasSufficientAreaHealthData = (
  indicatorDataForArea: IndicatorWithHealthDataForArea,
  areasSelected: string[]
): boolean => {
  if (indicatorDataForArea.areaHealthData) {
    return indicatorDataForArea.areaHealthData.reduce<boolean>(
      (hasSufficientAreaHealthData, areaHealthData) => {
        const hasAreaSelectedHealthData = areasSelected?.find(
          (areaSelected) => areaSelected === areaHealthData.areaCode
        );

        if (hasAreaSelectedHealthData) {
          const hasSufficientAreaHealthData =
            areasSelected.length <= 2
              ? areaHealthData.healthData.length > 1
              : true;
          if (hasSufficientAreaHealthData) return true;
        }
        return hasSufficientAreaHealthData;
      },
      false
    );
  }
  return false;
};

export const hasSufficientHealthDataCheck = (
  indicatorsDataForAreas: IndicatorWithHealthDataForArea[] = [],
  areasSelected: string[] = []
): boolean => {
  const hasHealthDataForAllSelectedAreasAndIndicators = indicatorsDataForAreas
    ?.map((indicatorData) => {
      return hasSufficientAreaHealthData(indicatorData, areasSelected);
    })
    .some(
      (hasNoHealthDataForAllSelectedArea) => hasNoHealthDataForAllSelectedArea
    );

  return hasHealthDataForAllSelectedAreasAndIndicators;
};

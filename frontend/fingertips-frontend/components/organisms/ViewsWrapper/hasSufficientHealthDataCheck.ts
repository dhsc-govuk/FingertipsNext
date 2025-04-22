import { IndicatorWithHealthDataForArea } from '@/generated-sources/ft-api-client';

const checkAreaHasSufficientHealthData = (
  indicatorDataForArea: IndicatorWithHealthDataForArea,
  areasSelected: string[],
  indicatorsRequested: number
): boolean => {
  if (indicatorDataForArea.areaHealthData) {
    return indicatorDataForArea.areaHealthData.reduce<boolean>(
      (hasSufficientAreaHealthData, areaHealthData) => {
        const healthDataForSelectedArea = areasSelected?.find(
          (areaSelected) => areaSelected === areaHealthData.areaCode
        );

        if (healthDataForSelectedArea) {
          const hasSufficientHealthData =
            indicatorsRequested === 1 && areasSelected.length <= 2
              ? areaHealthData.healthData.length > 1
              : true;
          if (hasSufficientHealthData) return true;
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
      return checkAreaHasSufficientHealthData(
        indicatorData,
        areasSelected,
        indicatorsDataForAreas.length
      );
    })
    .some(
      (hasNoHealthDataForAllSelectedArea) => hasNoHealthDataForAllSelectedArea
    );

  return hasHealthDataForAllSelectedAreasAndIndicators;
};

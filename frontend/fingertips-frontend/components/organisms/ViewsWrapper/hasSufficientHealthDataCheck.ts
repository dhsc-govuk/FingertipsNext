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
          // We only return a single and the most recent health data point when more that one indicator or 2 areas have have been selected.
          // Therefore we can only check there is sufficient data when there is one indicator and 2 or less areas selected.
          const hasOnlyLatestHealthData =
            indicatorsRequested > 1 || areasSelected.length > 2;

          const hasSufficientHealthData = !hasOnlyLatestHealthData
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

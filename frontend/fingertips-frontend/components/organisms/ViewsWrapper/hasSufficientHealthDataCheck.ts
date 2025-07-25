import { IndicatorWithHealthDataForArea } from '@/generated-sources/ft-api-client';

const checkAreaHasSufficientHealthData = (
  indicatorDataForArea: IndicatorWithHealthDataForArea,
  areasSelected: string[],
  indicatorsRequested: number
): boolean => {
  if (!indicatorDataForArea.areaHealthData) return false;

  return indicatorDataForArea.areaHealthData.reduce<boolean>(
    (previousValue, areaHealthData) => {
      const healthDataForSelectedArea = areasSelected?.find(
        (areaSelected) => areaSelected === areaHealthData.areaCode
      );

      if (healthDataForSelectedArea) {
        // We only return a single and the most recent health data point when more than one indicator or 2 areas have been selected.
        // Therefore we can only check there is sufficient data when there is one indicator and 2 or less areas selected.
        const requiresOnlyLatestHealthData =
          indicatorsRequested > 1 || areasSelected.length > 2;

        const threshold = requiresOnlyLatestHealthData ? 0 : 1;
        const someHaveIt = !!areaHealthData.indicatorSegments?.some(
          (segment) => {
            const nHealthData = segment.healthData?.length ?? 0;
            return nHealthData > threshold;
          }
        );

        return someHaveIt ? true : previousValue;
      }
      return previousValue;
    },
    false
  );
};

export const hasSufficientHealthDataCheck = (
  indicatorsDataForAreas: IndicatorWithHealthDataForArea[] = [],
  areasSelected: string[] = []
): boolean => {
  return indicatorsDataForAreas?.some((indicatorData) => {
    return checkAreaHasSufficientHealthData(
      indicatorData,
      areasSelected,
      indicatorsDataForAreas.length
    );
  });
};

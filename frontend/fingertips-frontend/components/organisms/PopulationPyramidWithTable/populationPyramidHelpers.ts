import {
  HealthDataForArea,
  HealthDataPoint,
} from '@/generated-sources/ft-api-client';
import {
  allAreaTypes,
  HierarchyNameTypes,
} from '@/lib/areaFilterHelpers/areaType';
import { sortHealthDataPointsByDescendingYear } from '@/lib/chartHelpers/chartHelpers';
import { PopulationDataForArea } from '@/lib/chartHelpers/preparePopulationData';
import { AreaWithoutAreaType } from '@/lib/common-types';

export const determineHeaderTitle = (
  healthDataForAreaSelected?: HealthDataForArea,
  areaTypeSelected?: string,
  year?: number
): string => {
  if (!healthDataForAreaSelected) return '';

  const hierarchyName = allAreaTypes.find(
    (areaType) => areaType.key === areaTypeSelected
  );

  const titleTypeText =
    hierarchyName?.hierarchyName === HierarchyNameTypes.NHS
      ? 'Registered'
      : 'Resident';

  return `${titleTypeText} population profile for ${healthDataForAreaSelected?.areaName} ${year}`;
};

export const determinePopulationDataForArea = (
  populationDataForAllAreas: PopulationDataForArea[],
  availableAreas: AreaWithoutAreaType[],
  areaToFind?: string
): PopulationDataForArea | undefined => {
  if (!areaToFind) {
    return populationDataForAllAreas.find(
      (data) => data.areaCode === availableAreas[0].code
    );
  }

  return populationDataForAllAreas.find((data) => data.areaCode === areaToFind);
};

export const determineYear = (
  healthData: HealthDataPoint[]
): number | undefined => {
  return sortHealthDataPointsByDescendingYear(healthData)[0]?.year;
};

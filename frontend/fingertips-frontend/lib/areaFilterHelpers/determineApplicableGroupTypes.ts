import { AreaType } from '@/generated-sources/ft-api-client';
import {
  AreaTypeKeys,
  englandAreaType,
  gpsAreaType,
  nhsIntegratedCareBoardsAreaType,
  nhsPrimaryCareNetworksAreaType,
  nhsRegionsAreaType,
  nhsSubIntegratedCareBoardsAreaType,
} from '@/lib/areaFilterHelpers/areaType';

export const determineApplicableGroupTypes = (
  allAreaTypes?: AreaType[],
  selectedAreaType?: AreaTypeKeys
): AreaType[] | undefined => {
  if (allAreaTypes && selectedAreaType) {
    const selectedAreaTypeData = allAreaTypes.find(
      (areaType) => areaType.key === selectedAreaType
    );

    if (selectedAreaTypeData) {
      const filteredAreaTypes = allAreaTypes.filter(
        (areaType) =>
          areaType.level < selectedAreaTypeData.level &&
          (areaType.hierarchyName === selectedAreaTypeData.hierarchyName ||
            areaType.hierarchyName === 'Both')
      );

      if (selectedAreaTypeData.key === gpsAreaType.key) {
        return [
          nhsPrimaryCareNetworksAreaType,
          nhsSubIntegratedCareBoardsAreaType,
        ];
      }

      if (selectedAreaTypeData.key === nhsPrimaryCareNetworksAreaType.key) {
        return [
          nhsSubIntegratedCareBoardsAreaType,
          nhsIntegratedCareBoardsAreaType,
          nhsRegionsAreaType,
        ];
      }

      if (selectedAreaTypeData.key === englandAreaType.key) {
        return [englandAreaType];
      }
      return filteredAreaTypes;
    }
  }
};

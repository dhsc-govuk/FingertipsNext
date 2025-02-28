import { AreaType } from '@/generated-sources/ft-api-client';
import { AreaTypeKeys, gpsAreaType, nhsPrimaryCareNetworksAreaType } from '@/lib/areaFilterHelpers/areaType';

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
            areaType.hierarchyName === 'All')
        );

        if (selectedAreaTypeData.key === gpsAreaType.key) {
          return filteredAreaTypes.filter(
            (areaType) => areaType.level >= selectedAreaTypeData.level - 2
          )
        }

        if (selectedAreaTypeData.key === nhsPrimaryCareNetworksAreaType.key) {
          return filteredAreaTypes.filter(
            (areaType) => areaType.level >= selectedAreaTypeData.level - 3
          )
        }
        return filteredAreaTypes
      }
    }
  };

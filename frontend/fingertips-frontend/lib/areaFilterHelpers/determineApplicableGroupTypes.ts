import { AreaType } from '@/generated-sources/ft-api-client';
import { AreaTypeKeys } from '@/lib/areaFilterHelpers/areaType';

export const determineApplicableGroupTypes = (
  allAreaTypes?: AreaType[],
  selectedAreaType?: AreaTypeKeys
): AreaType[] | undefined => {
  if (allAreaTypes && selectedAreaType) {
    const selectedAreaTypeData = allAreaTypes.find(
      (areaType) => areaType.key === selectedAreaType
    );

    if (selectedAreaTypeData) {
      return allAreaTypes.filter(
        (areaType) =>
          areaType.level < selectedAreaTypeData.level &&
          (areaType.hierarchyName === selectedAreaTypeData.hierarchyName ||
            areaType.hierarchyName === 'All')
      );
    }
  }
};

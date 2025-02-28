import { AreaType } from '@/generated-sources/ft-api-client';
import { AreaTypeKeys } from '@/lib/areaFilterHelpers/areaType';
import { types } from 'util';

export const determineApplicableGroupTypes = (
  allAreaTypes?: AreaType[],
  selectedAreaType?: AreaTypeKeys
): AreaType[] | undefined => {
  if (allAreaTypes && selectedAreaType) {
    
    // if (selectedAreaType === 'gps') {
    //   return allAreaTypes.filter(
    //     (areaType) => areaType.key === 'SET_FOR_GP'
    //   );
    // }

    // if (selectedAreaType === 'nhs-primary-care-networks') {
    //   return allAreaTypes.filter(
    //     (areaType) => areaType.key === 'SET_FOR_PCN'
    //   );
    // }
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

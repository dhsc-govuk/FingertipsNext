import { AreaType } from '@/generated-sources/ft-api-client';

export const adminAreaTypes = ['Regions Statistical', 'Counties & UAs'];
export const nhsAreaTypes = ['NHS region', 'ICB', 'PCN', 'GP'];
export const allAreaType = ['Country'];

export const allApplicableAreaTypes = [
  ...adminAreaTypes,
  ...nhsAreaTypes,
  ...allAreaType,
] as const;

export type AllApplicableAreaTypes = (typeof allApplicableAreaTypes)[number];

export const determineApplicableGroupTypes = (
  allAreaTypes?: AreaType[],
  selectedAreaType?: AllApplicableAreaTypes
): AllApplicableAreaTypes[] | undefined => {
  if (allAreaTypes && selectedAreaType) {
    const selectedAreaTypeData = allAreaTypes.find(
      (areaType) => areaType.name === selectedAreaType
    );

    if (selectedAreaTypeData) {
      return allAreaTypes
        .filter(
          (areaType) =>
            areaType.level < selectedAreaTypeData.level &&
            (areaType.hierarchyName === selectedAreaTypeData.hierarchyName ||
              areaType.hierarchyName === 'All')
        )
        .map((applicableAreaType) => applicableAreaType.name);
    }
  }
};

import { HealthDataRequestAreas } from '@/lib/ViewsHelpers';
import { areaCodeForEngland } from '@/lib/chartHelpers/constants';
import { englandAreaType } from '@/lib/areaFilterHelpers/areaType';
import { determineAreaCodes } from '@/lib/chartHelpers/chartHelpers';
import { SearchParams, SearchStateParams } from '@/lib/searchStateManager';
import { Area } from '@/generated-sources/ft-api-client';

export const healthDataRequestAreas = (
  searchState: SearchStateParams,
  availableAreas?: Area[]
): HealthDataRequestAreas[] => {
  const {
    [SearchParams.AreasSelected]: areasSelected,
    [SearchParams.AreaTypeSelected]: selectedAreaType,
    [SearchParams.GroupSelected]: selectedGroupCode,
    [SearchParams.GroupTypeSelected]: selectedGroupType,
    [SearchParams.GroupAreaSelected]: groupAreaSelected,
  } = searchState;

  const areaCodes = determineAreaCodes(
    areasSelected,
    groupAreaSelected,
    availableAreas
  );
  const areasToRequest: HealthDataRequestAreas[] = [
    {
      areaCodes,
      areaType: selectedAreaType,
    },
  ];

  if (!areaCodes.includes(areaCodeForEngland)) {
    areasToRequest.push({
      areaCodes: [areaCodeForEngland],
      areaType: englandAreaType.key,
    });
  }

  if (selectedGroupCode && selectedGroupCode !== areaCodeForEngland) {
    areasToRequest.push({
      areaCodes: [selectedGroupCode],
      areaType: selectedGroupType,
    });
  }
  return areasToRequest;
};

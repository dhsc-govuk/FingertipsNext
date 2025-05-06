import { areaCodeForEngland } from '@/lib/chartHelpers/constants';
import { GetHealthDataForAnIndicatorInequalitiesEnum } from '@/generated-sources/ft-api-client';

export const getAreaTypesUrl = () => '/api/areas/areatypes';

export const getAreaTypeMembersUrl = (areaType: string) =>
  `/api/areas/areatypes/${encodeURIComponent(areaType)}/areas`;

export const getAreaUrl = (options: {
  areaCode: string;
  includeChildren: boolean;
  childAreaType: string;
}) => {
  const { areaCode, includeChildren, childAreaType } = options;
  const url = `/api/areas/${encodeURIComponent(areaCode)}`;
  const searchParams = new URLSearchParams();
  if (includeChildren) searchParams.append('include_children', 'true');
  if (childAreaType) searchParams.append('child_area_type', childAreaType);
  return `${url}?${searchParams.toString()}`;
};

export interface HealthDataForAnIndicatorUrlOptions {
  areaCodes?: string[];
  inequalities?: GetHealthDataForAnIndicatorInequalitiesEnum[];
  areaType?: string;
  includeEmptyAreas?: boolean;
  latestOnly?: boolean;
}

export const getHealthDataForAnIndicatorUrl = (
  indicatorId: number,
  options: HealthDataForAnIndicatorUrlOptions
) => {
  const url = `/api/indicators/${encodeURIComponent(indicatorId)}/data`;
  const searchParams = new URLSearchParams();
  const {
    areaCodes = [],
    areaType,
    inequalities = [],
    includeEmptyAreas,
    latestOnly,
  } = options;
  const areaCodesSorted = areaCodes.toSorted((a, b) => {
    if (a === areaCodeForEngland) return -1;
    if (b === areaCodeForEngland) return 1;
    return a.localeCompare(b);
  });

  areaCodesSorted.forEach((areaCode) =>
    searchParams.append('area_codes', areaCode)
  );
  inequalities.forEach((inequality) =>
    searchParams.append('inequalities', inequality)
  );
  if (areaType) searchParams.append('area_type', areaType);
  if (includeEmptyAreas) searchParams.append('include_empty_areas', 'true');
  if (latestOnly) searchParams.append('latest_only', 'true');

  return `${url}?${searchParams.toString()}`;
};

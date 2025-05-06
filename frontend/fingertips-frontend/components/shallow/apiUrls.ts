export const getAreaTypesUrl = () => '/api/areas/areatypes';

export const getAreaTypeMembersUrl = (areaType: string) =>
  `/api/areas/areatypes/${encodeURIComponent(areaType)}/areas`;

export const getAreaUrl = (
  areaCode: string,
  includeChildren = false,
  childAreaType = 'E92000001'
) => {
  const url = `/api/areas/${encodeURIComponent(areaCode)}`;
  const searchParams = new URLSearchParams();
  if (includeChildren) searchParams.append('include_children', 'true');
  if (childAreaType) searchParams.append('child_area_type', childAreaType);
  return `${url}?${searchParams.toString()}`;
};

export const getHealthDataForAnIndicatorUrl = (
  indicatorId: number,
  options: {
    areaCodes?: string[];
    inequalities?: string[];
    areaType?: string;
  }
) => {
  const url = `/api/indicators/${encodeURIComponent(indicatorId)}/data`;
  const searchParams = new URLSearchParams();
  const { areaCodes = [], areaType, inequalities = [] } = options;

  areaCodes.forEach((areaCode) => searchParams.append('area_codes', areaCode));
  inequalities.forEach((inequality) =>
    searchParams.append('inequalities', inequality)
  );
  if (areaType) searchParams.append('area_type', areaType);

  return `${url}?${searchParams.toString()}`;
};

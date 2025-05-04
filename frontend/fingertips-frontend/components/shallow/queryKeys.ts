export const getAreaTypesUrl = () => '/api/areas/areatypes';

export const getAreaTypeMembersUrl = (areaType: string) =>
  `/api/areas/areatypes/${areaType}/areas`;

export const getAreaUrl = (
  areaCode: string,
  includeChildren = false,
  childAreaType = 'E92000001'
) => {
  const url = `/api/areas/${areaCode}`;
  const searchParams = new URLSearchParams();
  if (includeChildren) searchParams.append('include_children', 'true');
  if (childAreaType) searchParams.append('child_area_type', childAreaType);
  return `${url}?${searchParams.toString()}`;
};

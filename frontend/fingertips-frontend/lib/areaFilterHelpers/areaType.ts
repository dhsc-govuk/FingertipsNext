import { AreaType } from '@/generated-sources/ft-api-client';

export const combinedAuthoritiesAreaType = {
  key: 'combined-authorities',
  name: 'Combined Authorities',
  hierarchyName: 'Admin',
  level: 3,
};

export const countiesAndUnitaryAuthoritiesAreaType = {
  key: 'counties-and-unitary-authorities',
  name: 'Counties and Unitary Authorities',
  hierarchyName: 'Admin',
  level: 4,
};

export const districtAndUnitaryAuthoritiesAreaType = {
  key: 'districts-and-unitary-authorities',
  name: 'Districts and Unitary Authorities',
  hierarchyName: 'Admin',
  level: 5,
};

export const gpsAreaType = {
  key: 'gps',
  name: 'GPs',
  hierarchyName: 'NHS',
  level: 6,
};

export const nhsIntegratedCareBoardsAreaType = {
  key: 'nhs-integrated-care-boards',
  name: 'NHS Integrated Care Boards',
  hierarchyName: 'NHS',
  level: 3,
};

export const nhsPrimaryCareNetworksAreaType = {
  key: 'nhs-primary-care-networks',
  name: 'NHS Primary Care Networks',
  hierarchyName: 'NHS',
  level: 5,
};

export const nhsRegionsAreaType = {
  key: 'nhs-regions',
  name: 'NHS Regions',
  hierarchyName: 'NHS',
  level: 2,
};

export const nhsSubIntegratedCareBoardsAreaType = {
  key: 'nhs-sub-integrated-care-boards',
  name: 'NHS Sub Integrated Care Boards',
  hierarchyName: 'NHS',
  level: 4,
};

export const regionsAreaType = {
  key: 'regions',
  name: 'Regions',
  hierarchyName: 'Admin',
  level: 2,
};

export const englandAreaType = {
  key: 'england',
  name: 'England',
  hierarchyName: 'All',
  level: 1,
};

export const adminHierarchyAreaTypes: AreaType[] = [
  combinedAuthoritiesAreaType,
  countiesAndUnitaryAuthoritiesAreaType,
  districtAndUnitaryAuthoritiesAreaType,
  regionsAreaType,
];

export const nhsHierarchyAreaTypes: AreaType[] = [
  gpsAreaType,
  nhsIntegratedCareBoardsAreaType,
  nhsPrimaryCareNetworksAreaType,
  nhsRegionsAreaType,
  nhsSubIntegratedCareBoardsAreaType,
];

const allHierarchyAreaTypes: AreaType[] = [englandAreaType];

export const allAreaTypes = [
  ...adminHierarchyAreaTypes,
  ...nhsHierarchyAreaTypes,
  ...allHierarchyAreaTypes,
];

export const adminHierarchyAreaTypeKeys = [
  'combined-authorities',
  'counties-and-unitary-authorities',
  'districts-and-unitary-authorities',
  'regions',
] as const;

export const nhsHierarchyAreaTypeKeys = [
  'gps',
  'nhs-integrated-care-boards',
  'nhs-primary-care-networks',
  'nhs-regions',
  'nhs-sub-integrated-care-boards',
] as const;

export const allHierarchyAreaTypesKey = ['england'] as const;

const _areaTypeKeys = [
  ...adminHierarchyAreaTypeKeys,
  ...nhsHierarchyAreaTypeKeys,
  ...allHierarchyAreaTypesKey,
] as const;

export type AreaTypeKeys = (typeof _areaTypeKeys)[number];

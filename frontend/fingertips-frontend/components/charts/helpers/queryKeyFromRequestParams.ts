import { localeSort } from '@/components/charts/Inequalities/helpers/inequalitiesHelpers';

export enum EndPoints {
  HealthDataForAnIndicator = 'healthDataForAnIndicator',
  HealthDataForAnIndicatorIncludingUnpublished = 'healthDataForAnIndicatorIncludingUnpublished',
  AreaWithRelations = 'areaWithRelations',
  AreaTypeMembers = 'areaTypeMembers',
  AreaTypes = 'areaTypes',
  Quartiles = 'quartiles',
}

export const queryKeyFromRequestParams = <T extends object>(
  endPoint: EndPoints,
  params: T
) => {
  const query = new URLSearchParams();

  const keys = Object.keys(params).toSorted(localeSort);
  keys.forEach((key) => {
    const value = params[key as keyof T];
    if (value === undefined) return;
    if (!Array.isArray(value)) {
      query.set(key, String(value));
      return;
    }
    const sortedValues = value.map(String).toSorted(localeSort);
    sortedValues.forEach((val) => {
      query.append(key, String(val));
    });
  });

  return `${endPoint}/${query.toString()}`;
};

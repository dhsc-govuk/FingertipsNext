import { localeSort } from '@/components/organisms/Inequalities/inequalitiesHelpers';

export const queryKeyFromRequestParams = <T extends object>(params: T) => {
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

  return query.toString();
};

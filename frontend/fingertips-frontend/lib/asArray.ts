export const asArray = (value?: string | string[]): string[] => {
  if (value) {
    return Array.isArray(value) ? value : [value];
  }
  return [];
};

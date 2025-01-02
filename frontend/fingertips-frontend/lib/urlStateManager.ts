export type PathOptions = {
  intidicator?: string;
  selectedIndicators?: string[];
};

const hasPathOptions = (pathOptions?: PathOptions): boolean => {
  if (pathOptions && Object.keys(pathOptions).length > 0) return true;
  return false;
};

const addIndicatorToPath = (pathOptions?: PathOptions): string | undefined => {
  if (pathOptions?.intidicator) {
    return `indicator=${pathOptions.intidicator}`;
  }
};

const addAmperandToPath = (pathOptions?: PathOptions): string | undefined => {
  if (pathOptions && Object.keys(pathOptions).length > 1) {
    return `&`;
  }
};

const addSelectedIndicatorToPath = (
  pathOptions?: PathOptions
): string | undefined => {
  if (pathOptions?.selectedIndicators) {
    return `selectedIndicator=${pathOptions.selectedIndicators.join(encodeURIComponent(','))}`;
  }
};

export const generatePath = (
  path: string,
  pathOptions?: PathOptions
): string => {
  const generatedPath = [];
  generatedPath.push(path);

  if (hasPathOptions(pathOptions)) {
    generatedPath.push('?');

    generatedPath.push(addIndicatorToPath(pathOptions));
    generatedPath.push(addAmperandToPath(pathOptions));
    generatedPath.push(addSelectedIndicatorToPath(pathOptions));
  }

  return generatedPath.join('');
};

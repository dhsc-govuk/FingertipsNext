export * from './testHelpers/testEnums';
export * from './testHelpers/indicatorUtils';
export * from './page-objects/components/scenarioMapper';

export function sortAlphabetically(array: (string | null)[]) {
  array.sort((a, b) => a!.localeCompare(b!));
}

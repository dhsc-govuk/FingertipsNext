export * from './testDefinitions';
export * from './scenarioMapper';

export function sortAlphabetically(array: (string | null)[]) {
  array.sort((a, b) => a!.localeCompare(b!));
}

/*
/ Custom function to encode the expected URI component how the application currently does.
/ This may be expanded for further special characters.
*/
export function customEncodeURIComponent(value: string): string {
  return encodeURIComponent(value)
    .replace(/%20/g, '+')
    .replace(/\(/g, '%28')
    .replace(/\)/g, '%29');
}

export function capitaliseFirstCharacter(value: string): string {
  return value.charAt(0).toUpperCase() + value.slice(1);
}

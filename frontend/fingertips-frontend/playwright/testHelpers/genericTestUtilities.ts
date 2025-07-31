export * from './testDefinitions';
export * from './scenarioMapper';
import path from 'path';
import fs from 'fs/promises';

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

export function randomString(length: number) {
  let result = '';
  const characters =
    'ABCDEFGHIJKLMNOPQRSTUVWXYZabcdefghijklmnopqrstuvwxyz0123456789';
  const charactersLength = characters.length;
  for (let i = 0; i < length; i++) {
    result += characters.charAt(Math.floor(Math.random() * charactersLength));
  }
  return result;
}

export async function buildRandomisedCSVFileName(
  pathToExampleCsv: string
): Promise<{
  pathToRandomisedCsv: string;
  randomisedCSVFileName: string;
}> {
  const randomVal = randomString(5);
  const baseFileName = path.basename(pathToExampleCsv, '.csv');
  const randomisedCSVFileName = `${baseFileName}_${randomVal}.csv`;
  const pathToRandomisedCsv = path.join(
    path.dirname(pathToExampleCsv),
    randomisedCSVFileName
  );

  await fs.copyFile(pathToExampleCsv, pathToRandomisedCsv);

  return { pathToRandomisedCsv, randomisedCSVFileName };
}

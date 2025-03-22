import { fileURLToPath } from 'url';
import { config } from 'dotenv';
import { readFileSync } from 'fs';
import path, { dirname } from 'path';

const __filename = fileURLToPath(import.meta.url);
const __dirname = dirname(__filename);

/**
 * Obtain an environment variable
 * @param variableName
 * @param defaultValue (optional) Default value to use if the required variable is not available
 * @throws Error if the variable is not available and no default value was provided
 */
export function getEnvironmentVariable(variableName: string, defaultValue?: string): string {
  config();

  const variableValue = process.env[variableName];
  if (!variableValue && !defaultValue) {
    throw new Error(`Could not load environment variable ${variableName}!`);
  }

  return variableValue ?? defaultValue ?? "";
}

/**
 * Reads the indicators.json content to an object.
 * The path is dynamic based on whether this is run locally or in Github Actions (where the file
 * is passed from the preceding job).
 * @returns plain object containing the indicators data.
 */
export function getIndicatorsJsonData(): object {
  const runningLocally = getEnvironmentVariable('RUNNING_BUILD_LOCALLY', 'false');
  const jsonFilePath = runningLocally ? path.resolve(__dirname, '../../assets/indicators.json') : '/tmp/workflow/assets/indicators.json';

  return JSON.parse(readFileSync(jsonFilePath, 'utf-8'));
}

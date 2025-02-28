import { config } from 'dotenv';

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




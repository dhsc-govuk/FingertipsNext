import { config } from "dotenv";

export function getEnvironmentVariable(variableName: string): string {
  config();

  const variableValue = process.env[variableName];

  if (!variableValue) {
    throw new Error(`Could not load environment variable ${variableName}!`);
  }

  return variableValue;
}

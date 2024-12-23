export function getEnvironmentVariable(variableName: string): string {
  const variableValue = process.env[variableName];

  if (!variableValue) {
    throw new Error(`Could not load environment variable ${variableName}!`);
  }

  return variableValue;
}

import { env } from 'process';
import { EnvironmentVariables } from '@/EnvironmentVariables';

function missingVar(varName: string): never {
  throw new Error(`Env var '${varName}' needs to be defined`);
}

export function readEnvVar(varName: EnvironmentVariables): string {
  return env[varName] ?? missingVar(varName);
}

export function tryReadEnvVar(
  varName: EnvironmentVariables
): string | undefined {
  // Explictly returning undefined to block an empty string. This keeps the behaviour equivalent to readEnvVar.
  return env[varName] || undefined;
}

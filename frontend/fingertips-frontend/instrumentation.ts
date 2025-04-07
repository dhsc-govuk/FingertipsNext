import {tryReadEnvVar} from "@/lib/envUtils";
import EnvironmentVariables from "@/EnvironmentVariables";

const startMockServer = async () => {
  if (
      tryReadEnvVar(EnvironmentVariables.NEXT_RUNTIME) === 'nodejs' &&
      tryReadEnvVar(EnvironmentVariables.MOCK_SERVER) === 'true'
  ) {
    const { server } = await import('./mock/server/node');
    server.listen({
      onUnhandledRequest: 'bypass',
    });
  }
};

export async function register() {
  if (tryReadEnvVar(EnvironmentVariables.NEXT_RUNTIME) === 'nodejs') {
    if (tryReadEnvVar(EnvironmentVariables.APPLICATIONINSIGHTS_CONNECTION_STRING)) {
      console.log('** Application Insights Enabled - Configuring Telemetry **');
      await import('./instrumentation.node');
    } else {
      console.log(
        '** Application Insights Connection String missing - monitoring disabled **'
      );
    }
  }
  await startMockServer();
}

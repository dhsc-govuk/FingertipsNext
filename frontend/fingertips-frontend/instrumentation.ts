/* eslint-disable @typescript-eslint/no-require-imports */
const startMockServer = async () => {
  if (
    process.env.NEXT_RUNTIME === 'nodejs' &&
    process.env.MOCK_SERVER === 'true'
  ) {
    const { server } = await import('./mock/server/node');
    server.listen({
      onUnhandledRequest: 'bypass',
    });
  }
};

const configureApplicationInsights = async () => {
  console.log('Configuring logging');

  if (process.env.NEXT_RUNTIME === 'nodejs') {
    if (process.env.APPLICATIONINSIGHTS_CONNECTION_STRING) {
      const { useAzureMonitor } = await import('@azure/monitor-opentelemetry');

      // eslint-disable-next-line react-hooks/rules-of-hooks
      useAzureMonitor();

      console.log('Application Insights monitoring enabled');
    } else {
      console.log(
        '** Application Insights Connection String missing - monitoring disabled **'
      );
    }
  }
};

const configureTracing = async () => {
  if (process.env.NEXT_RUNTIME === 'nodejs') {
    const opentelemetry = require('@opentelemetry/sdk-node');
    const {
      UndiciInstrumentation,
    } = require('@opentelemetry/instrumentation-undici');
    const { SimpleSpanProcessor } = require('@opentelemetry/sdk-trace-node');
    const { Resource } = require('@opentelemetry/resources');
    const {
      ATTR_SERVICE_NAME,
    } = require('@opentelemetry/semantic-conventions');

    const spanProcessor = new SimpleSpanProcessor();
    const instrumentation = new UndiciInstrumentation();

    const sdk = new opentelemetry.NodeSDK({
      resource: new Resource({
        [ATTR_SERVICE_NAME]: 'ftn_fe',
      }),
      traceExporter: undefined,
      spanProcessors: [spanProcessor],
      instrumentations: [instrumentation],
    });

    sdk.start();
  }
};

export async function register() {
  configureApplicationInsights();
  configureTracing();
  await startMockServer();
}

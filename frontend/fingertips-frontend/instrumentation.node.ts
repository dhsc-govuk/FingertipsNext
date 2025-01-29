const startMockServer = async () => {
  if (process.env.MOCK_SERVER === 'true') {
    const { server } = await import('./mock/server/node');
    server.listen({
      onUnhandledRequest: 'bypass',
    });
  }
};

let telemetryInitialized = false;

const configureApplicationInsights = async () => {
  console.log('Configuring logging');

  if (process.env.APPLICATIONINSIGHTS_CONNECTION_STRING) {
    const { useAzureMonitor, AzureMonitorOpenTelemetryOptions  } = await require('@azure/monitor-opentelemetry');

    const options: typeof AzureMonitorOpenTelemetryOptions = {
      azureMonitorExporterOptions: {
          connectionString:
              process.env["APPLICATIONINSIGHTS_CONNECTION_STRING"]
      },
      enableLiveMetrics: false
    };

    if (!telemetryInitialized) {
      useAzureMonitor(options);
      telemetryInitialized = true;
      console.log('Application Insights monitoring enabled');
    }
  } else {
    console.log('** Application Insights Connection String missing - monitoring disabled **');
  }
};

const configureTracing = async () => {
  if (!telemetryInitialized) {
    const { NodeSDK } = require('@opentelemetry/sdk-node');
    const { UndiciInstrumentation } = require('@opentelemetry/instrumentation-undici');
    const { SimpleSpanProcessor } = require('@opentelemetry/sdk-trace-node');
    const { Resource } = require('@opentelemetry/resources');
    const { SEMRES_ATTR_SERVICE_NAME } = require('@opentelemetry/semantic-conventions');

    const spanProcessor = new SimpleSpanProcessor();
    const instrumentation = new UndiciInstrumentation();

    const sdk = new NodeSDK({
      resource: new Resource({
        [SEMRES_ATTR_SERVICE_NAME]: 'ftn_fe',
      }),
      traceExporter: null,
      spanProcessors: [spanProcessor],
      instrumentations: [instrumentation],
    });

    sdk.start();
    telemetryInitialized = true;
    console.log('OpenTelemetry tracing initialized');
  }
};

(async () => {
  await configureApplicationInsights();
  await configureTracing();
  await startMockServer();
})();

export {};
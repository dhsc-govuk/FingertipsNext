import {
  useAzureMonitor,
  AzureMonitorOpenTelemetryOptions,
} from '@azure/monitor-opentelemetry';
import { Resource } from '@opentelemetry/resources';
import { ATTR_SERVICE_NAME } from '@opentelemetry/semantic-conventions';

export const configureAzureMonitor = () => {
  if (process.env.APPLICATIONINSIGHTS_CONNECTION_STRING) {
    console.log('Configuring Azure Monitor logging');

    const options: AzureMonitorOpenTelemetryOptions = {
      azureMonitorExporterOptions: {
        connectionString: process.env['APPLICATIONINSIGHTS_CONNECTION_STRING'],
      },
      enableLiveMetrics: true,
      resource: customResource,
      instrumentationOptions: {
        http: { enabled: true },
      },
    };

    const sdk = new NodeSDK({
      customResource: new Resource({
        [ATTR_SERVICE_NAME]: 'fingertips-frontend',
      }),

      useAzureMonitor(options);
      console.log('Application Insights monitoring enabled');
    });
  } else {
    console.log(
      '** Application Insights Connection String missing - monitoring disabled **'
    );
  }
};

/**
 * Registers application instrumentation.
 */
export const register = async () => {
  configureAzureMonitor();
};

  // Initialize OpenTelemetry SDK
  const sdk = new NodeSDK({
    resource: new Resource({
      [ATTR_SERVICE_NAME]: 'nextjs-backend',
    }),
    spanProcessors,
  });

  sdk.start();
import {
  useAzureMonitor,
  AzureMonitorOpenTelemetryOptions,
} from '@azure/monitor-opentelemetry';
import { Resource } from '@opentelemetry/resources';
import { ATTR_SERVICE_NAME } from '@opentelemetry/semantic-conventions';

/**
 * Configures Azure Monitor for Application Insights.
 */
export const configureAzureMonitor = () => {
  if (process.env.APPLICATIONINSIGHTS_CONNECTION_STRING) {
    console.log('Configuring Azure Monitor logging');

    const customResource = new Resource({
      [ATTR_SERVICE_NAME]: 'fingertips-frontend',
    });

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

    useAzureMonitor(options);
    console.log('Application Insights monitoring enabled');
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

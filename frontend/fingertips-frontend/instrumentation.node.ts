import { useAzureMonitor } from '@azure/monitor-opentelemetry';
import { Resource } from '@opentelemetry/resources';
import { type ProxyTracerProvider, metrics, trace } from '@opentelemetry/api';
import { registerInstrumentations } from '@opentelemetry/instrumentation';
import { ATTR_SERVICE_NAME } from '@opentelemetry/semantic-conventions';
import type { IncomingMessage } from 'node:http';
import { HttpInstrumentation, type HttpInstrumentationConfig } from '@opentelemetry/instrumentation-http';

export const configureAzureMonitor = () => {
  if (process.env.APPLICATIONINSIGHTS_CONNECTION_STRING) {
    console.log('Configuring Azure Monitor logging');

    const customResource = new Resource({
      [ATTR_SERVICE_NAME]: 'fingertips-frontend',
    });

    useAzureMonitor({
      resource: customResource,
      azureMonitorExporterOptions: {
        connectionString: process.env['APPLICATIONINSIGHTS_CONNECTION_STRING'],
      },
      instrumentationOptions: {
        http: { enabled: true },
      },
    })

    const httpInstrumentationConfig: HttpInstrumentationConfig = {
      enabled: true,
      ignoreIncomingRequestHook: (request: IncomingMessage) => {
        // Ignore OPTIONS incoming requests
        if (request.method === 'OPTIONS') {
          return true;
        }
        return false;
      },
    };

    const instrumentations = [
      new HttpInstrumentation(httpInstrumentationConfig)
    ];

    const tracerProvider = (trace.getTracerProvider() as ProxyTracerProvider).getDelegate();
    const meterProvider = metrics.getMeterProvider();

    registerInstrumentations({
      tracerProvider: tracerProvider,
      meterProvider: meterProvider,
      instrumentations: instrumentations,
    });

  } else {
    console.log(
      '** Application Insights Connection String missing - monitoring disabled **'
    );
  }
};
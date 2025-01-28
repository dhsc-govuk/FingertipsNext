import { Resource } from '@opentelemetry/resources';
import { NodeSDK } from '@opentelemetry/sdk-node';
import { SimpleSpanProcessor } from '@opentelemetry/sdk-trace-node';
import { ATTR_SERVICE_NAME } from '@opentelemetry/semantic-conventions';
import { AzureMonitorTraceExporter } from '@azure/monitor-opentelemetry-exporter';

const traceExporter = new AzureMonitorTraceExporter({
  connectionString: process.env.APPLICATIONINSIGHTS_CONNECTION_STRING,
});

const sdk = new NodeSDK({
  resource: new Resource({
    [ATTR_SERVICE_NAME]: 'ftn_fe',
  }),
  spanProcessor: new SimpleSpanProcessor(traceExporter),
});
sdk.start();

console.log('Tracing configured and sending data to Application Insights');

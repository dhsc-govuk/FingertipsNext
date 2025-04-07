/* eslint-disable react-hooks/rules-of-hooks */
import {
  useAzureMonitor,
  AzureMonitorOpenTelemetryOptions,
} from '@azure/monitor-opentelemetry';
import { Resource } from '@opentelemetry/resources';
import { ATTR_SERVICE_NAME } from '@opentelemetry/semantic-conventions';
import { ATTR_SERVICE_NAMESPACE } from '@opentelemetry/semantic-conventions/incubating';
import { LogRecord, LogRecordProcessor } from '@opentelemetry/sdk-logs';
import { Context, trace } from '@opentelemetry/api';

class ConsoleLogRecordProcessor implements LogRecordProcessor {
  forceFlush(): Promise<void> {
    return Promise.resolve();
  }
  shutdown(): Promise<void> {
    return Promise.resolve();
  }
  onEmit(logRecord: LogRecord, context: Context): void {
    const currentSpan = trace.getSpan(context);
    const traceId = currentSpan ? currentSpan.spanContext().traceId : 'none';
    const enrichedAttributes = { ...logRecord.attributes, 'trace.id': traceId };
    console.log('Log record:', {
      ...logRecord,
      attributes: enrichedAttributes,
    });
  }
}

const customResource = new Resource({
  [ATTR_SERVICE_NAME]: 'frontend',
  [ATTR_SERVICE_NAMESPACE]: 'fingertips',
});

const options: AzureMonitorOpenTelemetryOptions = {
  azureMonitorExporterOptions: {
    connectionString: process.env.APPLICATIONINSIGHTS_CONNECTION_STRING,
  },
  resource: customResource,
  logRecordProcessors: [new ConsoleLogRecordProcessor()],
};

useAzureMonitor(options);

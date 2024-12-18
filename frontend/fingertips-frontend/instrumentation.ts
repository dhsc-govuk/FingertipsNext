const startMockServer = async () => {
  if (
    process.env.NEXT_RUNTIME === 'nodejs' &&
    process.env.MOCK_SERVER === 'true'
  ) {
    const { server } = await import('./mock/server/node');
    server.listen();
  }
};

const configureApplicationInsights = () => {

  console.log('Configuring logging');

  if (process.env.NEXT_RUNTIME === 'nodejs') {

    if (process.env.APPLICATIONINSIGHTS_CONNECTION_STRING) {

      const { useAzureMonitor } = require('@azure/monitor-opentelemetry');

      useAzureMonitor();
      console.log('Application Insights monitoring enabled');

    } else {

      console.log('** Application Insights Connection String missing - monitoring disabled **');
    }
  }
}

export async function register() {

  configureApplicationInsights();
  await startMockServer();
}

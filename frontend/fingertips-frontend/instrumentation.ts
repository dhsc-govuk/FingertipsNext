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

export async function register() {
  configureApplicationInsights();
  await startMockServer();
}

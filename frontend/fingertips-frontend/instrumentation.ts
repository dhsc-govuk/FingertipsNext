export function register() {
  if (process.env.NEXT_RUNTIME === 'nodejs') {
    import('./instrumentation.node')
      .then(({ configureAzureMonitor }) => configureAzureMonitor())
      .catch((err) => console.error('Error loading OpenTelemetry:', err));
  }
}
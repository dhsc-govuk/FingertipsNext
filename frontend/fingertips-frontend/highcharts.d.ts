declare module 'highcharts' {
  export * from 'node_modules/highcharts';

  export const Templating: {
    // eslint-disable-next-line @typescript-eslint/no-explicit-any
    helpers: Record<string, (...args: any[]) => unknown>;
  };
}

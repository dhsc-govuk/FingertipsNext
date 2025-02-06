import _Highcharts from 'highcharts';

declare module 'highcharts' {
  export * from 'highcharts';

  export const Templating: {
    helpers: Record<string, (...args: number[]) => unknown>;
  };
}

// eslint-disable-next-line @typescript-eslint/no-unused-vars
import Highcharts from 'highcharts';

declare module 'highcharts' {
  export * from 'highcharts';

  export const Templating: {
    // eslint-disable-next-line @typescript-eslint/no-explicit-any
    helpers: Record<string, (...args: any[]) => unknown>;
  };
}

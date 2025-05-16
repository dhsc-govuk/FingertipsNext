import Highcharts from 'highcharts';
import { Dispatch, SetStateAction } from 'react';

export enum LineChartVariant {
  Standard = 'standard',
  Inequalities = 'inequalities',
}

// MUTATES the lineChartOptions add functions to series events
// that call a React state change and set the visibility of
// linkedTo series to match that set in the state.
// Normally we'd avoid mutation, but HighCharts seems to work well this way
// and this is a simple way to connect React state with HighCharts events
export const addShowHideLinkedSeries = (
  lineChartOptions: Highcharts.Options,
  showConfidenceIntervalsData: boolean,
  visibility: Record<string, boolean>,
  setVisibility: Dispatch<SetStateAction<Record<string, boolean>>>
) => {
  lineChartOptions?.series?.forEach((series) => {
    series.events ??= {};
    if ('linkedTo' in series && series.linkedTo) {
      series.visible =
        showConfidenceIntervalsData && visibility[series.linkedTo];
    }
    series.events.show = function () {
      const id = series.id ?? series.name;
      setVisibility({ ...visibility, [id as string]: true });
    };
    series.events.hide = function () {
      const id = series.id ?? series.name;
      setVisibility({ ...visibility, [id as string]: false });
    };
  });
};

import Highcharts from 'highcharts';

export const svgStringFromChartOptions = (
  options: Highcharts.Options
): string => {
  const container = document.createElement('div');
  container.style.display = 'none';
  document.body.appendChild(container);

  // type issue with mapChart existing (or not) on the Highcharts object - it does
  // maybe because the loading of highcharts modules is done before this code is executed
  const constructor = options.mapView
    ? // eslint-disable-next-line @typescript-eslint/ban-ts-comment
      // @ts-expect-error
      Highcharts.mapChart
    : Highcharts.chart;

  const chart = constructor(container, options);
  const svg = chart.getSVG();

  chart.destroy();
  document.body.removeChild(container);

  return svg;
};

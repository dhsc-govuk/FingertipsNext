export const getPlotline = (
  benchmarkLabel?: string,
  benchmarkValue?: number
): Highcharts.YAxisPlotLinesOptions => ({
  color: 'black',
  width: 2,
  value: benchmarkValue,
  zIndex: 5,
  label: {
    text: benchmarkLabel,
    align: 'center',
    rotation: 0,
    y: -10,
    style: {
      color: 'black',
      fontWeight: 'bold',
    },
  },
});

export const barChartDefaultOptions: Highcharts.Options = {
  credits: {
    enabled: false,
  },
  chart: {
    type: 'bar',
    height: '50%',
    spacingTop: 20,
    spacingBottom: 50,
    animation: false,
  },
  title: {
    style: {
      display: 'none',
    },
  },
  xAxis: {
    lineWidth: 0,
  },
  plotOptions: {
    bar: {
      dataLabels: {
        enabled: true,
      },
      pointPadding: 0.3,
      groupPadding: 0,
    },
  },
  legend: {
    enabled: false,
  },
  accessibility: {
    enabled: false,
  },
  tooltip: {
    format:
      '<b>{point.category}</b><br/><br/><span style="color:{color}">\u25CF</span> Value {point.y}',
  },
};

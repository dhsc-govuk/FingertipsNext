import Highcharts from 'highcharts';
import { formatNumber } from '@/lib/numberFormatter';
import { SymbolsEnum } from '@/lib/chartHelpers/pointFormatterHelper';

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
    y: -5,
    style: {
      color: 'black',
      fontWeight: 'bold',
      fontSize: '16',
    },
  },
});

function tooltipFormatter(point: Highcharts.Point): string {
  return `<b>${point.category}</b><br/><br/><span style="color:${point.color}">${SymbolsEnum.Circle}</span> Value ${formatNumber(point.y)}`;
}

export const barChartDefaultOptions: Highcharts.Options = {
  credits: {
    enabled: false,
  },
  chart: { type: 'bar', height: '50%', spacingTop: 20, spacingBottom: 50 },
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
    formatter: function (this: Highcharts.Point): string {
      return tooltipFormatter(this);
    },
  },
};

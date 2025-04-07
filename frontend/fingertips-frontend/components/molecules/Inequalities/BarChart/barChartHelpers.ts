import { SymbolNames } from '@/lib/chartHelpers/pointFormatterHelper';
import Highcharts from 'highcharts';

const AXIS_TITLE_FONT_SIZE = 19;
const AXIS_LABEL_FONT_SIZE = 16;

const getPlotline = (
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

export const getBarChartOptions = (options: {
  height?: string | number;
  xAxisTitleText?: string;
  xAxisCategories?: string[];
  yAxisTitleText?: string;
  yAxisMax?: string | number;
  plotLineLabel?: string;
  plotLineValue?: number;
  seriesData: Highcharts.SeriesOptionsType[];
  tooltipAreaName: string;
  tooltipPointFormatter: Highcharts.FormatterCallbackFunction<Highcharts.Point>;
}): Highcharts.Options => {
  return {
    credits: {
      enabled: false,
    },
    chart: {
      type: 'bar',
      height: options.height ?? '50%',
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
      labels: {
        style: {
          fontSize: AXIS_LABEL_FONT_SIZE,
        },
      },
      title: {
        text: options.xAxisTitleText,
        style: {
          fontSize: AXIS_TITLE_FONT_SIZE,
        },
        margin: 20,
      },
      categories: options.xAxisCategories,
    },
    yAxis: {
      title: {
        text: options.yAxisTitleText,
        style: {
          fontSize: AXIS_TITLE_FONT_SIZE,
        },
        margin: 20,
      },
      labels: {
        style: {
          fontSize: AXIS_LABEL_FONT_SIZE,
        },
      },
      max: options.yAxisMax,
      plotLines: [
        {
          ...getPlotline(options.plotLineLabel, options.plotLineValue),
          events: {
            mouseover: function (
              this: Highcharts.PlotLineOrBand,
              e: Highcharts.PointerEventObject
            ) {
              const context = { ...this };
              const axis = context.axis;
              const series = axis.series[0];
              const chart = series.chart;
              const tooltip = chart.tooltip;

              if (!series || !tooltip) return;

              const normalizedEvent = chart.pointer.normalize(e);
              const plotlineOptions =
                context.options as Highcharts.AxisPlotLinesOptions;

              const point = {
                series: series,
                color: 'black',
                graphic: { symbolName: SymbolNames.PlotLine },
                category: 'Persons',
                x: 'PlotLine',
                y: plotlineOptions.value,
                plotX: normalizedEvent.chartX - chart.plotLeft,
                plotY: normalizedEvent.chartY - chart.plotTop,
                tooltipPos: [
                  normalizedEvent.chartX - chart.plotLeft,
                  normalizedEvent.chartY - chart.plotTop,
                ],
              } as unknown as Highcharts.Point;

              tooltip.update({ shape: 'rect' });
              tooltip.refresh(point);
            } as Highcharts.EventCallbackFunction<Highcharts.PlotLineOrBand>,
            mouseout: function (this: Highcharts.PlotLineOrBand) {
              const context = { ...this };
              const chart = context.axis.chart;
              chart.tooltip.hide();
              chart.tooltip.update({ shape: 'callout' });
            },
          },
        },
      ],
    },
    series: options.seriesData,
    plotOptions: {
      bar: {
        pointPadding: 0.3,
      },
      series: {
        animation: false,
      },
    },
    legend: {
      enabled: false,
    },
    accessibility: {
      enabled: false,
    },
    tooltip: {
      headerFormat: `<span style="font-weight: bold">${options.tooltipAreaName}</span><br/>`,
      useHTML: true,
      pointFormatter: options.tooltipPointFormatter,
    },
  };
};

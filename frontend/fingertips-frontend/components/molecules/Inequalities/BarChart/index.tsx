import HighchartsReact from 'highcharts-react-official';
import Highcharts from 'highcharts';
import {
  getAggregatePointInfo,
  InequalitiesBarChartData,
  InequalitiesTypes,
} from '@/components/organisms/Inequalities/inequalitiesHelpers';
import {
  barChartDefaultOptions,
  getPlotline,
} from '@/components/molecules/Inequalities/BarChart/barChartHelpers';
import { pointFormatterHelper } from '@/lib/chartHelpers/pointFormatterHelper';
import { BenchmarkLabelType } from '@/components/organisms/BenchmarkLabel/BenchmarkLabelTypes';
import { BenchmarkLegend } from '@/components/organisms/BenchmarkLegend';
import { getBenchmarkColour } from '@/lib/chartHelpers/chartHelpers';

interface InequalitiesBarChartProps {
  barChartData: InequalitiesBarChartData;
  yAxisLabel: string;
  benchmarkValue?: number;
  type?: InequalitiesTypes;
  measurementUnit?: string;
  areasSelected?: string[];
}

const mapToXAxisTitle: Record<InequalitiesTypes, string> = {
  [InequalitiesTypes.Sex]: 'Sex',
  [InequalitiesTypes.Deprivation]: 'Deprivation deciles',
};

const getMaxValue = (values: (number | undefined)[]) =>
  Math.max(...values.filter((number) => number !== undefined));

const generateInequalitiesBarChartTooltipList = (
  point: Highcharts.Point,
  symbol: string
) => [
  `<div style="display: flex; margin-top: 7px; align-items: center;"><div style="margin-right: 10px;">
  <span style="color: ${point.color}; font-weight: bold;">${symbol}</span></div>`,
  `<div><span>${point.category}</br>Value: ${point.y}`,
];

export function InequalitiesBarChart({
  barChartData,
  yAxisLabel,
  measurementUnit,
  type = InequalitiesTypes.Sex,
}: Readonly<InequalitiesBarChartProps>) {
  const xAxisTitlePrefix = 'Inequality type:';
  const { inequalities } = barChartData.data;
  const { benchmarkValue, inequalityDimensions: barChartFields } =
    getAggregatePointInfo(inequalities);

  // for sex inequality we always want Male, Female which is reverse alphabetical order
  // pending a better solution where an order key is supplied by API
  if (type === InequalitiesTypes.Sex) barChartFields.reverse();

  const yAxisMaxValue = getMaxValue([
    ...barChartFields.map((field) => inequalities[field]?.value),
    benchmarkValue,
  ]);

  const seriesData: Highcharts.SeriesOptionsType[] = [
    {
      type: 'bar',
      data: barChartFields.map((field) => {
        const color = getBenchmarkColour(
          inequalities[field]?.benchmarkComparison
            ?.outcome as BenchmarkLabelType
        );
        return {
          name: field,
          y: inequalities[field]?.value,
          color,
        };
      }),
    },
  ];

  const barChartOptions: Highcharts.Options = {
    ...barChartDefaultOptions,
    xAxis: {
      ...barChartDefaultOptions.xAxis,
      title: {
        text: `${xAxisTitlePrefix} ${mapToXAxisTitle[type]}`,
        margin: 20,
      },
      categories: barChartFields,
    },
    yAxis: {
      title: {
        text: `${yAxisLabel}${measurementUnit ? ': ' + measurementUnit : ''}`,
        margin: 20,
      },
      max: yAxisMaxValue + 0.2 * yAxisMaxValue,
      plotLines: [
        {
          ...getPlotline(`${barChartData.areaName} persons`, benchmarkValue),
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
                graphic: { symbolName: 'plot-line' },
                category: 'Persons',
                x: 'PlotLine',
                y: plotlineOptions.value,
                plotX: normalizedEvent.chartX - chart.plotLeft,
                plotY: normalizedEvent.chartY - chart.plotTop,
                tooltipPos: [normalizedEvent.chartX, normalizedEvent.chartY],
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
    series: seriesData,
    plotOptions: {
      bar: {
        pointPadding: 0.3,
      },
    },
    tooltip: {
      headerFormat: `<span style="font-weight: bold">${barChartData.areaName}</span><br/>`,
      useHTML: true,
      pointFormatter: function (this: Highcharts.Point) {
        return (
          pointFormatterHelper(this, generateInequalitiesBarChartTooltipList) +
          `${measurementUnit ? ' ' + measurementUnit : ''}`
        );
      },
    },
  };

  return (
    <div data-testid="inequalitiesBarChart-component">
      <BenchmarkLegend rag />
      <HighchartsReact
        containerProps={{
          'data-testid': 'highcharts-react-component-inequalitiesBarChart',
        }}
        highcharts={Highcharts}
        options={barChartOptions}
      />
    </div>
  );
}

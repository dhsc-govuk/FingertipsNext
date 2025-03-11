import HighchartsReact from 'highcharts-react-official';
import Highcharts from 'highcharts';
import {
  InequalitiesTypes,
  InequalitiesBarChartData,
  Sex,
} from '@/components/organisms/Inequalities/inequalitiesHelpers';
import {
  barChartDefaultOptions,
  getPlotline,
} from '@/components/organisms/BarChart/barChartHelpers';
import { pointFormatterHelper } from '@/lib/chartHelpers/pointFormatterHelper';

interface InequalitiesBarChartProps {
  barChartData: InequalitiesBarChartData;
  dynamicKeys: string[];
  benchmarkColumnValue?: number;
  yAxisLabel: string;
  type?: InequalitiesTypes;
}

const mapToYAxisTitle: Record<InequalitiesTypes, string> = {
  [InequalitiesTypes.Sex]: 'Sex',
  [InequalitiesTypes.Deprivation]: 'Deprivation deciles',
};

const mapToGetBarChartKeys: Record<
  InequalitiesTypes,
  (keys: string[]) => string[]
> = {
  [InequalitiesTypes.Sex]: (keys: string[]) =>
    keys.filter((key) => key !== Sex.PERSONS),
  [InequalitiesTypes.Deprivation]: (keys: string[]) => keys,
};

const mapToBenchMarkLabel: Record<
  InequalitiesTypes,
  (areaName: string) => string
> = {
  [InequalitiesTypes.Sex]: (areaName: string) => `${areaName} persons`,
  [InequalitiesTypes.Deprivation]: (_: string) => `England`,
};

const getMaxValue = (values: (number | undefined)[]) =>
  Math.max(...values.filter((number) => number !== undefined));

const generateInequalitiesBarChartTooltipList = (
  point: Highcharts.Point,
  symbol: string
) => [
  `<div style="display: flex; margin-top: 7px; align-items: center;"><div style="margin-right: 10px;">
  <span style="color: ${point.color}; font-weight: bold;">${symbol}</span></div>`,
  `<div><span>${point.category}</br>Value: ${point.y}</span></div></div>`,
];

export function InequalitiesBarChart({
  barChartData,
  dynamicKeys,
  yAxisLabel,
  benchmarkColumnValue = undefined,
  type = InequalitiesTypes.Sex,
}: Readonly<InequalitiesBarChartProps>) {
  const yAxisTitlePrefix = 'Inequality type:';

  const barChartFields = mapToGetBarChartKeys[type](dynamicKeys);

  const yAxisMaxValue = getMaxValue([
    ...barChartFields.map(
      (field) => barChartData.data.inequalities[field]?.value
    ),
    benchmarkColumnValue,
  ]);

  const seriesData: Highcharts.SeriesOptionsType[] = [
    {
      type: 'bar',
      data: barChartFields.map((field) => ({
        name: field,
        y: barChartData.data.inequalities[field]?.value,
      })),
    },
  ];

  const barChartOptions: Highcharts.Options = {
    ...barChartDefaultOptions,
    xAxis: {
      ...barChartDefaultOptions.xAxis,
      title: {
        text: `${yAxisTitlePrefix} ${mapToYAxisTitle[type]}`,
        margin: 20,
      },
      categories: barChartFields,
    },
    yAxis: {
      title: { text: yAxisLabel, margin: 20 },
      max: yAxisMaxValue + 0.2 * yAxisMaxValue,
      plotLines: [
        {
          ...getPlotline(
            mapToBenchMarkLabel[type](barChartData.areaName),
            benchmarkColumnValue
          ),
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

              tooltip.refresh(point);
            } as Highcharts.EventCallbackFunction<Highcharts.PlotLineOrBand>,
            mouseout: function (this: Highcharts.PlotLineOrBand) {
              const context = { ...this };
              context.axis.chart.tooltip.hide();
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
        return pointFormatterHelper(
          this,
          generateInequalitiesBarChartTooltipList
        );
      },
    },
  };

  return (
    <div data-testid="inequalitiesBarChart-component">
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

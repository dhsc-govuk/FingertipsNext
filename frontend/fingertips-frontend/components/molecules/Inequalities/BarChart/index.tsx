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
import { BenchmarkLegend } from '@/components/organisms/BenchmarkLegend';
import { ConfidenceIntervalCheckbox } from '../../ConfidenceIntervalCheckbox';
import { useEffect, useState } from 'react';
import {
  generateConfidenceIntervalSeries,
  getBenchmarkColour,
  loadHighchartsModules,
} from '@/lib/chartHelpers/chartHelpers';
import {
  BenchmarkComparisonMethod,
  BenchmarkOutcome,
  IndicatorPolarity,
} from '@/generated-sources/ft-api-client';

interface InequalitiesBarChartProps {
  barChartData: InequalitiesBarChartData;
  yAxisLabel: string;
  type?: InequalitiesTypes;
  measurementUnit?: string;
  benchmarkComparisonMethod?: BenchmarkComparisonMethod;
  polarity?: IndicatorPolarity;
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
  benchmarkComparisonMethod = BenchmarkComparisonMethod.Unknown,
  polarity = IndicatorPolarity.Unknown,
}: Readonly<InequalitiesBarChartProps>) {
  const xAxisTitlePrefix = 'Inequality type:';
  const { inequalities } = barChartData.data;
  const { benchmarkValue, inequalityDimensions: barChartFields } =
    getAggregatePointInfo(inequalities);
  const [showConfidenceIntervalsData, setShowConfidenceIntervalsData] =
    useState<boolean>(false);
  const [options, setOptions] = useState<Highcharts.Options>();

  // for sex inequality we always want Male, Female which is reverse alphabetical order
  // pending a better solution where an order key is supplied by API
  if (type === InequalitiesTypes.Sex) barChartFields.reverse();

  const yAxisMaxValue = getMaxValue([
    ...barChartFields.map((field) => inequalities[field]?.value),
    benchmarkValue,
  ]);

  const comparedTo = `${barChartData.areaName} persons`;

  const seriesData: Highcharts.SeriesOptionsType[] = [
    {
      type: 'bar',
      data: barChartFields.map((field) => {
        const color = getBenchmarkColour(
          benchmarkComparisonMethod,
          inequalities[field]?.benchmarkComparison?.outcome as BenchmarkOutcome,
          polarity
        );
        return {
          name: field,
          y: inequalities[field]?.value,
          color,
        };
      }),
    },
    generateConfidenceIntervalSeries(
      barChartData.areaName,
      barChartFields.map((field) => [
        inequalities[field]?.lower,
        inequalities[field]?.upper,
      ]),
      showConfidenceIntervalsData
    ),
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
          ...getPlotline(comparedTo, benchmarkValue),
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

  useEffect(() => {
    loadHighchartsModules(() => {
      setOptions(barChartOptions);
    });
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [showConfidenceIntervalsData]);

  if (!options) {
    return null;
  }

  return (
    <div data-testid="inequalitiesBarChart-component">
      <BenchmarkLegend
        title={`Compared to ${comparedTo}`}
        benchmarkComparisonMethod={benchmarkComparisonMethod}
        polarity={polarity}
      />
      <ConfidenceIntervalCheckbox
        chartName="inequalitiesBarChart"
        showConfidenceIntervalsData={showConfidenceIntervalsData}
        setShowConfidenceIntervalsData={setShowConfidenceIntervalsData}
      ></ConfidenceIntervalCheckbox>
      <HighchartsReact
        containerProps={{
          'data-testid': 'highcharts-react-component-inequalitiesBarChart',
        }}
        highcharts={Highcharts}
        options={options}
      />
    </div>
  );
}

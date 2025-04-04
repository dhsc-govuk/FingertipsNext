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
import {
  pointFormatterHelper,
  SymbolNames,
} from '@/lib/chartHelpers/pointFormatterHelper';
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
import { formatNumber } from '@/lib/numberFormatter';

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

const generateInequalitiesBarChartTooltipForPoint = (
  point: Highcharts.Point,
  symbol: string
) => [
  `<div style="display: flex; margin-top: 7px; align-items: center;"><div style="margin-right: 10px;">
  <span style="color: ${point.color}; font-weight: bold;">${symbol}</span></div>`,
  `<div><span>${point.category}</br>Value: ${formatNumber(point.y)}`,
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

  // For sex inequality we always want Male, Female which is reverse alphabetical order
  // pending a better solution where an order key is supplied by API
  if (type === InequalitiesTypes.Sex) barChartFields.reverse();

  const yAxisMaxValue = getMaxValue([
    ...barChartFields.map((field) => inequalities[field]?.value),
    benchmarkValue,
  ]);

  const timePeriod = barChartData.data.period;
  const comparedTo = `${barChartData.areaName}`;

  const seriesData: Highcharts.SeriesOptionsType[] = [
    {
      type: 'bar',
      data: barChartFields.map((field) => {
        const color = getBenchmarkColour(
          benchmarkComparisonMethod,
          inequalities[field]?.benchmarkComparison?.outcome as BenchmarkOutcome,
          polarity
        );
        const point: Highcharts.PointOptionsObject = {
          name: field,
          y: inequalities[field]?.value,
          color,
        };
        if (color) return point;

        // we can't have a high chart default color here
        point.color = '#fff';
        point.borderColor = '#000';
        point.borderWidth = 1;
        return point;
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

  const chartOverrides: Highcharts.ChartOptions = {
    // The deprivation chart needs more height
    height:
      type === InequalitiesTypes.Deprivation
        ? '100%'
        : barChartDefaultOptions.chart?.height,
  };

  const barChartOptions: Highcharts.Options = {
    ...barChartDefaultOptions,
    chart: { ...barChartDefaultOptions.chart, ...chartOverrides },
    xAxis: {
      ...barChartDefaultOptions.xAxis,
      title: {
        text: `${xAxisTitlePrefix} ${mapToXAxisTitle[type]}`,
        margin: 20,
        style: {
          fontSize: 19,
        },
      },
      categories: barChartFields,
    },
    yAxis: {
      title: {
        text: `${yAxisLabel}${measurementUnit ? ': ' + measurementUnit : ''}`,
        margin: 20,
        style: {
          fontSize: 19,
        },
      },
      labels: {
        style: {
          fontSize: 16,
        },
      },
      max: yAxisMaxValue + 0.2 * yAxisMaxValue,
      plotLines: [
        {
          ...getPlotline(`${comparedTo} persons`, benchmarkValue),
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
          pointFormatterHelper(
            this,
            generateInequalitiesBarChartTooltipForPoint
          ) + `${measurementUnit ? ' ' + measurementUnit : ''}`
        );
      },
    },
  };

  useEffect(() => {
    void loadHighchartsModules(() => {
      setOptions(barChartOptions);
    });
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [showConfidenceIntervalsData]);

  if (!options) {
    return null;
  }

  return (
    <div data-testid="inequalitiesBarChart-component">
      <ConfidenceIntervalCheckbox
        chartName="inequalitiesBarChart"
        showConfidenceIntervalsData={showConfidenceIntervalsData}
        setShowConfidenceIntervalsData={setShowConfidenceIntervalsData}
      />
      <BenchmarkLegend
        title={`Compared to ${comparedTo} for ${timePeriod} time period`}
        benchmarkComparisonMethod={benchmarkComparisonMethod}
        polarity={polarity}
      />
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

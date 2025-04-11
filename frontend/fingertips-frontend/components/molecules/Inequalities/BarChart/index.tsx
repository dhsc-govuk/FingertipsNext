import HighchartsReact from 'highcharts-react-official';
import Highcharts from 'highcharts';
import {
  getAggregatePointInfo,
  InequalitiesBarChartData,
  InequalitiesTypes,
} from '@/components/organisms/Inequalities/inequalitiesHelpers';
import { getBarChartOptions } from '@/components/molecules/Inequalities/BarChart/barChartHelpers';
import { pointFormatterHelper } from '@/lib/chartHelpers/pointFormatterHelper';
import { BenchmarkLegend } from '@/components/organisms/BenchmarkLegend';
import { ConfidenceIntervalCheckbox } from '../../ConfidenceIntervalCheckbox';
import { useEffect, useState } from 'react';
import {
  generateConfidenceIntervalSeries,
  getBenchmarkColour,
  getConfidenceLimitNumber,
  loadHighchartsModules,
} from '@/lib/chartHelpers/chartHelpers';
import {
  BenchmarkComparisonMethod,
  BenchmarkOutcome,
  IndicatorPolarity,
} from '@/generated-sources/ft-api-client';
import { formatNumber } from '@/lib/numberFormatter';
import { getBenchmarkLabelText } from '@/components/organisms/BenchmarkLabel';

interface InequalitiesBarChartProps {
  barChartData: InequalitiesBarChartData;
  yAxisLabel: string;
  type?: InequalitiesTypes;
  measurementUnit?: string;
  benchmarkComparisonMethod?: BenchmarkComparisonMethod;
  polarity?: IndicatorPolarity;
}

interface InequalitiesPointOptionsObject extends Highcharts.PointOptionsObject {
  benchmarkOutcome: BenchmarkOutcome;
}

export interface InequalitiesPoint extends Highcharts.Point {
  benchmarkOutcome?: BenchmarkOutcome;
}

const mapToXAxisTitle: Record<InequalitiesTypes, string> = {
  [InequalitiesTypes.Sex]: 'Sex',
  [InequalitiesTypes.Deprivation]: 'Deprivation deciles',
};

const getMaxValue = (values: (number | undefined)[]) =>
  Math.max(...values.filter((number) => number !== undefined));

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

  const generateInequalitiesBarChartTooltipForPoint = (
    point: InequalitiesPoint,
    symbol: string
  ) => {
    const mappedBenchmarkComparisonMethod = getConfidenceLimitNumber(
      benchmarkComparisonMethod
    );
    const mappedOutcome = getBenchmarkLabelText(
      point.benchmarkOutcome ?? BenchmarkOutcome.NotCompared
    );
    const notCompared = point.benchmarkOutcome === BenchmarkOutcome.NotCompared;
    const isBenchmarkPoint = point.category === 'Persons';
    let benchmarkOutcomeLabel = '';

    if (mappedOutcome === BenchmarkOutcome.Similar) {
      benchmarkOutcomeLabel = `${mappedOutcome} to England`;
    } else if (notCompared) {
      benchmarkOutcomeLabel = mappedOutcome;
    } else {
      benchmarkOutcomeLabel = `${mappedOutcome} than England`;
    }

    const symbolStyles = [
      `background-color: ${point.color}`,
      'width: 0.5em',
      'height: 0.5em',
      'display: block',
      'border-radius: 4px',
      `border: 1px solid ${point.color === '#fff' ? '#000' : point.color}`,
    ];
    const symbolItem = `<span style="${symbolStyles.join('; ')};"></span>`;

    return [
      `
      <span>${barChartData.data.period}</span>
      <div><span>${point.category}</span></div>
      <div style="display: flex; margin-top: 7px; align-items: center;"><div style="margin-right: 10px;">
      ${isBenchmarkPoint ? `<span style="color: ${point.color}; font-weight: bold;">${symbol}</span>` : symbolItem}</div>`,
      `<div><span></br>${formatNumber(point.y)} ${measurementUnit ? ' ' + measurementUnit : ''}`,
      `<div><span>${isBenchmarkPoint ? '' : benchmarkOutcomeLabel} ${isBenchmarkPoint ? '' : mappedBenchmarkComparisonMethod !== 0 ? `(${mappedBenchmarkComparisonMethod}%)` : ''}</span><div>`,
    ];
  };

  const seriesData: Highcharts.SeriesOptionsType[] = [
    {
      type: 'bar',
      data: barChartFields.map((field) => {
        const comparisonOutcome =
          inequalities[field]?.benchmarkComparison?.outcome ??
          BenchmarkOutcome.NotCompared;
        const color = getBenchmarkColour(
          benchmarkComparisonMethod,
          comparisonOutcome,
          polarity
        );
        const point: InequalitiesPointOptionsObject = {
          name: field,
          y: inequalities[field]?.value,
          color,
          benchmarkOutcome: comparisonOutcome,
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

  const barChartOptions = getBarChartOptions({
    // The deprivation chart needs more height
    height: type === InequalitiesTypes.Deprivation ? '100%' : undefined,
    xAxisTitleText: `${xAxisTitlePrefix} ${mapToXAxisTitle[type]}`,
    xAxisCategories: barChartFields,
    yAxisTitleText: `${yAxisLabel}${measurementUnit ? ': ' + measurementUnit : ''}`,
    yAxisMax: yAxisMaxValue + 0.2 * yAxisMaxValue,
    plotLineLabel: `${comparedTo} persons`,
    plotLineValue: benchmarkValue,
    seriesData: seriesData,
    tooltipAreaName: barChartData.areaName,
    tooltipPointFormatter: function (this: Highcharts.Point) {
      return pointFormatterHelper(
        this,
        generateInequalitiesBarChartTooltipForPoint
      );
    },
  });

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

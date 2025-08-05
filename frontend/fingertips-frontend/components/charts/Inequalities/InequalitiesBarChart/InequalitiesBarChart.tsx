import Highcharts from 'highcharts';
import {
  getAggregatePointInfo,
  InequalitiesBarChartData,
  InequalitiesTypes,
} from '@/components/charts/Inequalities/helpers/inequalitiesHelpers';
import { getBarChartOptions } from '@/components/charts/Inequalities/helpers/barChartHelpers';
import { pointFormatterHelper } from '@/lib/chartHelpers/pointFormatterHelper';
import { ConfidenceIntervalCheckbox } from '../../../molecules/ConfidenceIntervalCheckbox';
import { useState } from 'react';
import {
  AreaTypeLabelEnum,
  generateConfidenceIntervalSeries,
  getBenchmarkColour,
  getTooltipContent,
  createTooltipHTML,
} from '@/lib/chartHelpers/chartHelpers';
import {
  BenchmarkComparisonMethod,
  BenchmarkOutcome,
  IndicatorPolarity,
} from '@/generated-sources/ft-api-client';

import { ExportOptionsButton } from '../../../molecules/Export/ExportOptionsButton';
import { ExportOnlyWrapper } from '@/components/molecules/Export/ExportOnlyWrapper';
import { ExportCopyright } from '@/components/molecules/Export/ExportCopyright';
import { ChartTitle } from '@/components/atoms/ChartTitle/ChartTitle';
import { getMethodsAndOutcomes } from '@/components/organisms/BenchmarkLegend/benchmarkLegendHelpers';
import { BenchmarkLegends } from '@/components/organisms/BenchmarkLegend/BenchmarkLegends';
import { HighChartsWrapper } from '@/components/molecules/HighChartsWrapper/HighChartsWrapper';

interface InequalitiesBarChartProps {
  title: string;
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

// All inequality data is benchmarked against persons.
const BenchmarkCategory = 'Persons';

const mapToXAxisTitle: Record<InequalitiesTypes, string> = {
  [InequalitiesTypes.Sex]: 'Sex',
  [InequalitiesTypes.Deprivation]: 'Deprivation deciles',
};

const getMaxValue = (values: (number | undefined)[]) =>
  Math.max(...values.filter((number) => number !== undefined));

export function InequalitiesBarChart({
  title,
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

  // For sex inequality we always want Male, Female which is reverse alphabetical order
  // pending a better solution where an order key is supplied by API
  if (type === InequalitiesTypes.Sex) barChartFields.reverse();

  const yAxisMaxValue = getMaxValue([
    ...barChartFields.map((field) => inequalities[field]?.value),
    benchmarkValue,
  ]);

  const comparedTo = `${barChartData.areaName}`;

  const generateInequalitiesBarChartTooltipForPoint = (
    point: InequalitiesPoint,
    symbol: string
  ) => {
    const isBenchmarkPoint = point.category === BenchmarkCategory;
    const { benchmarkLabel, comparisonLabel } = getTooltipContent(
      point.benchmarkOutcome ?? BenchmarkOutcome.NotCompared,
      AreaTypeLabelEnum.Area,
      benchmarkComparisonMethod ?? BenchmarkComparisonMethod.Unknown,
      type === InequalitiesTypes.Sex ? barChartData.areaName : undefined
    );

    const symbolStyles = [
      `background-color: ${point.color}`,
      'width: 0.5em',
      'height: 0.5em',
      'display: block',
      'border-radius: 4px',
      `border: 1px solid ${point.color === '#fff' ? '#000' : point.color}`,
    ];
    const symbolItem = `<span style="${symbolStyles.join('; ')};"></span>`;
    const benchmarkComparisonSymbol = isBenchmarkPoint
      ? `<span style="color: ${point.color}; font-weight: bold;">${symbol}</span>`
      : symbolItem;

    return createTooltipHTML(
      {
        areaName: barChartData.areaName,
        period: barChartData.data.period,
        fieldName: point.category,
        benchmarkComparisonSymbol,
        shouldHideComparison: isBenchmarkPoint,
        benchmarkLabel,
        comparisonLabel,
      },
      point.y,
      measurementUnit
    );
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
      dataLabels: {
        enabled: true,
        formatter: function () {
          const point = this as InequalitiesPoint;
          return `${this.y} - ${point.benchmarkOutcome}`;
        },
        style: {
          color: '#000',
          fontWeight: 'normal',
          fontSize: '17px',
          textOutline: 'none',
        },
        x: 20,
      },
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
    height: type === InequalitiesTypes.Deprivation ? 800 : 400,
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

  const id = 'inequalitiesBarChart';
  const legendsToShow = getMethodsAndOutcomes([
    { benchmarkComparisonMethod, polarity },
  ]);
  return (
    <>
      <div id={id} data-testid={`${id}-component`}>
        <ChartTitle>{title}</ChartTitle>
        <ConfidenceIntervalCheckbox
          chartName="inequalitiesBarChart"
          showConfidenceIntervalsData={showConfidenceIntervalsData}
          setShowConfidenceIntervalsData={setShowConfidenceIntervalsData}
        />
        <BenchmarkLegends
          legendsToShow={legendsToShow}
          title={'Compared to persons'}
          svg
        />
        <HighChartsWrapper
          chartOptions={barChartOptions}
          testId={'highcharts-react-component-inequalitiesBarChart'}
        />
        <ExportOnlyWrapper>
          <ExportCopyright />
        </ExportOnlyWrapper>
      </div>
      <ExportOptionsButton targetId={id} chartOptions={barChartOptions} />
    </>
  );
}

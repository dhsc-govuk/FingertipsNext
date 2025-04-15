import { HealthDataForArea } from '@/generated-sources/ft-api-client';
import Highcharts, { SymbolKeyValue } from 'highcharts';
import { GovukColours } from '@/lib/styleHelpers/colours';
import { chartColours, ChartColours } from '@/lib/chartHelpers/colours';
import {
  sortHealthDataForAreasByDate,
  sortHealthDataForAreaByDate,
  generateConfidenceIntervalSeries,
  AXIS_TITLE_FONT_SIZE,
  AXIS_LABEL_FONT_SIZE,
} from '@/lib/chartHelpers/chartHelpers';
import { formatNumber } from '@/lib/numberFormatter';
import { SymbolsEnum } from '@/lib/chartHelpers/pointFormatterHelper';
import { convertYearToNonCalendarYearLabel } from '@/lib/dateHelpers/dateHelpers';
import { percentageMeasurementUnit } from '@/lib/chartHelpers/constants';

export enum LineChartVariant {
  Standard = 'standard',
  Inequalities = 'inequalities',
}

function tooltipFormatter(point: Highcharts.Point, isCalendarYearTypeIndicator: boolean = true): string {
  return `<b>${point.series.name}</b><br/>Year: ${isCalendarYearTypeIndicator ? point.x : convertYearToNonCalendarYearLabel(point.x)}<br/><br/><span style="color:${point.color}">${SymbolsEnum.Circle}</span> Value ${formatNumber(point.y)}`;
}

export const lineChartDefaultOptions: Highcharts.Options = {
  credits: {
    enabled: false,
  },
  chart: {
    type: 'line',
    spacingBottom: 50,
    spacingTop: 20,
    animation: false,
  },
  title: {
    style: {
      display: 'none',
    },
  },
  yAxis: {
    minorTickInterval: 'auto',
    minorTicksPerMajor: 2,
    labels: { style: { fontSize: AXIS_LABEL_FONT_SIZE } },
  },
  xAxis: {
    tickLength: 0,
    allowDecimals: false,
    labels: {
      style: {
        fontSize: AXIS_LABEL_FONT_SIZE,
        width: 40,
        textOverflow: 'wrap',
      },
    },
  },
  legend: {
    verticalAlign: 'top',
    align: 'left',
    itemStyle: {
      fontSize: '16px',
    },
    margin: 20,
  },
  accessibility: {
    enabled: false,
  },
  tooltip: {
    formatter: function (this: Highcharts.Point): string {
      return tooltipFormatter(this);
    },
  },
  plotOptions: {
    series: {
      animation: false,
    },
  },
};

export const chartSymbols: SymbolKeyValue[] = [
  'square',
  'triangle',
  'triangle-down',
  'circle',
  'diamond',
];

export function generateSeriesData(
  data: HealthDataForArea[],
  symbols: SymbolKeyValue[],
  chartColours: ChartColours[],
  benchmarkData?: HealthDataForArea,
  parentIndicatorData?: HealthDataForArea,
  showConfidenceIntervalsData?: boolean
) {
  const seriesData: Highcharts.SeriesOptionsType[] = data.flatMap(
    (item, index) => {
      const lineSeries: Highcharts.SeriesOptionsType = {
        type: 'line',
        name: item.areaName,
        data: item.healthData.map((point) => [point.year, point.value]),
        marker: {
          symbol: symbols[index % symbols.length],
        },
        color: chartColours[index % chartColours.length],
      };

      const confidenceIntervalSeries: Highcharts.SeriesOptionsType =
        generateConfidenceIntervalSeries(
          item.areaName,
          item.healthData.map((point) => [
            point.year,
            point.lowerCi,
            point.upperCi,
          ]),
          showConfidenceIntervalsData
        );

      return [lineSeries, confidenceIntervalSeries];
    }
  );

  if (parentIndicatorData) {
    const groupSeries: Highcharts.SeriesOptionsType = {
      type: 'line',
      name: `Group: ${parentIndicatorData.areaName}`,
      data: parentIndicatorData.healthData.map((point) => [
        point.year,
        point.value,
      ]),
      color: GovukColours.Turquoise,
      marker: {
        symbol: 'diamond',
      },
    };

    const groupConfidenceIntervalSeries: Highcharts.SeriesOptionsType =
      generateConfidenceIntervalSeries(
        parentIndicatorData.areaName,
        parentIndicatorData.healthData.map((point) => [
          point.year,
          point.lowerCi,
          point.upperCi,
        ]),
        showConfidenceIntervalsData
      );

    seriesData.unshift(groupSeries, groupConfidenceIntervalSeries);
  }

  if (benchmarkData) {
    const englandSeries: Highcharts.SeriesOptionsType = {
      type: 'line',
      name: `Benchmark: ${benchmarkData.areaName}`,
      data: benchmarkData.healthData.map((point) => [point.year, point.value]),
      color: GovukColours.DarkGrey,
      marker: {
        symbol: 'circle',
      },
    };

    const benchmarkConfidenceIntervalSeries: Highcharts.SeriesOptionsType =
      generateConfidenceIntervalSeries(
        benchmarkData.areaName,
        benchmarkData.healthData.map((point) => [
          point.year,
          point.lowerCi,
          point.upperCi,
        ]),
        showConfidenceIntervalsData
      );
    seriesData.unshift(englandSeries, benchmarkConfidenceIntervalSeries);
  }

  return seriesData;
}

export function generateStandardLineChartOptions(
  healthIndicatorData: HealthDataForArea[],
  lineChartCI: boolean,
  isCalendarYearTypeIndicator: boolean,
  optionalParams?: {
    benchmarkData?: HealthDataForArea;
    groupIndicatorData?: HealthDataForArea;
    yAxisTitle?: string;
    xAxisTitle?: string;
    measurementUnit?: string;
    accessibilityLabel?: string;
    colours?: ChartColours[];
    symbols?: SymbolKeyValue[];
    yAxisLabelFormatter?: Highcharts.AxisLabelsFormatterCallbackFunction;
    xAxisLabelFormatter?: Highcharts.AxisLabelsFormatterCallbackFunction;
  }
): Highcharts.Options {
  const sortedHealthIndicatorData =
    sortHealthDataForAreasByDate(healthIndicatorData);

  const sortedBenchMarkData = optionalParams?.benchmarkData
    ? sortHealthDataForAreaByDate(optionalParams?.benchmarkData)
    : undefined;

  const sortedGroupData = optionalParams?.groupIndicatorData
    ? sortHealthDataForAreaByDate(optionalParams?.groupIndicatorData)
    : undefined;

  const measurementUnit = optionalParams?.measurementUnit === percentageMeasurementUnit ? `${optionalParams?.measurementUnit}` : ` ${optionalParams?.measurementUnit}`;

  let seriesData = generateSeriesData(
    sortedHealthIndicatorData,
    optionalParams?.symbols ?? chartSymbols,
    optionalParams?.colours ?? chartColours,
    sortedBenchMarkData,
    sortedGroupData,
    lineChartCI
  );

  if (sortedBenchMarkData && sortedHealthIndicatorData.length === 0) {
    seriesData = generateSeriesData(
      [sortedBenchMarkData],
      ['circle'],
      [GovukColours.DarkGrey],
      undefined,
      undefined,
      lineChartCI
    );
  }
  return {
    ...lineChartDefaultOptions,
    yAxis: {
      ...lineChartDefaultOptions.yAxis,
      labels: {
        ...(lineChartDefaultOptions.yAxis as Highcharts.YAxisOptions)?.labels,
        formatter: optionalParams?.yAxisLabelFormatter,
      },
      title: optionalParams?.yAxisTitle
        ? {
            text: optionalParams?.yAxisTitle,
            margin: 20,
            style: { fontSize: AXIS_TITLE_FONT_SIZE },
          }
        : undefined,
    },
    xAxis: {
      ...lineChartDefaultOptions.xAxis,
      title: {
        text: optionalParams?.xAxisTitle,
        margin: 20,
        style: { fontSize: AXIS_TITLE_FONT_SIZE },
      },
      labels: {
        ...(lineChartDefaultOptions.xAxis as Highcharts.XAxisOptions)?.labels,
        formatter: optionalParams?.xAxisLabelFormatter,
      },
    },
    series: seriesData,
    tooltip: {
      formatter: function (this: Highcharts.Point): string {
        return tooltipFormatter(this, isCalendarYearTypeIndicator) + measurementUnit;
      },
    },
    accessibility: {
      ...lineChartDefaultOptions.accessibility,
      description: optionalParams?.accessibilityLabel,
    },
  };
}

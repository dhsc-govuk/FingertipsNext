import { HealthDataForArea } from '@/generated-sources/ft-api-client';
import Highcharts, { SymbolKeyValue } from 'highcharts';
import { GovukColours } from '@/lib/styleHelpers/colours';
import { chartColours, ChartColours } from '@/lib/chartHelpers/colours';
import {
  sortHealthDataForAreasByDate,
  sortHealthDataForAreaByDate,
  generateConfidenceIntervalSeries,
} from '@/lib/chartHelpers/chartHelpers';

export enum LineChartVariant {
  Standard = 'standard',
  Inequalities = 'inequalities',
}

export const lineChartDefaultOptions: Highcharts.Options = {
  credits: {
    enabled: false,
  },
  chart: { type: 'line', height: '50%', spacingBottom: 50, spacingTop: 20 },
  title: {
    style: {
      display: 'none',
    },
  },
  yAxis: {
    minorTickInterval: 'auto',
    minorTicksPerMajor: 2,
  },
  xAxis: { tickLength: 0, allowDecimals: false },
  legend: {
    verticalAlign: 'top',
    align: 'left',
  },
  accessibility: {
    enabled: false,
  },
  tooltip: {
    format:
      '<b>{point.series.name}</b><br/>Year: {point.x}<br/><br/><span style="color:{color}">\u25CF</span> Value {point.y}',
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
    seriesData.unshift(groupSeries);
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
    seriesData.unshift(englandSeries);
  }

  return seriesData;
}

export function generateStandardLineChartOptions(
  healthIndicatorData: HealthDataForArea[],
  lineChartCI: boolean,
  optionalParams?: {
    benchmarkData?: HealthDataForArea;
    groupIndicatorData?: HealthDataForArea;
    yAxisTitle?: string;
    xAxisTitle?: string;
    measurementUnit?: string;
    accessibilityLabel?: string;
    colours?: ChartColours[];
    symbols?: SymbolKeyValue[];
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
      title: optionalParams?.yAxisTitle
        ? { text: optionalParams?.yAxisTitle, margin: 20 }
        : undefined,
    },
    xAxis: {
      ...lineChartDefaultOptions.xAxis,
      title: { text: optionalParams?.xAxisTitle, margin: 20 },
    },
    legend: {
      ...lineChartDefaultOptions.legend,
      title: {
        text: 'Areas',
      },
    },
    series: seriesData,
    tooltip: {
      format:
        lineChartDefaultOptions.tooltip?.format +
        `${optionalParams?.measurementUnit}`,
    },
    accessibility: {
      ...lineChartDefaultOptions.accessibility,
      description: optionalParams?.accessibilityLabel,
    },
  };
}

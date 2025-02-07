'use client';

import Highcharts, { SymbolKeyValue } from 'highcharts';
import { HighchartsReact } from 'highcharts-react-official';
import { sortHealthDataByDate } from '@/lib/chartHelpers/chartHelpers';
import { HealthDataForArea } from '@/generated-sources/ft-api-client';
import { H3 } from 'govuk-react';
import { ConfidenceIntervalCheckbox } from '@/components/molecules/ConfidenceIntervalCheckbox';
import { chartColours } from '@/lib/chartHelpers/colours';
import { generateSeriesData } from './lineChartHelpers';
import "highcharts/highcharts-more";

interface LineChartProps {
  LineChartTitle?: string;
  data: HealthDataForArea[];
  xAxisTitle?: string;
  accessibilityLabel?: string;
  benchmarkData?: HealthDataForArea;
}

const chartSymbols: SymbolKeyValue[] = [
  'square',
  'triangle',
  'triangle-down',
  'circle',
  'diamond',
];

export function LineChart({
  LineChartTitle: lineChartTitle,
  data,
  xAxisTitle,
  accessibilityLabel,
  benchmarkData,
}: Readonly<LineChartProps>) {
  const sortedSeriesValues = sortHealthDataByDate(data);
  const seriesData = generateSeriesData(
    sortedSeriesValues,
    chartSymbols,
    benchmarkData
  );

  const lineChartOptions: Highcharts.Options = {
    credits: {
      enabled: false,
    },
    chart: { type: 'line', height: '50%', spacingBottom: 50, spacingTop: 20 },
    colors: chartColours,
    title: {
      style: {
        display: 'none',
      },
    },
    yAxis: {
      title: undefined,
      minorTickInterval: 'auto',
      minorTicksPerMajor: 2,
    },
    xAxis: {
      title: { text: xAxisTitle, margin: 20 },
      tickLength: 0,
    },
    legend: {
      title: {
        text: 'Areas',
      },
      verticalAlign: 'top',
      align: 'left',
    },
    series: seriesData,
    tooltip: {
      format:
        '<b>{point.series.name}</b><br/>Year: {point.x}<br/><br/><span style="color:{color}">\u25CF</span> Value {point.y}',
    },
    accessibility: {
      enabled: false,
      description: accessibilityLabel,
    },
  };

  return (
    <div data-testid="lineChart-component">
      <H3>{lineChartTitle}</H3>
      <ConfidenceIntervalCheckbox chartName="lineChart"></ConfidenceIntervalCheckbox>
      <HighchartsReact
        containerProps={{ 'data-testid': 'highcharts-react-component' }}
        highcharts={Highcharts}
        options={lineChartOptions}
      />
    </div>
  );
}

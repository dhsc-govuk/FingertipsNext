'use client';

import Highcharts, { SymbolKeyValue } from 'highcharts';
import { HighchartsReact } from 'highcharts-react-official';
import { sortHealthDataByDate } from '@/lib/chartHelpers/chartHelpers';
import { HealthDataForArea } from '@/generated-sources/ft-api-client';
import { ConfidenceIntervalCheckbox } from '@/components/molecules/ConfidenceIntervalCheckbox';
import { chartColours } from '@/lib/chartHelpers/colours';
import { generateSeriesData } from './lineChartHelpers';
import 'highcharts/highcharts-more';
import { useSearchParams } from 'next/navigation';
import { SearchParams, SearchStateManager } from '@/lib/searchStateManager';

interface LineChartProps {
  healthIndicatorData: HealthDataForArea[];
  xAxisTitle?: string;
  yAxisTitle?: string;
  accessibilityLabel?: string;
  benchmarkData?: HealthDataForArea;
  parentIndicatorData?: HealthDataForArea;
  measurementUnits: string;
}

const chartSymbols: SymbolKeyValue[] = [
  'square',
  'triangle',
  'triangle-down',
  'circle',
  'diamond',
];

const chartName = 'lineChart';

export function LineChart({
  healthIndicatorData,
  xAxisTitle,
  yAxisTitle,
  accessibilityLabel,
  benchmarkData,
  parentIndicatorData,
  measurementUnits,
}: Readonly<LineChartProps>) {
  const searchParams = useSearchParams();
  const existingParams = new URLSearchParams(searchParams);
  const searchStateManager =
    SearchStateManager.setStateFromParams(existingParams);

  const showConfidenceIntervalsData =
    searchStateManager.getSearchState()[
      SearchParams.ConfidenceIntervalSelected
    ];

  const lineChartCI =
    showConfidenceIntervalsData?.some((ci) => ci === chartName) ?? false;

  const sortedHealthIndicatorData = sortHealthDataByDate(healthIndicatorData);

  const sortedBenchMarkData = benchmarkData
    ? sortHealthDataByDate([benchmarkData])[0]
    : undefined;

  const sortedParentData = parentIndicatorData
    ? sortHealthDataByDate([parentIndicatorData])[0]
    : undefined;

  const seriesData = generateSeriesData(
    sortedHealthIndicatorData,
    chartSymbols,
    chartColours,
    sortedBenchMarkData,
    sortedParentData,
    lineChartCI
  );

  const lineChartOptions: Highcharts.Options = {
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
      title: { text: yAxisTitle, margin: 20 },
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
        '<b>{point.series.name}</b><br/>Year: {point.x}<br/><br/><span style="color:{color}">\u25CF</span> Value {point.y}' +
        `${measurementUnits}`,
    },
    accessibility: {
      enabled: false,
      description: accessibilityLabel,
    },
  };

  return (
    <div data-testid="lineChart-component">
      <ConfidenceIntervalCheckbox
        chartName={chartName}
        showConfidenceIntervalsData={lineChartCI}
      ></ConfidenceIntervalCheckbox>
      <HighchartsReact
        containerProps={{
          'data-testid': 'highcharts-react-component-lineChart',
        }}
        highcharts={Highcharts}
        options={lineChartOptions}
      />
    </div>
  );
}

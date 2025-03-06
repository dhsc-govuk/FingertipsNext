'use client';

import Highcharts, { SymbolKeyValue } from 'highcharts';
import { HighchartsReact } from 'highcharts-react-official';
import {
  sortHealthDataForAreaByDate,
  sortHealthDataForAreasByDate,
} from '@/lib/chartHelpers/chartHelpers';
import { HealthDataForArea } from '@/generated-sources/ft-api-client';
import { ConfidenceIntervalCheckbox } from '@/components/molecules/ConfidenceIntervalCheckbox';
import { chartColours } from '@/lib/chartHelpers/colours';
import { generateSeriesData } from './lineChartHelpers';
import { SearchParams, SearchStateParams } from '@/lib/searchStateManager';
import { useEffect, useState } from 'react';

interface LineChartProps {
  healthIndicatorData: HealthDataForArea[];
  xAxisTitle?: string;
  yAxisTitle?: string;
  accessibilityLabel?: string;
  benchmarkData?: HealthDataForArea;
  showConfidenceIntervalsData?: string[];
  searchState: SearchStateParams;
  groupIndicatorData?: HealthDataForArea;
  measurementUnits : string
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
  searchState,
  groupIndicatorData,
  measurementUnits
}: Readonly<LineChartProps>) {
  const [options, setOptions] = useState<Highcharts.Options>();
  const loadHighchartsModules = async (callback: () => void) => {
    await import('highcharts/highcharts-more').then(callback);
  };

  const {
    [SearchParams.ConfidenceIntervalSelected]: confidenceIntervalSelected,
  } = searchState;

  const lineChartCI =
    confidenceIntervalSelected?.some((ci) => ci === chartName) ?? false;

  const sortedHealthIndicatorData =
    sortHealthDataForAreasByDate(healthIndicatorData);

  const sortedBenchMarkData = benchmarkData
    ? sortHealthDataForAreaByDate(benchmarkData)
    : undefined;

  const sortedGroupData = groupIndicatorData
    ? sortHealthDataForAreaByDate(groupIndicatorData)
    : undefined;

  const seriesData = generateSeriesData(
    sortedHealthIndicatorData,
    chartSymbols,
    chartColours,
    sortedBenchMarkData,
    sortedGroupData,
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

  useEffect(() => {
    loadHighchartsModules(() => {
      setOptions(lineChartOptions);
    });
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [confidenceIntervalSelected]);

  if (!options) {
    return null;
  }

  return (
    <div data-testid="lineChart-component">
      <ConfidenceIntervalCheckbox
        chartName={chartName}
        showConfidenceIntervalsData={lineChartCI}
        searchState={searchState}
      ></ConfidenceIntervalCheckbox>
      <HighchartsReact
        containerProps={{
          'data-testid': 'highcharts-react-component-lineChart',
        }}
        highcharts={Highcharts}
        options={options}
      />
    </div>
  );
}

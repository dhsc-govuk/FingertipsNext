'use client';

import Highcharts, { SymbolKeyValue } from 'highcharts';
import { HighchartsReact } from 'highcharts-react-official';
import { sortHealthDataByDate } from '@/lib/chartHelpers/chartHelpers';
import { HealthDataForArea } from '@/generated-sources/ft-api-client';
import { ConfidenceIntervalCheckbox } from '@/components/molecules/ConfidenceIntervalCheckbox';
import { chartColours } from '@/lib/chartHelpers/colours';
import { generateSeriesData } from './lineChartHelpers';
import 'highcharts/highcharts-more';
import { SearchParams, SearchStateParams } from '@/lib/searchStateManager';
import { useEffect, useState } from 'react';

interface LineChartProps {
  healthIndicatorData: HealthDataForArea[];
  xAxisTitle?: string;
  accessibilityLabel?: string;
  benchmarkData?: HealthDataForArea;
  parentIndicatorData?: HealthDataForArea;
  showConfidenceIntervalsData?: string[];
  searchState: SearchStateParams;
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
  accessibilityLabel,
  benchmarkData,
  parentIndicatorData,
  searchState,
}: Readonly<LineChartProps>) {
  const [options, setOptions] = useState<Highcharts.Options>();
  const loadHighchartsModules = async (callback: () => void) => {
    try {
      await import('highcharts/highcharts-more');
      callback();
    } catch (error) {
      console.log('highcharts more module not loading', error);
    }
  };

  const {
    [SearchParams.ConfidenceIntervalSelected]: confidenceIntervalSelected,
  } = searchState;
  
  const lineChartCI =
    confidenceIntervalSelected?.some((ci) => ci === chartName) ?? false;

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

  useEffect(() => {
    loadHighchartsModules(async () => {
      setOptions(lineChartOptions);
    });
  }, [confidenceIntervalSelected]);

  if (!options) {
    return null;
  }

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
        options={options}
      />
    </div>
  );
}

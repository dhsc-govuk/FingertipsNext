'use client';

import Highcharts from 'highcharts';
import { HighchartsReact } from 'highcharts-react-official';
import {
  sortHealthDataForAreaByDate,
  sortHealthDataForAreasByDate,
} from '@/lib/chartHelpers/chartHelpers';
import { HealthDataForArea } from '@/generated-sources/ft-api-client';
import { ConfidenceIntervalCheckbox } from '@/components/molecules/ConfidenceIntervalCheckbox';
import { chartColours } from '@/lib/chartHelpers/colours';
import {
  chartSymbols,
  generateSeriesData,
  lineChartDefaultOptions,
} from '@/components/organisms/LineChart/lineChartHelpers';
import { SearchParams, SearchStateParams } from '@/lib/searchStateManager';
import { useEffect, useState } from 'react';
import { GovukColours } from '@/lib/styleHelpers/colours';

interface LineChartProps {
  healthIndicatorData: HealthDataForArea[];
  xAxisTitle?: string;
  yAxisTitle?: string;
  accessibilityLabel?: string;
  benchmarkData?: HealthDataForArea;
  showConfidenceIntervalsData?: string[];
  searchState: SearchStateParams;
  groupIndicatorData?: HealthDataForArea;
  measurementUnit?: string;
}

const chartName = 'lineChart';

export function LineChart({
  healthIndicatorData,
  xAxisTitle,
  yAxisTitle,
  accessibilityLabel,
  benchmarkData,
  searchState,
  groupIndicatorData,
  measurementUnit,
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

  let seriesData = generateSeriesData(
    sortedHealthIndicatorData,
    chartSymbols,
    chartColours,
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
  const lineChartOptions: Highcharts.Options = {
    ...lineChartDefaultOptions,
    yAxis: {
      title: yAxisTitle ? { text: yAxisTitle, margin: 20 } : undefined,
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
        `${measurementUnit}`,
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

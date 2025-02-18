'use client';

import Highcharts, { SymbolKeyValue } from 'highcharts';
import { HighchartsReact } from 'highcharts-react-official';
import { sortHealthDataByDate } from '@/lib/chartHelpers/chartHelpers';
import { HealthDataForArea } from '@/generated-sources/ft-api-client';
import { H3 } from 'govuk-react';
import { ConfidenceIntervalCheckbox } from '@/components/molecules/ConfidenceIntervalCheckbox';
import { chartColours } from '@/lib/chartHelpers/colours';
import { generateSeriesData } from './lineChartHelpers';
import { useEffect, useState } from 'react';

interface LineChartProps {
  LineChartTitle?: string;
  healthIndicatorData: HealthDataForArea[];
  xAxisTitle?: string;
  accessibilityLabel?: string;
  benchmarkData?: HealthDataForArea;
  showConfidenceIntervalsData?: string[];
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
  LineChartTitle: lineChartTitle,
  healthIndicatorData,
  xAxisTitle,
  accessibilityLabel,
  benchmarkData,
  showConfidenceIntervalsData,
}: Readonly<LineChartProps>) {

  const [options, setOptions] = useState<Highcharts.Options>();
  const loadHighchartsModules = async (callback: () => void) => {
    try {
      await import('highcharts/highcharts-more');
      callback()
    } catch (error) {
      console.log('highcharts more module not loading', error)
    }
  };
  

  const lineChartCI =
    showConfidenceIntervalsData?.some((ci) => ci === chartName) ?? false;

  const sortedSeriesValues = sortHealthDataByDate(healthIndicatorData);
  const seriesData = generateSeriesData(
    sortedSeriesValues,
    chartSymbols,
    chartColours,
    benchmarkData,
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
  }, [showConfidenceIntervalsData]);

  if (!options) {
    return null;
  }
  
  return (
    <div data-testid="lineChart-component">
      <H3>{lineChartTitle}</H3>
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

'use client';

import Highcharts, { Chart, ExportingOptions } from 'highcharts';
import { HighchartsReact } from 'highcharts-react-official';
import { ConfidenceIntervalCheckbox } from '@/components/molecules/ConfidenceIntervalCheckbox';
import { SyntheticEvent, useEffect, useRef, useState } from 'react';
import { addShowHideLinkedSeries, LineChartVariant } from './lineChartHelpers';
import { loadHighchartsModules } from '@/lib/chartHelpers/chartHelpers';
import { DownloadImage } from '@/components/molecules/Export/DownloadImage';

interface LineChartProps {
  lineChartOptions: Highcharts.Options;
  variant: LineChartVariant;
}

export function LineChart({
  lineChartOptions,
  variant,
}: Readonly<LineChartProps>) {
  const [showConfidenceIntervalsData, setShowConfidenceIntervalsData] =
    useState(false);
  const [visibility, setVisibility] = useState<Record<string, boolean>>({});
  const [options, setOptions] = useState<Highcharts.Options>();
  const chartRef = useRef<Chart | undefined>(undefined);

  addShowHideLinkedSeries(
    lineChartOptions,
    showConfidenceIntervalsData,
    visibility,
    setVisibility
  );

  useEffect(() => {
    void loadHighchartsModules(() => {
      setOptions(lineChartOptions);
    });
  }, [lineChartOptions]);

  if (!options) {
    return null;
  }
  const id = `${variant}LineChart-component`;

  const onHighchartsExport = (e: SyntheticEvent) => {
    e.preventDefault();
    const exportingOptions: ExportingOptions = {
      type: 'image/svg+xml',
    };
    const beforeChart = chartRef.current;

    const svg = chartRef.current?.getSVG();
    console.log(svg);

    // chartRef.current?.exportChartLocal(exportingOptions, options);
    // chartRef.current = beforeChart;
  };

  return (
    <div data-testid={id}>
      <ConfidenceIntervalCheckbox
        chartName={`${variant}LineChart`}
        showConfidenceIntervalsData={showConfidenceIntervalsData}
        setShowConfidenceIntervalsData={setShowConfidenceIntervalsData}
      ></ConfidenceIntervalCheckbox>
      <div id={id}>
        <HighchartsReact
          containerProps={{
            'data-testid': 'highcharts-react-component-lineChart',
          }}
          highcharts={Highcharts}
          options={options}
          callback={(chart: Chart) => {
            chartRef.current = chart;
          }}
        />
      </div>
      <DownloadImage target={id} chart={chartRef} />
    </div>
  );
}

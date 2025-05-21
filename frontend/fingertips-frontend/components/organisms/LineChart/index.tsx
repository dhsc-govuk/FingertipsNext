'use client';

import Highcharts from 'highcharts';
import { ConfidenceIntervalCheckbox } from '@/components/molecules/ConfidenceIntervalCheckbox';
import { addShowHideLinkedSeries } from './helpers/addShowHideLinkedSeries';
import { LineChartVariant } from './helpers/generateStandardLineChartOptions';
import { ExportOptionsButton } from '@/components/molecules/Export/ExportOptionsButton';
import { HighChartsWrapper } from '@/components/molecules/HighChartsWrapper/HighChartsWrapper';
import { useState } from 'react';
import { useHighChartsCallback } from '@/components/molecules/HighChartsWrapper/useHighChartsCallback';

interface LineChartProps {
  lineChartOptions: Highcharts.Options;
  variant: LineChartVariant;
}

export function LineChart({
  lineChartOptions,
  variant,
}: Readonly<LineChartProps>) {
  const { chartRef, callback } = useHighChartsCallback();
  const [showConfidenceIntervalsData, setShowConfidenceIntervalsData] =
    useState(false);
  const [visibility, setVisibility] = useState<Record<string, boolean>>({});

  addShowHideLinkedSeries(
    lineChartOptions,
    showConfidenceIntervalsData,
    visibility,
    setVisibility
  );

  const id = `${variant}LineChart-component`;
  return (
    <div data-testid={id}>
      <ConfidenceIntervalCheckbox
        chartName={`${variant}LineChart`}
        showConfidenceIntervalsData={showConfidenceIntervalsData}
        setShowConfidenceIntervalsData={setShowConfidenceIntervalsData}
      />
      <div id={id}>
        <HighChartsWrapper
          chartOptions={lineChartOptions}
          callback={callback}
          testId={'highcharts-react-component-lineChart'}
        />
      </div>
      <ExportOptionsButton targetId={id} chartRef={chartRef} />
    </div>
  );
}

'use client';

import Highcharts from 'highcharts';
import { ConfidenceIntervalCheckbox } from '@/components/molecules/ConfidenceIntervalCheckbox';
import { addShowHideLinkedSeries } from './helpers/addShowHideLinkedSeries';
import { LineChartVariant } from './helpers/generateStandardLineChartOptions';
import { ExportOptionsButton } from '@/components/molecules/Export/ExportOptionsButton';
import { HighChartsWrapper } from '@/components/molecules/HighChartsWrapper/HighChartsWrapper';
import { useState } from 'react';
import { ExportCopyright } from '@/components/molecules/Export/ExportCopyright';
import { ExportOnlyWrapper } from '@/components/molecules/Export/ExportOnlyWrapper';
import { ChartTitle } from '@/components/atoms/ChartTitle/ChartTitle';

interface LineChartProps {
  title: string;
  lineChartOptions: Highcharts.Options;
  variant: LineChartVariant;
}

export function LineChart({
  title,
  lineChartOptions,
  variant,
}: Readonly<LineChartProps>) {
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
    <>
      <div id={id} data-testid={id}>
        <ChartTitle>{title}</ChartTitle>
        <ConfidenceIntervalCheckbox
          chartName={`${variant}LineChart`}
          showConfidenceIntervalsData={showConfidenceIntervalsData}
          setShowConfidenceIntervalsData={setShowConfidenceIntervalsData}
        />
        <HighChartsWrapper
          chartOptions={lineChartOptions}
          testId={'highcharts-react-component-lineChart'}
        />
        <ExportOnlyWrapper>
          <ExportCopyright />
        </ExportOnlyWrapper>
      </div>
      <ExportOptionsButton targetId={id} chartOptions={lineChartOptions} />
    </>
  );
}

'use client';

import Highcharts from 'highcharts';
import { HighchartsReact } from 'highcharts-react-official';
import { ConfidenceIntervalCheckbox } from '@/components/molecules/ConfidenceIntervalCheckbox';
import { useEffect, useState } from 'react';
import { LineChartVariant } from './lineChartHelpers';
import { loadHighchartsModules } from '@/lib/chartHelpers/chartHelpers';

interface LineChartProps {
  lineChartOptions: Highcharts.Options;
  showConfidenceIntervalsData: boolean;
  setShowConfidenceIntervalsData: (checked: boolean) => void;
  variant: LineChartVariant;
}

export function LineChart({
  lineChartOptions,
  showConfidenceIntervalsData,
  setShowConfidenceIntervalsData,
  variant,
}: Readonly<LineChartProps>) {
  const [options, setOptions] = useState<Highcharts.Options>();

  useEffect(() => {
    void loadHighchartsModules(() => {
      setOptions(lineChartOptions);
    });
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [showConfidenceIntervalsData]);

  if (!options) {
    return null;
  }

  return (
    <div data-testid={`${variant}LineChart-component`}>
      <ConfidenceIntervalCheckbox
        chartName={`${variant}LineChart`}
        showConfidenceIntervalsData={showConfidenceIntervalsData}
        setShowConfidenceIntervalsData={setShowConfidenceIntervalsData}
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

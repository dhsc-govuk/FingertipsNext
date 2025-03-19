'use client';

import Highcharts from 'highcharts';
import { HighchartsReact } from 'highcharts-react-official';
import { ConfidenceIntervalCheckbox } from '@/components/molecules/ConfidenceIntervalCheckbox';
import { Dispatch, SetStateAction, useEffect, useState } from 'react';

interface LineChartProps {
  lineChartOptions: Highcharts.Options;
  chartName?: string;
  confidenceIntervalSelected: boolean;
  setConfidenceIntervalSelected: Dispatch<SetStateAction<boolean>>;
}

export function LineChart({
  lineChartOptions,
  confidenceIntervalSelected,
  setConfidenceIntervalSelected,
  chartName = '',
}: Readonly<LineChartProps>) {
  const [options, setOptions] = useState<Highcharts.Options>();
  const loadHighchartsModules = async (callback: () => void) => {
    await import('highcharts/highcharts-more').then(callback);
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
        confidenceIntervalSelected={confidenceIntervalSelected}
        handleSetConfidenceIntervalSelected={setConfidenceIntervalSelected}
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

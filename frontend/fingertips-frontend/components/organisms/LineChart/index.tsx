'use client';

import Highcharts from 'highcharts';
import { HighchartsReact } from 'highcharts-react-official';
import { ConfidenceIntervalCheckbox } from '@/components/molecules/ConfidenceIntervalCheckbox';
import { useEffect, useState } from 'react';
import { loadHighchartsModules } from '@/lib/chartHelpers/chartHelpers';
import { addShowHideLinkedSeries } from './helpers/addShowHideLinkedSeries';
import { LineChartVariant } from './helpers/generateStandardLineChartOptions';
import { ExportOptionsButton } from '@/components/molecules/Export/ExportOptionsButton';

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
  return (
    <div data-testid={id}>
      <ConfidenceIntervalCheckbox
        chartName={`${variant}LineChart`}
        showConfidenceIntervalsData={showConfidenceIntervalsData}
        setShowConfidenceIntervalsData={setShowConfidenceIntervalsData}
      ></ConfidenceIntervalCheckbox>
      <div id={id}>
        <h2>A title for this thing</h2>
        <HighchartsReact
          containerProps={{
            'data-testid': 'highcharts-react-component-lineChart',
          }}
          highcharts={Highcharts}
          options={options}
        />
      </div>
      <ExportOptionsButton targetId={id} />
    </div>
  );
}

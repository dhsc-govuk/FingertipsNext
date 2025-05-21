import Highcharts from 'highcharts';
import { HighchartsReact } from 'highcharts-react-official';
import { FC, useEffect, useState } from 'react';
import { loadHighchartsModules } from '@/lib/chartHelpers/chartHelpers';

interface HighChartsWrapperProps {
  chartOptions: Highcharts.Options;
  callback?: (chart: Highcharts.Chart) => void;
  testId?: string;
}

export const HighChartsWrapper: FC<HighChartsWrapperProps> = ({
  chartOptions,
  callback,
  testId,
}) => {
  const [options, setOptions] = useState<Highcharts.Options>();
  chartOptions.exporting = { enabled: false };

  useEffect(() => {
    void loadHighchartsModules(() => {
      setOptions(chartOptions);
    });
  }, [chartOptions, options]);

  if (!options) {
    return null;
  }

  return (
    <HighchartsReact
      containerProps={{
        'data-testid': testId,
      }}
      highcharts={Highcharts}
      options={options}
      callback={callback}
    />
  );
};

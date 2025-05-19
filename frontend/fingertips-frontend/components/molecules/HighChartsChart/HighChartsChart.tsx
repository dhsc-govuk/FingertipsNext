import Highcharts from 'highcharts';
import { HighchartsReact } from 'highcharts-react-official';
import { FC, useEffect, useState } from 'react';
import { loadHighchartsModules } from '@/lib/chartHelpers/chartHelpers';

interface HighChartsChartProps {
  chartOptions: Highcharts.Options;
  callback?: (chart: Highcharts.Chart) => void;
  testId?: string;
}

export const HighChartsChart: FC<HighChartsChartProps> = ({
  chartOptions,
  callback,
  testId,
}) => {
  const [options, setOptions] = useState<Highcharts.Options>();

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

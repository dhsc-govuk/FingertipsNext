import Highcharts from 'highcharts';
import { HighchartsReact } from 'highcharts-react-official';
import { FC, useEffect, useState } from 'react';
import { loadHighchartsModules } from '@/lib/chartHelpers/loadHighchartsModules';

interface HighChartsWrapperProps {
  chartOptions: Highcharts.Options;
  testId?: string;
  constructorType?: string;
}

export const HighChartsWrapper: FC<HighChartsWrapperProps> = ({
  chartOptions,
  testId,
  constructorType,
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
      constructorType={constructorType}
    />
  );
};

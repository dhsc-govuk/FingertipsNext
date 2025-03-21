'use client';

import Highcharts from 'highcharts';
import { HighchartsReact } from 'highcharts-react-official';
import { PopulationDataForArea } from '@/lib/chartHelpers/preparePopulationData';
import { createChartPyramidOptions } from './createChartOptions';

interface PyramidChartProps {
  dataForSelectedArea: PopulationDataForArea;
  dataForBenchmark?: PopulationDataForArea;
  dataForGroup?: PopulationDataForArea;
  xAxisTitle: string;
  yAxisTitle: string;
  accessibilityLabel?: string;
}

export const generatePopPyramidTooltipStringList = (
  point: Highcharts.Point,
  symbol: string
) => [
  `<span style="color:${point.series.color}">${symbol}</span>`,
  `<span> Value ${Math.abs(Number(point.y))}%<br/>${point.series.name}</span>`,
];

export function PopulationPyramid({
  dataForSelectedArea,
  dataForBenchmark,
  dataForGroup,
  xAxisTitle,
  yAxisTitle,
  accessibilityLabel,
}: Readonly<PyramidChartProps>) {
  Highcharts.Templating.helpers.abs = (value) => Math.abs(value);

  const populationPyramidOptions: Highcharts.Options =
    createChartPyramidOptions(
      xAxisTitle,
      yAxisTitle,
      accessibilityLabel ?? '',
      dataForSelectedArea,
      dataForBenchmark,
      dataForGroup
    );
  return (
    <div data-testid="populationPyramid-component">
      <HighchartsReact
        containerProps={{
          'data-testid': 'highcharts-react-component-populationPyramid',
        }}
        highcharts={Highcharts}
        options={populationPyramidOptions}
      />
    </div>
  );
}

'use client';

import Highcharts from 'highcharts';
import { HighchartsReact } from 'highcharts-react-official';
import { H3 } from 'govuk-react';
import { PopulationDataForArea } from '@/lib/chartHelpers/preparePopulationData';
import { PopulationData } from '@/lib/chartHelpers/preparePopulationData';
import {
  createChartSeriesOptions,
  createAdditionalChartSeries,
} from './createChartOptions';

interface PyramidChartProps {
  dataForSelectedArea: PopulationDataForArea;
  dataForEngland?: PopulationDataForArea;
  dataForBaseline?: PopulationDataForArea;
  populationPyramidTitle?: string;
  xAxisTitle?: string;
  yAxisTitle?: string;
  accessibilityLabel?: string;
}

export function PopulationPyramid({
  dataForSelectedArea,
  dataForEngland,
  dataForBaseline,
  populationPyramidTitle,
  xAxisTitle,
  yAxisTitle,
  accessibilityLabel,
}: Readonly<PyramidChartProps>) {
  Highcharts.Templating.helpers.abs = (value) => Math.abs(value);

  const populationPyramidOptions: Highcharts.Options = createChartSeriesOptions(
    xAxisTitle ?? '',
    yAxisTitle ?? '',
    dataForSelectedArea,
    accessibilityLabel ?? ''
  );
  const seriesOptions = createAdditionalChartSeries(
    dataForEngland,
    dataForBaseline
  );
  seriesOptions.map((series) => {
    populationPyramidOptions.series?.push(series);
  });

  return (
    <div data-testid="populationPyramid-component">
      <H3>{populationPyramidTitle}</H3>
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

'use client';

import Highcharts from 'highcharts';
import { HighchartsReact } from 'highcharts-react-official';
import { H3 } from 'govuk-react';
import { PopulationData } from '@/lib/chartHelpers/preparePopulationData';
import { createChartOptions } from './createChartOptions';

interface PyramidChartProps {
  healthIndicatorData: PopulationData;
  populationPyramidTitle?: string;
  xAxisTitle?: string;
  yAxisTitle?: string;
  accessibilityLabel?: string;
}

export function PopulationPyramid({
  healthIndicatorData,
  populationPyramidTitle,
  xAxisTitle,
  yAxisTitle,
  accessibilityLabel,
}: Readonly<PyramidChartProps>) {
  Highcharts.Templating.helpers.abs = (value) => Math.abs(value);

  const populationPyramidOptions: Highcharts.Options = createChartOptions(
    xAxisTitle ?? '',
    yAxisTitle ?? '',
    healthIndicatorData.dataForSelectedArea,
    accessibilityLabel ?? ''
  );

  // add comparitors to series if they exist
  if (healthIndicatorData.dataForEngland && populationPyramidOptions.series) {
    populationPyramidOptions.series.push(
      {
        name: 'England',
        data: healthIndicatorData.dataForEngland.femaleSeries,
        type: 'line',
        color: '#3D3D3D',
        dashStyle: 'Solid',
        marker: { symbol: 'circle' },
      },
      {
        name: 'England',
        data: healthIndicatorData.dataForEngland.maleSeries.map(
          (datapoint) => -datapoint
        ),
        type: 'line',
        color: '#3D3D3D',
        dashStyle: 'Solid',
        marker: { symbol: 'circle' },
        showInLegend: false,
      }
    );
  }
  if (healthIndicatorData.dataForBaseline && populationPyramidOptions.series) {
    populationPyramidOptions.series.push(
      {
        name: 'Baseline',
        type: 'line',
        data: healthIndicatorData.dataForBaseline.femaleSeries,
        color: '#28A197',
        dashStyle: 'Dash',
        marker: { symbol: 'diamond' },
        dataLabels: { enabled: false },
      },
      {
        name: 'Baseline',
        type: 'line',
        data: healthIndicatorData.dataForBaseline.maleSeries.map(
          (datapoint) => -datapoint
        ),
        color: '#28A197',
        dashStyle: 'Dash',
        marker: { symbol: 'diamond' },
        dataLabels: { enabled: false },
        showInLegend: false,
      }
    );
  }

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

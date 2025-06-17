'use client';

import Highcharts from 'highcharts';
import { PopulationDataForArea } from '@/lib/chartHelpers/preparePopulationData';
import { createChartPyramidOptions } from './createChartOptions';
import { HighChartsWrapper } from '@/components/molecules/HighChartsWrapper/HighChartsWrapper';
import { ExportOptionsButton } from '@/components/molecules/Export/ExportOptionsButton';
import { ExportOnlyWrapper } from '@/components/molecules/Export/ExportOnlyWrapper';
import { ExportCopyright } from '@/components/molecules/Export/ExportCopyright';
import { ChartTitle } from '@/components/atoms/ChartTitle/ChartTitle';

interface PyramidChartProps {
  title: string;
  dataForSelectedArea: PopulationDataForArea;
  dataForBenchmark?: PopulationDataForArea;
  dataForGroup?: PopulationDataForArea;
  xAxisTitle: string;
  yAxisTitle: string;
  accessibilityLabel?: string;
}

export function PopulationPyramid({
  title,
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
  const id = 'populationPyramidChart';
  return (
    <>
      <div id={id} data-testid={`${id}-component`}>
        <ChartTitle>{title}</ChartTitle>
        <HighChartsWrapper
          testId={'highcharts-react-component-populationPyramid'}
          chartOptions={populationPyramidOptions}
        />
        <ExportOnlyWrapper>
          <ExportCopyright />
        </ExportOnlyWrapper>
      </div>
      <ExportOptionsButton
        targetId={id}
        chartOptions={populationPyramidOptions}
      />
    </>
  );
}

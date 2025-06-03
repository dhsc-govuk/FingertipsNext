'use client';

import Highcharts from 'highcharts';
import { PopulationDataForArea } from '@/lib/chartHelpers/preparePopulationData';
import { createChartPyramidOptions } from './createChartOptions';
import { HighChartsWrapper } from '@/components/molecules/HighChartsWrapper/HighChartsWrapper';
import { ExportOptionsButton } from '@/components/molecules/Export/ExportOptionsButton';
import { ExportOnlyWrapper } from '@/components/molecules/Export/ExportOnlyWrapper';
import { ExportCopyright } from '@/components/molecules/Export/ExportCopyright';

interface PyramidChartProps {
  dataForSelectedArea: PopulationDataForArea;
  dataForBenchmark?: PopulationDataForArea;
  dataForGroup?: PopulationDataForArea;
  xAxisTitle: string;
  yAxisTitle: string;
  accessibilityLabel?: string;
}

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
    <>
      <div id="populationPyramid" data-testid="populationPyramid-component">
        <HighChartsWrapper
          testId={'highcharts-react-component-populationPyramid'}
          chartOptions={populationPyramidOptions}
        />
        <ExportOnlyWrapper>
          <ExportCopyright />
        </ExportOnlyWrapper>
      </div>
      <ExportOptionsButton
        targetId={'populationPyramid'}
        chartOptions={populationPyramidOptions}
      />
    </>
  );
}

'use client';

import { MultiIndicatorViewPlotProps } from '@/components/viewPlots/ViewPlotProps';
import {
  SpineChartTableProps,
  SpineChartTableRowProps,
  SpineChartTable,
} from '@/components/organisms/SpineChartTable';
import {
  HealthDataForArea,
  HealthDataPointTrendEnum,
} from '@/generated-sources/ft-api-client';
import { MOCK_HEALTH_DATA } from '@/lib/tableHelpers/mocks';
import { allAgesAge, noDeprivation, personsSex } from '@/lib/mocks';

export function mapToSpineChartTableProps(
  healthIndicatorData: HealthDataForArea[],
  groupIndicatorData: HealthDataForArea[],
  englandIndicatorData: HealthDataForArea[],
  indicatorMetadata: (IndicatorDocument | undefined)[]
): SpineChartTableProps {
  const numberOfIndicators = healthIndicatorData.length;
  const tableData: SpineChartTableRowProps[] = new Array(numberOfIndicators);

  healthIndicatorData.forEach((indicatorData, index) => {
    const rowIndicatorId: number =
      indicatorMetadata[index]?.indicatorID !== undefined
        ? Number(indicatorMetadata[index]?.indicatorID)
        : 0;

    const rowTitle: string =
      indicatorMetadata[index]?.indicatorName !== undefined
        ? indicatorMetadata[index]?.indicatorName
        : '';

    const rowIndicatorDefinition: string =
      indicatorMetadata[index]?.indicatorDefinition !== undefined
        ? indicatorMetadata[index]?.indicatorDefinition
        : '';

    const rowMeasurementUnit: string =
      indicatorMetadata[index] !== undefined
        ? indicatorMetadata[index]?.unitLabel
        : '';

    const rowIndicator: Indicator = {
      indicatorId: rowIndicatorId,
      title: rowTitle,
      definition: rowIndicatorDefinition,
    };

    const row: SpineChartTableRowProps = {
      indicator: rowIndicator,
      measurementUnit: rowMeasurementUnit,
      indicatorHealthData: indicatorData,
      groupIndicatorData: groupIndicatorData[index],
      englandBenchmarkData: englandIndicatorData[index],
      best: 100,
      worst: 0,
    };

    tableData[index] = row;
  });

  return { rowData: tableData };
}

export function TwoOrMoreIndicatorsAreasViewPlot({
  groupIndicatorData,
  englandIndicatorData,
  healthIndicatorData,
  indicatorMetadata,
}: Readonly<MultiIndicatorViewPlotProps>) {
  const spineTableData = mapToSpineChartTableProps(
    healthIndicatorData,
    groupIndicatorData,
    englandIndicatorData,
    indicatorMetadata
  );

  return (
    <section data-testid="twoOrMoreIndicatorsAreasViewPlot-component">
      <H2>View data for selected indicators and areas</H2>
      <SpineChartTable rowData={spineTableData.rowData} />
    </section>
  );
}

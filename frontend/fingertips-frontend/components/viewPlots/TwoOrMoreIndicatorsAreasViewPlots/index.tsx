'use client';

import { SearchParams, SearchStateManager } from '@/lib/searchStateManager';
import { MultiIndicatorViewPlotProps } from '@/components/viewPlots/ViewPlotProps';
import {
  SpineChartTableProps,
  SpineChartTableRowProps,
  SpineChartTable,
} from '@/components/organisms/SpineChartTable';
import {
  HealthDataForArea,
  HealthDataPointTrendEnum,
  Indicator,
} from '@/generated-sources/ft-api-client';
import { MOCK_HEALTH_DATA } from '@/lib/tableHelpers/mocks';
import { H2 } from 'govuk-react';
import { IndicatorDocument } from '@/lib/search/searchTypes';

export function mapToSpineChartTableProps(
  healthIndicatorData: HealthDataForArea[][],
  indicatorMetadata?: (IndicatorDocument | undefined)[]
):SpineChartTableProps {
  const numberOfIndicators = healthIndicatorData.length
  let tableData: SpineChartTableRowProps[]= new Array(numberOfIndicators);
  
  healthIndicatorData.map((indicatorData, index) => {
    const validMetaData = indicatorMetadata !== undefined && indicatorMetadata[index] !== undefined 

    const rowIndicatorId: number =
    validMetaData && 
    indicatorMetadata[index]?.indicatorID !== undefined
    ? Number(indicatorMetadata[index]?.indicatorID)
    : 0;

    const rowTitle: string =  
    validMetaData && 
    indicatorMetadata[index]?.unitLabel !== undefined?
     indicatorMetadata[index]?.unitLabel
    : '';

    const rowIndicatorDefinition: string =
    validMetaData && 
    indicatorMetadata[index]?.indicatorDefinition !== undefined?
      indicatorMetadata[index]?.indicatorDefinition
      : '';

    const rowMeasurementUnit: string =
    validMetaData  &&
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
      indicatorHealthData: indicatorData[0], 
      groupIndicatorData: indicatorData[1],
      englandBenchmarkData: indicatorData[2],
      best: 100,
      worst: 0
    };

    tableData[index]=(row)
  })

  return {rowData:tableData}
};

export function TwoOrMoreIndicatorsAreasViewPlot({
  healthIndicatorData,
  searchState,
  indicatorMetadata,
}: Readonly<MultiIndicatorViewPlotProps>) {
  const _1 = searchState;

  const spineTableData = mapToSpineChartTableProps(
    healthIndicatorData,
    indicatorMetadata
  );

  return (
    <section data-testid="twoOrMoreIndicatorsAreasViewPlot-component">
      <H2>View data for selected indicators and areas</H2>
      <SpineChartTable rowData={spineTableData.rowData} />
    </section>
  );
}

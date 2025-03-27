'use client';

import { TwoOrMoreIndicatorsViewPlotProps } from '@/components/viewPlots/ViewPlotProps';
import {
  SpineChartTableProps,
  SpineChartTableRowProps,
  SpineChartTable,
} from '@/components/organisms/SpineChartTable';
import {
  HealthDataForArea,
  HealthDataPointTrendEnum,
} from '@/generated-sources/ft-api-client';
import { extractingCombinedHealthData } from '@/lib/chartHelpers/extractHealthDataForArea';
import { IndicatorDocument } from '@/lib/search/searchTypes';
import { SearchParams, SearchStateManager } from '@/lib/searchStateManager';
import { H2 } from 'govuk-react';

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
  searchState,
  indicatorData,
  indicatorMetadata,
}: Readonly<TwoOrMoreIndicatorsViewPlotProps>) {
  const stateManager = SearchStateManager.initialise(searchState);
  const {
    [SearchParams.AreasSelected]: areasSelected,
    [SearchParams.GroupSelected]: selectedGroupCode,
  } = stateManager.getSearchState();

  if (!areasSelected) {
    throw new Error('Invalid parameters provided to view plot');
  }

  const { healthIndicatorData, groupIndicatorData, englandIndicatorData } =
    extractingCombinedHealthData(
      indicatorData,
      areasSelected,
      selectedGroupCode
    );

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

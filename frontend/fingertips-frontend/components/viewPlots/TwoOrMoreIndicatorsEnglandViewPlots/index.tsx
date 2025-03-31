'use client';

import { H2 } from 'govuk-react';
import { TwoOrMoreIndicatorsEnglandViewPlotProps } from '@/components/viewPlots/ViewPlotProps';
import { SearchParams, SearchStateManager } from '@/lib/searchStateManager';
import {
  EnglandAreaTypeTable,
  EnglandAreaTypeTableProps,
} from '@/components/organisms/EnglandAreaTypeTable';
import { extractingIndicatorHealthData } from '@/lib/chartHelpers/extractingIndicatorHealthData';
import { IndicatorDocument } from '@/lib/search/searchTypes';
import {
  HealthDataForArea,
  Indicator,
} from '@/generated-sources/ft-api-client';

export function mapToEnglandAreaTable(
  healthIndicatorData: HealthDataForArea[],
  englandIndicatorData: HealthDataForArea[],
  indicatorMetadata: (IndicatorDocument | undefined)[]
): Readonly<EnglandAreaTypeTableProps> {
  const numberOfIndicators = healthIndicatorData.length;
  const tableData: EnglandAreaTypeTableProps[] = new Array(numberOfIndicators);

  healthIndicatorData.forEach((indicatorData, index) => {
    const metadata = indicatorMetadata[index];

    const indicatorId: number =
      metadata?.indicatorID !== undefined ? Number(metadata?.indicatorID) : 0;

    const indicatorName: string =
      metadata?.indicatorName !== undefined ? metadata?.indicatorName : '';

    const indicatorDefinition: string =
      metadata?.indicatorDefinition !== undefined
        ? metadata?.indicatorDefinition
        : '';

    const measurementUnit: string =
      metadata !== undefined ? metadata?.unitLabel : '';

    const indicatorInfo: Indicator = {
      indicatorId: indicatorId,
      title: indicatorName,
      definition: indicatorDefinition,
    };

    const row: EnglandAreaTypeTableProps = {
      indicator: indicatorInfo,
      measurementUnit: measurementUnit,
      healthIndicatorData: indicatorData,
      englandBenchmarkData: englandIndicatorData[index],
    };

    tableData[index] = row;
  });
  return { rowData: tableData };
}
export function TwoOrMoreIndicatorsEnglandViewPlots({
  indicatorData,
  indicatorMetadata,
  searchState,
}: Readonly<TwoOrMoreIndicatorsEnglandViewPlotProps>) {
  const stateManager = SearchStateManager.initialise(searchState);

  const {
    [SearchParams.AreasSelected]: areasSelected,
    [SearchParams.IndicatorsSelected]: indicatorsSelected,
  } = stateManager.getSearchState();

  const { orderedHealthData, orderedEnglandData, orderedMetadata } =
    extractingIndicatorHealthData(
      indicatorData,
      indicatorMetadata,
      areasSelected
    );

  return (
    <section data-testid="twoOrMoreIndicatorsEnglandViewPlot-component">
      <H2>View data for selected indicators and areas</H2>
      <EnglandAreaTypeTable englandBenchmarkData={orderedEnglandData} />
    </section>
  );
}

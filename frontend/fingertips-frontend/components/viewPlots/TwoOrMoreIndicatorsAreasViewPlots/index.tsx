'use client';

import { TwoOrMoreIndicatorsViewPlotProps } from '@/components/viewPlots/ViewPlotProps';
import { Heatmap, HeatmapIndicatorData } from '@/components/organisms/Heatmap';
import {
  HealthDataForArea,
  IndicatorWithHealthDataForArea,
} from '@/generated-sources/ft-api-client';
import { IndicatorDocument } from '@/lib/search/searchTypes';
import {
  SpineChartTableProps,
  SpineChartTableRowProps,
  SpineChartTable,
} from '@/components/organisms/SpineChartTable';
import { Indicator } from '@/generated-sources/ft-api-client';
import { extractingCombinedHealthData } from '@/lib/chartHelpers/extractHealthDataForArea';
import { SearchParams, SearchStateManager } from '@/lib/searchStateManager';
import { areaCodeForEngland } from '@/lib/chartHelpers/constants';

export function mapToSpineChartTableProps(
  healthIndicatorData: HealthDataForArea[],
  groupIndicatorData: HealthDataForArea[],
  englandIndicatorData: HealthDataForArea[],
  indicatorMetadata: (IndicatorDocument | undefined)[]
): SpineChartTableProps {
  const numberOfIndicators = healthIndicatorData.length;
  const tableData: SpineChartTableRowProps[] = new Array(numberOfIndicators);

  healthIndicatorData.forEach((indicatorData, index) => {
    const metadata = indicatorMetadata[index];

    const rowIndicatorId: number =
      metadata?.indicatorID !== undefined ? Number(metadata?.indicatorID) : 0;

    const rowTitle: string =
      metadata?.indicatorName !== undefined ? metadata?.indicatorName : '';

    const rowIndicatorDefinition: string =
      metadata?.indicatorDefinition !== undefined
        ? metadata?.indicatorDefinition
        : '';

    const rowMeasurementUnit: string =
      metadata !== undefined ? metadata?.unitLabel : '';

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

  const buildHeatmapIndicatorData = (
    indicatorData: IndicatorWithHealthDataForArea[],
    indicatorMetadata: IndicatorDocument[]
  ): HeatmapIndicatorData[] => {
    return indicatorMetadata.map((metadata, index): HeatmapIndicatorData => {
      return {
        indicatorId: metadata.indicatorID,
        indicatorName: metadata.indicatorName,
        healthDataForAreas: indicatorData[index].areaHealthData
          ? indicatorData[index].areaHealthData
          : [],
        unitLabel: metadata.unitLabel,
      };
    });
  };

  const groupAreaCode =
    selectedGroupCode && selectedGroupCode !== areaCodeForEngland
      ? selectedGroupCode
      : undefined;

  const buildSpineTableRowData = (
    indicatorData: IndicatorWithHealthDataForArea[],
    indicatorMetadata: IndicatorDocument[],
    areasSelected: string[],
    selectedGroupCode: string | undefined
  ) => {
    const {
      orderedHealthData,
      orderedGroupData,
      orderedEnglandData,
      orderedMetadata,
    } = extractingCombinedHealthData(
      indicatorData,
      indicatorMetadata,
      areasSelected,
      selectedGroupCode
    );

    return mapToSpineChartTableProps(
      orderedHealthData,
      orderedGroupData,
      orderedEnglandData,
      orderedMetadata
    ).rowData;
  };

  return (
    <section data-testid="twoOrMoreIndicatorsAreasViewPlot-component">
      <Heatmap
        indicatorData={buildHeatmapIndicatorData(
          indicatorData,
          indicatorMetadata
        )}
        groupAreaCode={groupAreaCode}
      />
      {areasSelected.length < 2 ? (
        <SpineChartTable
          rowData={buildSpineTableRowData(
            indicatorData,
            indicatorMetadata,
            areasSelected,
            selectedGroupCode
          )}
        />
      ) : null}
    </section>
  );
}

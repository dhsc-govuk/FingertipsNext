'use client';

import { TwoOrMoreIndicatorsViewPlotProps } from '@/components/viewPlots/ViewPlotProps';
import { Heatmap, HeatmapIndicatorData } from '@/components/organisms/Heatmap';
import {
  HealthDataForArea,
  Indicator,
  IndicatorWithHealthDataForArea,
} from '@/generated-sources/ft-api-client';
import { IndicatorDocument } from '@/lib/search/searchTypes';
import {
  SpineChartTableProps,
  SpineChartTableRowProps,
  SpineChartTable,
} from '@/components/organisms/SpineChartTable';
import {
  HealthDataForArea,
  Indicator,
  IndicatorPolarity,
  QuartileData,
} from '@/generated-sources/ft-api-client';
import { extractAndSortHealthData } from '@/lib/chartHelpers/extractAndSortHealthData';
import { IndicatorDocument } from '@/lib/search/searchTypes';
import { SearchParams, SearchStateManager } from '@/lib/searchStateManager';
import { SpineChartProps } from '@/components/organisms/SpineChart';

export function mapToSpineChartTableIndicator(
  indicatorMetadata: IndicatorDocument | undefined
): Indicator {
  const metadata = indicatorMetadata;

  const rowIndicatorId: number =
    metadata?.indicatorID !== undefined ? Number(metadata?.indicatorID) : 0;

  const rowTitle: string =
    metadata?.indicatorName !== undefined ? metadata?.indicatorName : '';

  const rowIndicatorDefinition: string =
    metadata?.indicatorDefinition !== undefined
      ? metadata?.indicatorDefinition
      : '';

  const rowIndicator: Indicator = {
    indicatorId: rowIndicatorId,
    title: rowTitle,
    definition: rowIndicatorDefinition,
  };

  return rowIndicator;
}

export function mapToSpineChartTableStatistics(
  quartileData: QuartileData
): SpineChartProps {
  const q0Value = quartileData.q0Value !== undefined ? quartileData.q0Value : 0;
  const q1Value = quartileData.q1Value !== undefined ? quartileData.q1Value : 0;
  const q3Value = quartileData.q3Value !== undefined ? quartileData.q3Value : 0;
  const q4Value = quartileData.q4Value !== undefined ? quartileData.q4Value : 0;

  switch (quartileData.polarity) {
    case IndicatorPolarity.LowIsGood:
      return {
        best: q0Value,
        secondBest: q1Value,
        secondWorst: q3Value,
        worst: q4Value,
      };
    case IndicatorPolarity.Unknown:
    case IndicatorPolarity.NoJudgement:
    case IndicatorPolarity.HighIsGood:
    default:
      return {
        best: q4Value,
        secondBest: q3Value,
        secondWorst: q1Value,
        worst: q0Value,
      };
  }
}

export function mapToSpineChartTableProps(
  healthIndicatorData: HealthDataForArea[],
  groupIndicatorData: HealthDataForArea[],
  englandIndicatorData: HealthDataForArea[],
  indicatorMetadata: (IndicatorDocument | undefined)[],
  quartileData: QuartileData[]
): SpineChartTableProps {
  const numberOfIndicators = healthIndicatorData.length;
  const tableData: SpineChartTableRowProps[] = new Array(numberOfIndicators);

  healthIndicatorData.forEach((indicatorData, index) => {
    const rowMeasurementUnit: string =
      indicatorMetadata[index] !== undefined
        ? indicatorMetadata[index]?.unitLabel
        : '';

    const row: SpineChartTableRowProps = {
      indicator: mapToSpineChartTableIndicator(indicatorMetadata[index]),
      measurementUnit: rowMeasurementUnit,
      indicatorHealthData: indicatorData,
      groupIndicatorData: groupIndicatorData[index],
      englandBenchmarkData: englandIndicatorData[index],
      benchmarkStatistics: mapToSpineChartTableStatistics(quartileData[index]),
    };

    tableData[index] = row;
  });

  return { rowData: tableData };
}

export function TwoOrMoreIndicatorsAreasViewPlot({
  searchState,
  indicatorData,
  indicatorMetadata,
  benchmarkStatistics,
}: Readonly<TwoOrMoreIndicatorsViewPlotProps>) {
  const stateManager = SearchStateManager.initialise(searchState);
  const {
    [SearchParams.AreasSelected]: areasSelected,
    [SearchParams.GroupSelected]: selectedGroupCode,
  } = stateManager.getSearchState();

  if (!areasSelected) {
    throw new Error('Invalid parameters provided to view plot');
  }

  const {
    orderedHealthData,
    orderedGroupData,
    orderedEnglandData,
    orderedMetadata,
    orderedQuartileData,
  } = extractAndSortHealthData(
    indicatorData,
    indicatorMetadata,
    areasSelected,
    selectedGroupCode
  );

  const spineTableData = mapToSpineChartTableProps(
    orderedHealthData,
    orderedGroupData,
    orderedEnglandData,
    orderedMetadata,
    orderedQuartileData
  );

  return (
    <section data-testid="twoOrMoreIndicatorsAreasViewPlot-component">
      <Heatmap
        indicatorData={buildHeatmapIndicatorData(
          indicatorData,
          indicatorMetadata
        )}
        groupAreaCode={groupAreaCode}
      />
      {areasSelected.length < 3 ? (
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

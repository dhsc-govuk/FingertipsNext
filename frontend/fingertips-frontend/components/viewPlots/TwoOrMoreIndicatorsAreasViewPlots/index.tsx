'use client';

import { TwoOrMoreIndicatorsViewPlotProps } from '@/components/viewPlots/ViewPlotProps';
import { Heatmap } from '@/components/organisms/Heatmap';
import {
  BenchmarkComparisonMethod,
  HealthDataForArea,
  Indicator,
  IndicatorPolarity,
  IndicatorWithHealthDataForArea,
  QuartileData,
} from '@/generated-sources/ft-api-client';
import { IndicatorDocument } from '@/lib/search/searchTypes';
import {
  SpineChartTableProps,
  SpineChartTableRowProps,
  SpineChartTable,
} from '@/components/organisms/SpineChartTable';
import { SearchParams, SearchStateManager } from '@/lib/searchStateManager';
import { SpineChartProps } from '@/components/organisms/SpineChart';
import { extractingCombinedHealthData } from '@/lib/chartHelpers/extractingCombinedHealthData';
import { HeatmapIndicatorData } from '@/components/organisms/Heatmap/heatmapUtil';

export function mapToSpineChartTableIndicator(
  indicatorMetadata: IndicatorDocument | undefined
): Indicator {
  const metadata = indicatorMetadata;

  const rowIndicatorId: number = Number(metadata?.indicatorID ?? 0);

  const rowTitle: string = metadata?.indicatorName ?? '';

  const rowIndicatorDefinition: string = metadata?.indicatorDefinition ?? '';

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
  const q0Value = quartileData.q0Value ?? 0;
  const q1Value = quartileData.q1Value ?? 0;
  const q3Value = quartileData.q3Value ?? 0;
  const q4Value = quartileData.q4Value ?? 0;

  switch (quartileData.polarity) {
    case IndicatorPolarity.LowIsGood:
      return {
        best: q0Value,
        bestQuartile: q1Value,
        worstQuartile: q3Value,
        worst: q4Value,
      };
    case IndicatorPolarity.Unknown:
    case IndicatorPolarity.NoJudgement:
    case IndicatorPolarity.HighIsGood:
    default:
      return {
        best: q4Value,
        bestQuartile: q3Value,
        worstQuartile: q1Value,
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

export function extractHeatmapIndicatorData(
  indicatorData: IndicatorWithHealthDataForArea,
  metadata: IndicatorDocument
): HeatmapIndicatorData | undefined {
  if (!indicatorData.areaHealthData) {
    return undefined;
  }

  return {
    indicatorId: metadata.indicatorID,
    indicatorName: metadata.indicatorName,
    healthDataForAreas: indicatorData.areaHealthData,
    unitLabel: metadata.unitLabel,
    benchmarkMethod:
      indicatorData.benchmarkMethod ?? BenchmarkComparisonMethod.Unknown,
    polarity: indicatorData.polarity ?? IndicatorPolarity.Unknown,
  };
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

  const buildHeatmapIndicatorData = (
    allIndicatorData: IndicatorWithHealthDataForArea[],
    indicatorMetadata: IndicatorDocument[]
  ): HeatmapIndicatorData[] => {
    return allIndicatorData
      .map((indicatorData) => {
        const metadata = indicatorMetadata.find((metadata) => {
          return metadata.indicatorID === indicatorData.indicatorId?.toString();
        });

        if (!metadata) return undefined;

        return extractHeatmapIndicatorData(indicatorData, metadata);
      })
      .filter((data) => {
        return data !== undefined;
      });
  };

  const groupAreaCode = selectedGroupCode ?? undefined;

  const buildSpineTableRowData = (
    indicatorData: IndicatorWithHealthDataForArea[],
    indicatorMetadata: IndicatorDocument[],
    areasSelected: string[],
    selectedGroupCode: string | undefined
  ): SpineChartTableRowProps[] => {
    const {
      orderedHealthData,
      orderedGroupData,
      orderedEnglandData,
      orderedMetadata,
      orderedQuartileData,
    } = extractingCombinedHealthData(
      indicatorData,
      indicatorMetadata,
      benchmarkStatistics,
      areasSelected,
      selectedGroupCode
    );

    return mapToSpineChartTableProps(
      orderedHealthData,
      orderedGroupData,
      orderedEnglandData,
      orderedMetadata,
      orderedQuartileData
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

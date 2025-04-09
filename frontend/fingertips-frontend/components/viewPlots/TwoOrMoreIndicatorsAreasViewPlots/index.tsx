'use client';

import { TwoOrMoreIndicatorsViewPlotProps } from '@/components/viewPlots/ViewPlotProps';
import { Heatmap } from '@/components/organisms/Heatmap';
import {
  BenchmarkComparisonMethod,
  IndicatorPolarity,
  IndicatorWithHealthDataForArea,
  QuartileData,
} from '@/generated-sources/ft-api-client';
import { IndicatorDocument } from '@/lib/search/searchTypes';
import { SpineChartTable } from '@/components/organisms/SpineChartTable';
import { SearchParams, SearchStateManager } from '@/lib/searchStateManager';
import { HeatmapIndicatorData } from '@/components/organisms/Heatmap/heatmapUtil';
import {
  getHealthDataForArea,
  SpineChartIndicatorData,
} from '@/components/organisms/SpineChartTable/spineChartTableHelpers';

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

  if (!areasSelected || !selectedGroupCode) {
    throw new Error('Invalid parameters provided to view plot');
  }

  /**
   * Organises all the retrieved data into the desired structure for the spine chart.
   */
  const buildSpineChartIndicatorData = (
    allIndicatorData: IndicatorWithHealthDataForArea[],
    allIndicatorMetadata: IndicatorDocument[],
    quartileData: QuartileData[],
    areasSelected: string[],
    selectedGroupCode: string
  ): SpineChartIndicatorData[] => {
    return allIndicatorData.map((indicatorData) => {
      const relevantIndicatorMeta = allIndicatorMetadata.find(
        (indicatorMetaData) => {
          return (
            indicatorMetaData.indicatorID ===
            indicatorData.indicatorId?.toString()
          );
        }
      );

      if (!relevantIndicatorMeta) {
        throw new Error(
          'No indicator AI search metadata found matching health data from API'
        );
      }

      const areasHealthData = areasSelected.map((areaCode) => {
        return getHealthDataForArea(indicatorData.areaHealthData, areaCode);
      });
      const matchedQuartileData = quartileData.find(
        (quartileDataItem) =>
          quartileDataItem.indicatorId === indicatorData.indicatorId
      );

      if (!matchedQuartileData) {
        throw new Error(
          `No quartile data found for the requested indicator ID: ${indicatorData.indicatorId}`
        );
      }

      return {
        indicatorId: relevantIndicatorMeta.indicatorID,
        indicatorName: relevantIndicatorMeta.indicatorName,
        valueUnit: relevantIndicatorMeta.unitLabel,
        benchmarkComparisonMethod: areasHealthData[0].healthData[0].benchmarkComparison?.method,
        // The latest period for the first area's data (health data is sorted be year ASC)
        latestDataPeriod:
          areasHealthData[0].healthData[
            areasHealthData[0].healthData.length - 1
          ].year,
        areasHealthData,
        groupData: getHealthDataForArea(
          indicatorData.areaHealthData,
          selectedGroupCode
        ),
        quartileData: matchedQuartileData,
      };
    });
  };

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

  return (
    <section data-testid="twoOrMoreIndicatorsAreasViewPlot-component">
      {areasSelected.length < 3 ? (
        <SpineChartTable
          indicatorData={buildSpineChartIndicatorData(
            indicatorData,
            indicatorMetadata,
            benchmarkStatistics,
            areasSelected,
            selectedGroupCode
          )}
        />
      ) : null}
      <Heatmap
        indicatorData={buildHeatmapIndicatorData(
          indicatorData,
          indicatorMetadata
        )}
        groupAreaCode={selectedGroupCode}
      />
    </section>
  );
}

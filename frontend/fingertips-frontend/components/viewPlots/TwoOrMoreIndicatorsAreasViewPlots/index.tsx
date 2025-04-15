'use client';

import { TwoOrMoreIndicatorsViewPlotProps } from '@/components/viewPlots/ViewPlotProps';
import { Heatmap } from '@/components/organisms/Heatmap';
import {
  BenchmarkComparisonMethod,
  IndicatorPolarity,
  IndicatorWithHealthDataForArea,
} from '@/generated-sources/ft-api-client';
import { IndicatorDocument } from '@/lib/search/searchTypes';
import { SpineChartTable } from '@/components/organisms/SpineChartTable';
import { SearchParams, SearchStateManager } from '@/lib/searchStateManager';
import { HeatmapIndicatorData } from '@/components/organisms/Heatmap/heatmapUtil';
import {
  buildSpineChartIndicatorData,
  SpineChartIndicatorData,
} from '@/components/organisms/SpineChartTable/spineChartTableHelpers';
import { determineAreaCodes } from '@/lib/chartHelpers/chartHelpers';
import { ALL_AREAS_SELECTED } from '@/lib/areaFilterHelpers/constants';

interface ComponentRenderFlags {
  showHeatmap: boolean;
  showSpineChart: boolean;
}

function getComponentRenderFlags(
  areaCodes: string[],
  spineChartIndicatorData: SpineChartIndicatorData[],
  groupAreaSelected?: string
): ComponentRenderFlags {
  const areAllAreasSelected = groupAreaSelected === ALL_AREAS_SELECTED;

  return {
    showHeatmap: areaCodes.length > 1 || areAllAreasSelected,
    showSpineChart:
      areaCodes.length < 3 &&
      spineChartIndicatorData.length > 0 &&
      !areAllAreasSelected,
  };
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
  availableAreas,
}: Readonly<TwoOrMoreIndicatorsViewPlotProps>) {
  const stateManager = SearchStateManager.initialise(searchState);
  const {
    [SearchParams.AreasSelected]: areasSelected,
    [SearchParams.GroupSelected]: selectedGroupCode,
    [SearchParams.GroupAreaSelected]: groupAreaSelected,
  } = stateManager.getSearchState();

  const areaCodes = determineAreaCodes(
    areasSelected,
    selectedGroupCode,
    availableAreas
  );

  if (!areaCodes || !selectedGroupCode) {
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

  const spineChartIndicatorData = buildSpineChartIndicatorData(
    indicatorData,
    indicatorMetadata,
    benchmarkStatistics,
    areaCodes,
    selectedGroupCode
  );
  const { showHeatmap, showSpineChart } = getComponentRenderFlags(
    areaCodes,
    spineChartIndicatorData,
    groupAreaSelected
  );

  return (
    <section data-testid="twoOrMoreIndicatorsAreasViewPlot-component">
      {showSpineChart ? (
        <SpineChartTable indicatorData={spineChartIndicatorData} />
      ) : null}
      {showHeatmap ? (
        <Heatmap
          indicatorData={buildHeatmapIndicatorData(
            indicatorData,
            indicatorMetadata
          )}
          groupAreaCode={selectedGroupCode}
        />
      ) : null}
    </section>
  );
}

'use client';

import { TwoOrMoreIndicatorsViewPlotProps } from '@/components/viewPlots/ViewPlot.types';
import { Heatmap } from '@/components/organisms/Heatmap';
import {
  BenchmarkComparisonMethod,
  IndicatorPolarity,
  IndicatorWithHealthDataForArea,
} from '@/generated-sources/ft-api-client';
import { IndicatorDocument } from '@/lib/search/searchTypes';
import { SpineChartTable } from '@/components/organisms/SpineChartTable';
import { SearchParams } from '@/lib/searchStateManager';
import { HeatmapIndicatorData } from '@/components/organisms/Heatmap/heatmapUtil';
import {
  buildSpineChartIndicatorData,
  SpineChartIndicatorData,
} from '@/components/organisms/SpineChartTable/spineChartTableHelpers';
import {
  determineAreaCodes,
  determineAreasForBenchmarking,
  determineBenchmarkToUse,
} from '@/lib/chartHelpers/chartHelpers';
import { ALL_AREAS_SELECTED } from '@/lib/areaFilterHelpers/constants';
import { StyleChartWrapper } from '@/components/styles/viewPlotStyles/styleChartWrapper';
import { BenchmarkSelectArea } from '@/components/molecules/BenchmarkSelectArea';
import { englandAreaString } from '@/lib/chartHelpers/constants';
import { useSearchStateParams } from '@/components/hooks/useSearchStateParams';

function shouldShowHeatmap(
  areaCodes: string[],
  groupAreaSelected?: string
): boolean {
  return areaCodes.length > 1 || groupAreaSelected === ALL_AREAS_SELECTED;
}

function shouldShowSpineChart(
  areaCodes: string[],
  spineChartIndicatorData: SpineChartIndicatorData[],
  groupAreaSelected?: string
): boolean {
  return (
    areaCodes.length < 3 &&
    spineChartIndicatorData.length > 0 &&
    groupAreaSelected !== ALL_AREAS_SELECTED
  );
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
    benchmarkComparisonMethod:
      indicatorData.benchmarkMethod ?? BenchmarkComparisonMethod.Unknown,
    polarity: indicatorData.polarity ?? IndicatorPolarity.Unknown,
  };
}

export function TwoOrMoreIndicatorsAreasViewPlot({
  indicatorData,
  indicatorMetadata,
  benchmarkStatistics,
  availableAreas,
}: Readonly<TwoOrMoreIndicatorsViewPlotProps>) {
  const searchState = useSearchStateParams();

  const {
    [SearchParams.AreasSelected]: areasSelected,
    [SearchParams.GroupSelected]: selectedGroupCode,
    [SearchParams.GroupAreaSelected]: groupAreaSelected,
    [SearchParams.BenchmarkAreaSelected]: benchmarkAreaSelected,
  } = searchState;

  const areaCodes = determineAreaCodes(
    areasSelected,
    groupAreaSelected,
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

  const availableAreasForBenchmarking = determineAreasForBenchmarking(
    indicatorData[0].areaHealthData ?? [],
    selectedGroupCode,
    areasSelected,
    groupAreaSelected
  );

  const benchmarkToUse = determineBenchmarkToUse(benchmarkAreaSelected);

  return (
    <section data-testid="twoOrMoreIndicatorsAreasViewPlot-component">
      <BenchmarkSelectArea availableAreas={availableAreasForBenchmarking} />
      {shouldShowSpineChart(
        areaCodes,
        spineChartIndicatorData,
        groupAreaSelected
      ) ? (
        <StyleChartWrapper>
          <SpineChartTable
            indicatorData={spineChartIndicatorData}
            benchmarkToUse={benchmarkToUse}
          />
        </StyleChartWrapper>
      ) : null}
      {shouldShowHeatmap(areaCodes, groupAreaSelected) ? (
        <StyleChartWrapper>
          <Heatmap
            indicatorData={buildHeatmapIndicatorData(
              indicatorData,
              indicatorMetadata
            )}
            groupAreaCode={selectedGroupCode}
            benchmarkAreaCode={benchmarkToUse}
            benchmarkAreaName={
              availableAreasForBenchmarking?.find((area) => {
                return area.code === benchmarkToUse;
              })?.name ?? englandAreaString
            }
          />
        </StyleChartWrapper>
      ) : null}
    </section>
  );
}

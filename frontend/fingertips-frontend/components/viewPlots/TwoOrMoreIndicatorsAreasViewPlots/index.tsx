'use client';

import { TwoOrMoreIndicatorsViewPlotProps } from '@/components/viewPlots/ViewPlot.types';
import { Heatmap } from '@/components/charts/HeatMap';
import { SearchParams } from '@/lib/searchStateManager';
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
import { SpineChartWrapper } from '@/components/charts/SpineChart/SpineChartWrapper';
import { spineChartIsRequired } from '@/components/charts/SpineChart/helpers/spineChartIsRequired';
import { H3 } from 'govuk-react';
import { buildHeatmapIndicatorData } from '@/components/charts/HeatMap/helpers/buildHeatMapIndicatorData';
import {
  chartTitleConfig,
  ChartTitleKeysEnum,
} from '@/lib/ChartTitles/chartTitleEnums';
import { AvailableChartLinks } from '@/components/organisms/AvailableChartLinks';

function shouldShowHeatmap(
  areaCodes: string[],
  groupAreaSelected?: string
): boolean {
  return areaCodes.length > 1 || groupAreaSelected === ALL_AREAS_SELECTED;
}

export function TwoOrMoreIndicatorsAreasViewPlot({
  indicatorData,
  indicatorMetadata,
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

  const availableAreasForBenchmarking = determineAreasForBenchmarking(
    indicatorData[0].areaHealthData ?? [],
    selectedGroupCode,
    areasSelected,
    groupAreaSelected
  );

  const benchmarkToUse = determineBenchmarkToUse(benchmarkAreaSelected);

  const showSpine = spineChartIsRequired(searchState);

  const showHeatmap = shouldShowHeatmap(areaCodes, groupAreaSelected);

  const availableChartLinks: ChartTitleKeysEnum[] = [];
  if (showSpine) availableChartLinks.push(ChartTitleKeysEnum.SpineChart);
  if (showHeatmap) availableChartLinks.push(ChartTitleKeysEnum.Heatmap);
  availableChartLinks.push(ChartTitleKeysEnum.PopulationPyramid);

  return (
    <section data-testid="twoOrMoreIndicatorsAreasViewPlot-component">
      <AvailableChartLinks availableCharts={availableChartLinks} />
      <BenchmarkSelectArea availableAreas={availableAreasForBenchmarking} />
      {showSpine ? (
        <StyleChartWrapper>
          <SpineChartWrapper />
        </StyleChartWrapper>
      ) : null}
      {shouldShowHeatmap(areaCodes, groupAreaSelected) ? (
        <StyleChartWrapper>
          <H3 id={ChartTitleKeysEnum.Heatmap}>
            {chartTitleConfig[ChartTitleKeysEnum.Heatmap].title}
          </H3>
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

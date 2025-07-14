'use client';

import { TwoOrMoreIndicatorsViewPlotProps } from '@/components/viewPlots/ViewPlot.types';
import { SearchParams } from '@/lib/searchStateManager';
import {
  determineAreaCodes,
  determineAreasForBenchmarking,
} from '@/lib/chartHelpers/chartHelpers';
import { ALL_AREAS_SELECTED } from '@/lib/areaFilterHelpers/constants';
import { StyleChartWrapper } from '@/components/styles/viewPlotStyles/styleChartWrapper';
import { BenchmarkSelectArea } from '@/components/molecules/BenchmarkSelectArea';
import { useSearchStateParams } from '@/components/hooks/useSearchStateParams';
import { SpineChartWrapper } from '@/components/charts/SpineChart/SpineChartWrapper';
import { spineChartIsRequired } from '@/components/charts/SpineChart/helpers/spineChartIsRequired';
import { MultipleIndicatorHeatMap } from '@/components/charts/HeatMap/MultipleIndicatorHeatMap';
import {
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
  availableAreas,
}: Readonly<TwoOrMoreIndicatorsViewPlotProps>) {
  const searchState = useSearchStateParams();

  const {
    [SearchParams.AreasSelected]: areasSelected,
    [SearchParams.GroupSelected]: selectedGroupCode,
    [SearchParams.GroupAreaSelected]: groupAreaSelected,
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
        <MultipleIndicatorHeatMap />
      ) : null}
    </section>
  );
}

import { H3 } from 'govuk-react';
import { englandAreaString } from '@/lib/chartHelpers/constants';
import { StyleChartWrapper } from '@/components/styles/viewPlotStyles/styleChartWrapper';
import { useSearchStateParams } from '@/components/hooks/useSearchStateParams';
import { SearchParams } from '@/lib/searchStateManager';
import { useMultipleIndicatorData } from '@/components/charts/hooks/useMultipleIndicatorData';
import {
  determineAreasForBenchmarking,
  determineBenchmarkToUse,
} from '@/lib/chartHelpers/chartHelpers';
import { Heatmap } from '@/components/charts/HeatMap/index';
import { buildHeatmapIndicatorData } from '@/components/charts/HeatMap/helpers/buildHeatMapIndicatorData';

export function MultipleIndicatorHeatMap() {
  const searchState = useSearchStateParams();
  const {
    [SearchParams.AreasSelected]: areasSelected,
    [SearchParams.GroupSelected]: selectedGroupCode,
    [SearchParams.BenchmarkAreaSelected]: benchmarkAreaSelected,
    [SearchParams.GroupAreaSelected]: groupAreaSelected,
  } = searchState;

  const { indicatorMetaData, healthData } = useMultipleIndicatorData();
  if (!indicatorMetaData || !healthData) return null;

  const availableAreasForBenchmarking = determineAreasForBenchmarking(
    healthData[0].areaHealthData ?? [],
    selectedGroupCode,
    areasSelected,
    groupAreaSelected
  );

  const benchmarkToUse = determineBenchmarkToUse(benchmarkAreaSelected);

  return (
    <StyleChartWrapper>
      <H3>Overview of indicators and areas</H3>
      <Heatmap
        indicatorData={buildHeatmapIndicatorData(healthData, indicatorMetaData)}
        groupAreaCode={selectedGroupCode ?? ''}
        benchmarkAreaCode={benchmarkToUse}
        benchmarkAreaName={
          availableAreasForBenchmarking?.find((area) => {
            return area.code === benchmarkToUse;
          })?.name ?? englandAreaString
        }
      />
    </StyleChartWrapper>
  );
}

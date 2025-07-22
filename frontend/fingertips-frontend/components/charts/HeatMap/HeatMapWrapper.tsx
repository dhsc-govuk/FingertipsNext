import { H3 } from 'govuk-react';
import { englandAreaString } from '@/lib/chartHelpers/constants';
import { StyleChartWrapper } from '@/components/styles/viewPlotStyles/styleChartWrapper';
import { useSearchStateParams } from '@/components/hooks/useSearchStateParams';
import { SearchParams } from '@/lib/searchStateManager';
import {
  determineAreasForBenchmarking,
  determineBenchmarkToUse,
} from '@/lib/chartHelpers/chartHelpers';
import { HeatMap } from '@/components/charts/HeatMap/HeatMap';
import { buildHeatmapIndicatorData } from '@/components/charts/HeatMap/helpers/buildHeatMapIndicatorData';
import { IndicatorWithHealthDataForArea } from '@/generated-sources/ft-api-client';
import { IndicatorDocument } from '@/lib/search/searchTypes';
import { heatMapText } from '@/components/charts/HeatMap/heatmapConstants';

interface HeatMapWrapperProps {
  indicatorMetaData: IndicatorDocument[];
  healthData: IndicatorWithHealthDataForArea[];
  title?: string;
  subTitle?: string;
}

export function HeatMapWrapper({
  indicatorMetaData,
  healthData,
  title = heatMapText.multipleIndicator.title,
  subTitle,
}: Readonly<HeatMapWrapperProps>) {
  const searchState = useSearchStateParams();
  const {
    [SearchParams.AreasSelected]: areasSelected,
    [SearchParams.GroupSelected]: selectedGroupCode,
    [SearchParams.BenchmarkAreaSelected]: benchmarkAreaSelected,
    [SearchParams.GroupAreaSelected]: groupAreaSelected,
  } = searchState;

  if (!indicatorMetaData.length || !healthData.length) return null;

  const availableAreasForBenchmarking = determineAreasForBenchmarking(
    healthData[0].areaHealthData ?? [],
    selectedGroupCode,
    areasSelected,
    groupAreaSelected
  );

  const benchmarkToUse = determineBenchmarkToUse(benchmarkAreaSelected);

  return (
    <StyleChartWrapper>
      <H3>{title}</H3>
      <HeatMap
        title={subTitle}
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

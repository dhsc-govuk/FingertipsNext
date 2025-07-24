'use client';

import { SpineChartTable } from '@/components/charts/SpineChart/SpineChartTable/SpineChartTable';
import { determineBenchmarkToUse } from '@/lib/chartHelpers/chartHelpers';
import { SearchParams } from '@/lib/searchStateManager';
import { useSearchStateParams } from '@/components/hooks/useSearchStateParams';

import { useSpineChartData } from '@/components/charts/SpineChart/hooks/useSpineChartData';
import { StyleChartWrapper } from '@/components/styles/viewPlotStyles/styleChartWrapper';
import { useOneIndicatorData } from '@/components/charts/hooks/useOneIndicatorData';
import {
  chartTitleConfig,
  ChartTitleKeysEnum,
} from '@/lib/ChartTitles/chartTitleEnums';

export function SingleIndicatorSpineChart() {
  const searchState = useSearchStateParams();
  const { [SearchParams.BenchmarkAreaSelected]: benchmarkAreaSelected } =
    searchState;

  const benchmarkToUse = determineBenchmarkToUse(benchmarkAreaSelected);

  const { healthData, indicatorMetaData } = useOneIndicatorData();
  const spineChartIndicatorData = useSpineChartData(
    healthData ? [healthData] : [],
    indicatorMetaData ? [indicatorMetaData] : []
  );

  if (!spineChartIndicatorData) return null;

  return (
    <StyleChartWrapper>
      <SpineChartTable
        title={
          chartTitleConfig[ChartTitleKeysEnum.SingleIndicatorSpineChart].title
        }
        indicatorData={spineChartIndicatorData}
        benchmarkToUse={benchmarkToUse}
      />
    </StyleChartWrapper>
  );
}

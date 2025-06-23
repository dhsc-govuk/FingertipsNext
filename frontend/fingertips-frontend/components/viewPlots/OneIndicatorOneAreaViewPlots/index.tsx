'use client';

import { determineAreasForBenchmarking } from '@/lib/chartHelpers/chartHelpers';
import { SearchParams } from '@/lib/searchStateManager';
import { OneIndicatorViewPlotProps } from '../ViewPlot.types';
import {
  BenchmarkComparisonMethod,
  IndicatorPolarity,
} from '@/generated-sources/ft-api-client';
import { Inequalities } from '@/components/organisms/Inequalities';
import { BenchmarkSelectArea } from '@/components/molecules/BenchmarkSelectArea';
import { useSearchStateParams } from '@/components/hooks/useSearchStateParams';
import { LineChartAndTableOverTime } from '@/components/charts/LineChartOverTime/LineChartAndTableOverTime';
import { lineChartOverTimeIsRequired } from '@/components/charts/LineChartOverTime/helpers/lineChartOverTimeIsRequired';

export function OneIndicatorOneAreaViewPlots({
  indicatorData,
  indicatorMetadata,
}: Readonly<OneIndicatorViewPlotProps>) {
  const searchState = useSearchStateParams();
  const {
    [SearchParams.GroupSelected]: selectedGroupCode,
    [SearchParams.AreasSelected]: areasSelected,
  } = searchState;

  const polarity = indicatorData.polarity as IndicatorPolarity;
  const benchmarkComparisonMethod =
    indicatorData.benchmarkMethod as BenchmarkComparisonMethod;

  const healthIndicatorData = indicatorData?.areaHealthData ?? [];

  const availableAreasForBenchmarking = determineAreasForBenchmarking(
    healthIndicatorData,
    selectedGroupCode,
    areasSelected
  );

  const showLineChartOverTime = lineChartOverTimeIsRequired(searchState);

  return (
    <section data-testid="oneIndicatorOneAreaViewPlot-component">
      <BenchmarkSelectArea
        availableAreas={availableAreasForBenchmarking}
        benchmarkAreaSelectedKey={SearchParams.BenchmarkAreaSelected}
      />
      {showLineChartOverTime ? <LineChartAndTableOverTime /> : null}

      <Inequalities
        healthIndicatorData={healthIndicatorData}
        indicatorMetadata={indicatorMetadata}
        benchmarkComparisonMethod={benchmarkComparisonMethod}
        polarity={polarity}
        dataSource={indicatorMetadata?.dataSource}
      />
    </section>
  );
}

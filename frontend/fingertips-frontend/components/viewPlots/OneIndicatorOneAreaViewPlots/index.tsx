'use client';

import { determineAreasForBenchmarking } from '@/lib/chartHelpers/chartHelpers';
import { SearchParams } from '@/lib/searchStateManager';
import { OneIndicatorViewPlotProps } from '../ViewPlot.types';
import { Inequalities } from '@/components/charts/Inequalities/Inequalities';
import { BenchmarkSelectArea } from '@/components/molecules/BenchmarkSelectArea';
import { useSearchStateParams } from '@/components/hooks/useSearchStateParams';
import { LineChartAndTableOverTime } from '@/components/charts/LineChartOverTime/LineChartAndTableOverTime';
import { lineChartOverTimeIsRequired } from '@/components/charts/LineChartOverTime/helpers/lineChartOverTimeIsRequired';
import { OneIndicatorSegmentationOptions } from '@/components/viewPlots/OneIndicatorSegmentationOptions';

export function OneIndicatorOneAreaViewPlots({
  indicatorData,
  session,
}: Readonly<OneIndicatorViewPlotProps>) {
  const searchState = useSearchStateParams();
  const {
    [SearchParams.GroupSelected]: selectedGroupCode,
    [SearchParams.AreasSelected]: areasSelected,
  } = searchState;

  const healthIndicatorData = indicatorData?.areaHealthData ?? [];

  const availableAreasForBenchmarking = determineAreasForBenchmarking(
    healthIndicatorData,
    selectedGroupCode,
    areasSelected
  );

  const showLineChartOverTime = lineChartOverTimeIsRequired(searchState);

  return (
    <section data-testid="oneIndicatorOneAreaViewPlot-component">
      <BenchmarkSelectArea availableAreas={availableAreasForBenchmarking} />
      {showLineChartOverTime ? (
        <>
          <OneIndicatorSegmentationOptions />
          <LineChartAndTableOverTime session={session} />
        </>
      ) : null}

      <Inequalities />
    </section>
  );
}

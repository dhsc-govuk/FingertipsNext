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
import { SingleIndicatorBasicTable } from '@/components/charts/BasicTable/SingleIndicatorBasicTable';
import { singleIndicatorBasicTableIsRequired } from '@/components/charts/BasicTable/helpers/singleIndicatorBasicTableIsRequired';
import { AvailableChartLinks } from '@/components/organisms/AvailableChartLinks';
import { ChartTitleKeysEnum } from '@/lib/ChartTitles/chartTitleEnums';

export function OneIndicatorOneAreaViewPlots({
  indicatorData,
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
  const showBasicTable = singleIndicatorBasicTableIsRequired(searchState);

  const availableChartLinks: string[] = [
    ChartTitleKeysEnum.InequalitiesBarChart,
    ChartTitleKeysEnum.InequalitiesLineChart,
    ChartTitleKeysEnum.PopulationPyramid,
  ];

  if (showLineChartOverTime)
    availableChartLinks.unshift(ChartTitleKeysEnum.LineChart);

  return (
    <section data-testid="oneIndicatorOneAreaViewPlot-component">
      <AvailableChartLinks
        availableCharts={availableChartLinks}
      ></AvailableChartLinks>
      <BenchmarkSelectArea availableAreas={availableAreasForBenchmarking} />
      {showBasicTable ? <SingleIndicatorBasicTable /> : null}
      {showLineChartOverTime ? (
        <>
          <OneIndicatorSegmentationOptions />
          <LineChartAndTableOverTime />
        </>
      ) : null}

      <Inequalities />
    </section>
  );
}

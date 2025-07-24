'use client';

import { determineAreasForBenchmarking } from '@/lib/chartHelpers/chartHelpers';
import { SearchParams } from '@/lib/searchStateManager';
import { OneIndicatorViewPlotProps } from '@/components/viewPlots/ViewPlot.types';
import { ALL_AREAS_SELECTED } from '@/lib/areaFilterHelpers/constants';
import { BenchmarkSelectArea } from '@/components/molecules/BenchmarkSelectArea';
import { useSearchStateParams } from '@/components/hooks/useSearchStateParams';
import { lineChartOverTimeIsRequired } from '@/components/charts/LineChartOverTime/helpers/lineChartOverTimeIsRequired';
import { LineChartAndTableOverTime } from '@/components/charts/LineChartOverTime/LineChartAndTableOverTime';
import { CompareAreasTable } from '@/components/charts/CompareAreasTable/CompareAreasTable';
import { compareAreasTableIsRequired } from '@/components/charts/CompareAreasTable/helpers/compareAreasTableIsRequired';
import { OneIndicatorSegmentationOptions } from '@/components/viewPlots/OneIndicatorSegmentationOptions';
import { ThematicMapWrapper } from '@/components/charts/ThematicMap/ThematicMapWrapper';
import { SingleIndicatorHeatMap } from '@/components/charts/HeatMap/SingleIndicatorHeatMap';
import { AvailableChartLinks } from '@/components/organisms/AvailableChartLinks';
import { ChartTitleKeysEnum } from '@/lib/ChartTitles/chartTitleEnums';
import { useLineChartOverTimeData } from '@/components/charts/LineChartOverTime/hooks/useLineChartOverTimeData';
import { spineChartIsRequired } from '@/components/charts/SpineChart/helpers/spineChartIsRequired';
import { SingleIndicatorSpineChart } from '@/components/charts/SpineChart/SingleIndicatorSpineChart';
import { heatMapIsRequired } from '@/components/charts/HeatMap/helpers/heatMapIsRequired';

export function OneIndicatorTwoOrMoreAreasViewPlots({
  indicatorData,
}: Readonly<OneIndicatorViewPlotProps>) {
  const searchState = useSearchStateParams();

  const {
    [SearchParams.GroupSelected]: selectedGroupCode,
    [SearchParams.GroupAreaSelected]: selectedGroupArea,
    [SearchParams.AreasSelected]: areasSelected,
  } = searchState;

  const healthIndicatorData = indicatorData?.areaHealthData ?? [];

  const availableAreasForBenchmarking = determineAreasForBenchmarking(
    healthIndicatorData,
    selectedGroupCode,
    areasSelected,
    selectedGroupArea
  );

  const showLineChartOverTime = lineChartOverTimeIsRequired(searchState);
  const showCompareAreasTable = compareAreasTableIsRequired(searchState);
  const showThematicMap = selectedGroupArea === ALL_AREAS_SELECTED;
  const showLineChartLink = useLineChartOverTimeData();
  const showSpine = spineChartIsRequired(searchState);
  const showHeatMap = heatMapIsRequired(searchState);

  const availableChartLinks: ChartTitleKeysEnum[] = [];

  if (showSpine) {
    availableChartLinks.push(ChartTitleKeysEnum.SingleIndicatorSpineChart);
  }

  if (showLineChartLink) {
    availableChartLinks.push(ChartTitleKeysEnum.LineChart);
  }

  if (showThematicMap) {
    availableChartLinks.push(ChartTitleKeysEnum.ThematicMap);
  }

  if (showCompareAreasTable) {
    availableChartLinks.push(ChartTitleKeysEnum.BarChartEmbeddedTable);
  }
  availableChartLinks.push(ChartTitleKeysEnum.PopulationPyramid);
  return (
    <section data-testid="oneIndicatorTwoOrMoreAreasViewPlots-component">
      <AvailableChartLinks
        availableCharts={availableChartLinks}
      ></AvailableChartLinks>
      <BenchmarkSelectArea availableAreas={availableAreasForBenchmarking} />
      {showSpine ? <SingleIndicatorSpineChart /> : null}
      {showHeatMap ? <SingleIndicatorHeatMap /> : null}
      <OneIndicatorSegmentationOptions />
      {showLineChartOverTime ? <LineChartAndTableOverTime /> : null}
      {showThematicMap ? <ThematicMapWrapper /> : null}
      {showCompareAreasTable ? <CompareAreasTable /> : null}
    </section>
  );
}

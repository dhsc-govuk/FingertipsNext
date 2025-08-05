'use client';

import { TwoOrMoreIndicatorsViewPlotProps } from '@/components/viewPlots/ViewPlot.types';
import { SearchParams } from '@/lib/searchStateManager';
import {
  determineAreaCodes,
  determineAreasForBenchmarking,
} from '@/lib/chartHelpers/chartHelpers';
import { BenchmarkSelectArea } from '@/components/molecules/BenchmarkSelectArea';
import { useSearchStateParams } from '@/components/hooks/useSearchStateParams';
import { MultipleIndicatorSpineChart } from '@/components/charts/SpineChart/MultipleIndicatorSpineChart';
import { spineChartIsRequired } from '@/components/charts/SpineChart/helpers/spineChartIsRequired';
import { MultipleIndicatorHeatMap } from '@/components/charts/HeatMap/MultipleIndicatorHeatMap';
import { ChartTitleKeysEnum } from '@/lib/ChartTitles/chartTitleEnums';
import { AvailableChartLinks } from '@/components/organisms/AvailableChartLinks';
import { heatMapIsRequired } from '@/components/charts/HeatMap/helpers/heatMapIsRequired';
import { MultipleIndicatorBasicTable } from '@/components/charts/BasicTable/MultipleIndicatorBasicTable';
import { singleIndicatorBasicTableIsRequired } from '@/components/charts/BasicTable/helpers/singleIndicatorBasicTableIsRequired';
import { useApiAvailableAreas } from '@/components/charts/hooks/useApiAvailableAreas';

export function TwoOrMoreIndicatorsAreasViewPlot({
  indicatorData,
}: Readonly<TwoOrMoreIndicatorsViewPlotProps>) {
  const searchState = useSearchStateParams();
  const { availableAreas } = useApiAvailableAreas();

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

  const showBasicTable = singleIndicatorBasicTableIsRequired(searchState);
  const showSpine = spineChartIsRequired(searchState);
  const showHeatmap = heatMapIsRequired(searchState);

  const availableChartLinks: ChartTitleKeysEnum[] = [];
  if (showBasicTable)
    availableChartLinks.push(ChartTitleKeysEnum.BasicTableChart);
  if (showSpine) availableChartLinks.push(ChartTitleKeysEnum.SpineChart);
  if (showHeatmap) availableChartLinks.push(ChartTitleKeysEnum.Heatmap);
  availableChartLinks.push(ChartTitleKeysEnum.PopulationPyramid);

  return (
    <section data-testid="twoOrMoreIndicatorsAreasViewPlot-component">
      <AvailableChartLinks availableCharts={availableChartLinks} />
      <BenchmarkSelectArea availableAreas={availableAreasForBenchmarking} />
      {showBasicTable ? <MultipleIndicatorBasicTable /> : null}
      {showSpine ? <MultipleIndicatorSpineChart /> : null}
      {showHeatmap ? <MultipleIndicatorHeatMap /> : null}
    </section>
  );
}

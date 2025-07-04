import { SearchParams, SearchStateParams } from '@/lib/searchStateManager';
import { healthDataRequestAreas } from '@/components/charts/SpineChart/helpers/healthDataRequestAreas';
import { determineBenchmarkRefType } from '@/lib/ViewsHelpers';
import {
  BenchmarkReferenceType,
  GetHealthDataForAnIndicatorRequest,
} from '@/generated-sources/ft-api-client';
import { chunkArray } from '@/lib/chunkArray';

export const spineChartRequestParams = (searchState: SearchStateParams) => {
  const {
    [SearchParams.IndicatorsSelected]: indicatorIds = [],
    [SearchParams.GroupSelected]: selectedGroupCode,
    [SearchParams.BenchmarkAreaSelected]: benchmarkAreaSelected,
  } = searchState;

  const areasToRequest = healthDataRequestAreas(searchState);

  const benchmarkRefType = determineBenchmarkRefType(benchmarkAreaSelected);

  const areaGroup =
    benchmarkRefType === BenchmarkReferenceType.SubNational
      ? selectedGroupCode
      : undefined;

  return indicatorIds.flatMap((id) =>
    areasToRequest.flatMap((requestAreas) =>
      chunkArray(requestAreas.areaCodes).map(
        (areaCodes): GetHealthDataForAnIndicatorRequest => ({
          indicatorId: Number(id),
          areaCodes: areaCodes,
          areaType: requestAreas.areaType,
          inequalities: requestAreas.inequalities,
          latestOnly: true,
          benchmarkRefType,
          ancestorCode: areaGroup,
        })
      )
    )
  );
};

import { useSpineChartRequestParams } from '@/components/charts/SpineChart/hooks/useSpineChartRequestParams';
import { useApiGetHealthDataForMultipleIndicators } from '@/components/charts/hooks/useApiGetHealthDataForMultipleIndicators';
import { useSearchStateParams } from '@/components/hooks/useSearchStateParams';
import { useQuartilesRequestParams } from '@/components/charts/SpineChart/hooks/useQuartilesRequestParams';
import { useApiGetQuartiles } from '@/components/charts/hooks/useApiGetQuartiles';
import { useApiGetIndicatorMetaDatas } from '@/components/charts/hooks/useApiGetIndicatorMetaDatas';
import { determineAreaCodes } from '@/lib/chartHelpers/chartHelpers';
import { indicatorWithHealthDataForAreaCombined } from '@/lib/healthDataHelpers/indicatorWithHealthDataForAreaCombined';
import { buildSpineChartIndicatorData } from '@/components/charts/SpineChart/helpers/buildSpineChartIndicatorData';
import { SearchParams } from '@/lib/searchStateManager';

export const useSpineChartData = () => {
  const searchState = useSearchStateParams();
  const {
    [SearchParams.IndicatorsSelected]: indicatorIds = [],
    [SearchParams.GroupSelected]: selectedGroupCode,
    [SearchParams.AreasSelected]: areasSelected,
    [SearchParams.GroupAreaSelected]: groupAreaSelected,
  } = searchState;
  const quartileParams = useQuartilesRequestParams();
  const { quartileData } = useApiGetQuartiles(quartileParams);
  const { indicatorMetaData } = useApiGetIndicatorMetaDatas(indicatorIds);

  const areaCodes = determineAreaCodes(areasSelected, groupAreaSelected);
  const requestParams = useSpineChartRequestParams();

  const { healthData } =
    useApiGetHealthDataForMultipleIndicators(requestParams);

  if (
    !quartileData ||
    !areaCodes.length ||
    !selectedGroupCode ||
    !healthData.length ||
    !indicatorMetaData.length
  ) {
    return;
  }

  const combinedHealthData = indicatorWithHealthDataForAreaCombined(healthData);

  return buildSpineChartIndicatorData(
    combinedHealthData,
    indicatorMetaData,
    quartileData,
    areaCodes,
    selectedGroupCode
  );
};

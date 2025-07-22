import { useSearchStateParams } from '@/components/hooks/useSearchStateParams';
import { useQuartilesRequestParams } from '@/components/charts/SpineChart/hooks/useQuartilesRequestParams';
import { useApiGetQuartiles } from '@/components/charts/hooks/useApiGetQuartiles';
import { determineAreaCodes } from '@/lib/chartHelpers/chartHelpers';
import { indicatorWithHealthDataForAreaCombined } from '@/lib/healthDataHelpers/indicatorWithHealthDataForAreaCombined';
import { buildSpineChartIndicatorData } from '@/components/charts/SpineChart/helpers/buildSpineChartIndicatorData';
import { SearchParams } from '@/lib/searchStateManager';
import { useMultipleIndicatorData } from '@/components/charts/hooks/useMultipleIndicatorData';

export const useSpineChartData = () => {
  const searchState = useSearchStateParams();
  const {
    [SearchParams.GroupSelected]: selectedGroupCode,
    [SearchParams.AreasSelected]: areasSelected,
    [SearchParams.GroupAreaSelected]: groupAreaSelected,
  } = searchState;
  const quartileParams = useQuartilesRequestParams();
  const { quartileData } = useApiGetQuartiles(quartileParams);

  const { healthData, indicatorMetaData } = useMultipleIndicatorData();

  const areaCodes = determineAreaCodes(areasSelected, groupAreaSelected);
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

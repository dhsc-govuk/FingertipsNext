import { useApiGetHealthDataForAnIndicator } from '@/components/charts/hooks/useApiGetHealthDataForAnIndicator';
import { useApiAvailableAreas } from '@/components/charts/hooks/useApiAvailableAreas';
import { useSearchStateParams } from '@/components/hooks/useSearchStateParams';
import { populationPyramidRequestParams } from '@/components/charts/PopulationPyramid/helpers/populationPyramidRequestParams';

export const usePopulationPyramidData = () => {
  const { availableAreas = [] } = useApiAvailableAreas();
  const search = useSearchStateParams();
  const requestParams = populationPyramidRequestParams(search, availableAreas);
  return useApiGetHealthDataForAnIndicator(requestParams);
};

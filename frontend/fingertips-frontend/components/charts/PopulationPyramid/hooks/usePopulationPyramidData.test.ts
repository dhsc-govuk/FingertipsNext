// MUST BE AT THE TOP DUE TO HOISTING OF MOCKED MODULES
import { mockUseSearchStateParams } from '@/mock/utils/mockUseSearchStateParams';
//
import { SearchParams } from '@/lib/searchStateManager';
import { renderHook } from '@testing-library/react';
import { testRenderWrapper } from '@/mock/utils/testRenderQueryClient';
import { populationPyramidRequestParams } from '@/components/charts/PopulationPyramid/helpers/populationPyramidRequestParams';
import {
  EndPoints,
  queryKeyFromRequestParams,
} from '@/components/charts/helpers/queryKeyFromRequestParams';
import { SeedData } from '@/components/atoms/SeedQueryCache/seedQueryCache.types';
import { usePopulationPyramidData } from '@/components/charts/PopulationPyramid/hooks/usePopulationPyramidData';
import { mockIndicatorWithHealthDataForArea } from '@/mock/data/mockIndicatorWithHealthDataForArea';

const testSearch = {
  [SearchParams.AreasSelected]: ['a'],
  [SearchParams.GroupSelected]: 'g1',
  [SearchParams.AreaTypeSelected]: 'regions',
};

const testHealthData = mockIndicatorWithHealthDataForArea();

mockUseSearchStateParams.mockReturnValue(testSearch);

describe('usePopulationPyramidData', () => {
  it('should request data for using the population request params', () => {
    const queryParams = populationPyramidRequestParams(testSearch, []);
    const queryKey = queryKeyFromRequestParams(
      EndPoints.HealthDataForAnIndicator,
      queryParams
    );
    const seedData: SeedData = {
      [queryKey]: testHealthData,
      '/availableAreas': [],
    };
    const { result } = renderHook(() => usePopulationPyramidData(), {
      wrapper: testRenderWrapper(seedData),
    });

    expect(result.current).toHaveProperty('healthData', testHealthData);
  });
});

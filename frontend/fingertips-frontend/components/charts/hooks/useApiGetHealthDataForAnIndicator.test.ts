import { mockGetHealthDataForAnIndicator } from '@/mock/utils/mockApiCient';
//
import { useApiGetHealthDataForAnIndicator } from '@/components/charts/hooks/useApiGetHealthDataForAnIndicator';
import { renderHook } from '@testing-library/react';
import { oneIndicatorRequestParams } from '@/components/charts/helpers/oneIndicatorRequestParams';
import { SearchParams } from '@/lib/searchStateManager';
import { testRenderWrapper } from '@/mock/utils/testRenderQueryClient';

describe('useApiGetHealthDataForAnIndicator', () => {
  it('should call getHealthDataForAnIndicator from the IndicatorApi', async () => {
    const params = oneIndicatorRequestParams(
      { [SearchParams.IndicatorsSelected]: ['123'] },
      []
    );
    renderHook(() => useApiGetHealthDataForAnIndicator(params), {
      wrapper: testRenderWrapper({}),
    });

    expect(mockGetHealthDataForAnIndicator).toHaveBeenCalledWith({
      ancestorCode: undefined,
      areaCodes: ['E92000001'],
      areaType: 'england',
      benchmarkRefType: 'England',
      indicatorId: 123,
    });
  });
});

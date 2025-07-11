import { mockUseSearchStateParams } from '@/mock/utils/mockUseSearchStateParams';
//
import { testRenderWrapper } from '@/mock/utils/testRenderQueryClient';
import { useSingleIndicatorBasicTableData } from '@/components/charts/BasicTable/hooks/useSingleIndicatorBasicTableData';
import { renderHook } from '@testing-library/react';
import { SearchParams } from '@/lib/searchStateManager';
import { SeedData } from '@/components/atoms/SeedQueryCache/seedQueryCache.types';
import { mockIndicatorDocument } from '@/mock/data/mockIndicatorDocument';
import { mockHealthDataForArea } from '@/mock/data/mockHealthDataForArea';
import { mockIndicatorSegment } from '@/mock/data/mockIndicatorSegment';
import { mockSexData } from '@/mock/data/mockSexData';
import { mockIndicatorWithHealthDataForArea } from '@/mock/data/mockIndicatorWithHealthDataForArea';
import {
  EndPoints,
  queryKeyFromRequestParams,
} from '@/components/charts/helpers/queryKeyFromRequestParams';
import { oneIndicatorRequestParams } from '@/components/charts/helpers/oneIndicatorRequestParams';
import { areaCodeForEngland } from '@/lib/chartHelpers/constants';
import { deepClone } from '@vitest/utils';

const testSearch = {
  [SearchParams.IndicatorsSelected]: ['41101'],
  [SearchParams.AreasSelected]: ['E06000015'],
  [SearchParams.AreaTypeSelected]: 'regions',
  [SearchParams.GroupTypeSelected]: 'england',
  [SearchParams.GroupSelected]: areaCodeForEngland,
};

const testHealthData = mockIndicatorWithHealthDataForArea({
  areaHealthData: [
    mockHealthDataForArea({
      indicatorSegments: [
        mockIndicatorSegment({ sex: mockSexData({ value: 'Female' }) }),
        mockIndicatorSegment({ sex: mockSexData({ value: 'Persons' }) }),
        mockIndicatorSegment({ sex: mockSexData({ value: 'Male' }) }),
      ],
    }),
  ],
});

const testParams = oneIndicatorRequestParams(testSearch, []);

const queryKey = queryKeyFromRequestParams(
  EndPoints.HealthDataForAnIndicator,
  testParams
);

const seedData: SeedData = {
  '/indicator/41101': mockIndicatorDocument(),
  [queryKey]: testHealthData,
};

describe('useSingleIndicatorBasicTableData', () => {
  beforeEach(() => {
    mockUseSearchStateParams.mockReturnValue(testSearch);
  });

  it('should return 3 rows of basic table data', () => {
    const { result } = renderHook(() => useSingleIndicatorBasicTableData(), {
      wrapper: testRenderWrapper(seedData),
    });

    expect(result.current).toHaveLength(3);
  });

  it('should return null if healthData is not loaded', () => {
    const { result } = renderHook(() => useSingleIndicatorBasicTableData(), {
      wrapper: testRenderWrapper({
        '/indicator/41101': mockIndicatorDocument(),
      }),
    });

    expect(result.current).toBeNull();
  });

  it('should return null if indicatorMetaData is not loaded', () => {
    const { result } = renderHook(() => useSingleIndicatorBasicTableData(), {
      wrapper: testRenderWrapper({
        [queryKey]: testHealthData,
      }),
    });

    expect(result.current).toBeNull();
  });

  it('should return null if the area is not in the loaded data', () => {
    const clone = deepClone(testHealthData);
    // eslint-disable-next-line @typescript-eslint/ban-ts-comment
    // @ts-expect-error
    clone.areaHealthData[0].areaCode = '404';

    const { result } = renderHook(() => useSingleIndicatorBasicTableData(), {
      wrapper: testRenderWrapper({
        ...seedData,
        [queryKey]: clone,
      }),
    });

    expect(result.current).toBeNull();
  });
});

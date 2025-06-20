import { renderHook } from '@testing-library/react';

import { useCompareAreasTableData } from '@/components/charts/CompareAreasTable/hooks/useCompareAreasTableData';

import { useSearchStateParams } from '@/components/hooks/useSearchStateParams';
import { useCompareAreasTableRequestParams } from '@/components/charts/CompareAreasTable/hooks/useCompareAreasTableRequestParams';
import { useApiGetHealthDataForAnIndicator } from '@/components/charts/hooks/useApiGetHealthDataForAnIndicator';
import { useApiGetIndicatorMetaData } from '@/components/charts/hooks/useApiGetIndicatorMetaData';
import { compareAreasTableData } from '@/components/charts/CompareAreasTable/helpers/compareAreasTableData';
import { SearchParams, SearchStateParams } from '@/lib/searchStateManager';
import { mockIndicatorWithHealthDataForArea } from '@/mock/data/mockIndicatorWithHealthDataForArea';
import { mockIndicatorDocument } from '@/mock/data/mockIndicatorDocument';
import {
  BenchmarkComparisonMethod,
  GetHealthDataForAnIndicatorRequest,
  IndicatorPolarity,
} from '@/generated-sources/ft-api-client';
import {
  mockHealthDataForArea,
  mockHealthDataForArea_England,
} from '@/mock/data/mockHealthDataForArea';

jest.mock('@/components/hooks/useSearchStateParams');
jest.mock(
  '@/components/charts/CompareAreasTable/hooks/useCompareAreasTableRequestParams'
);
jest.mock('@/components/charts/hooks/useApiGetHealthDataForAnIndicator');
jest.mock('@/components/charts/hooks/useApiGetIndicatorMetaData');
jest.mock(
  '@/components/charts/CompareAreasTable/helpers/compareAreasTableData'
);

const mockUseSearchStateParams = useSearchStateParams as jest.MockedFunction<
  typeof useSearchStateParams
>;
const mockUseCompareAreasTableRequestParams =
  useCompareAreasTableRequestParams as jest.MockedFunction<
    typeof useCompareAreasTableRequestParams
  >;
const mockUseApiGetHealthDataForAnIndicator =
  useApiGetHealthDataForAnIndicator as jest.MockedFunction<
    typeof useApiGetHealthDataForAnIndicator
  >;
const mockUseApiGetIndicatorMetaData =
  useApiGetIndicatorMetaData as jest.MockedFunction<
    typeof useApiGetIndicatorMetaData
  >;
const mockCompareAreasTableData = compareAreasTableData as jest.MockedFunction<
  typeof compareAreasTableData
>;

describe('useCompareAreasTableData', () => {
  beforeEach(() => {
    jest.clearAllMocks();
  });

  it('returns null when healthData is not available', () => {
    mockUseSearchStateParams.mockReturnValue({
      [SearchParams.GroupSelected]: 'G123',
      [SearchParams.BenchmarkAreaSelected]: 'E92000001',
    });

    mockUseCompareAreasTableRequestParams.mockReturnValue({
      indicatorId: 100,
    });

    mockUseApiGetHealthDataForAnIndicator.mockReturnValue({
      healthData: undefined,
      healthDataLoading: false,
      healthDataError: null,
    });
    mockUseApiGetIndicatorMetaData.mockReturnValue({
      indicatorMetaData: mockIndicatorDocument(),
      indicatorMetaDataLoading: false,
      indicatorMetaDataError: null,
    });

    const { result } = renderHook(() => useCompareAreasTableData());
    expect(result.current).toBeNull();
  });

  it('returns combined metadata and processed health data when available', () => {
    const mockSearchState: SearchStateParams = {
      [SearchParams.GroupSelected]: 'G123',
      [SearchParams.BenchmarkAreaSelected]: 'E92000001',
    };
    const mockRequestParams: GetHealthDataForAnIndicatorRequest = {
      indicatorId: 100,
    };
    const mockHealthData = mockIndicatorWithHealthDataForArea();
    const mockMetaData = mockIndicatorDocument();
    const mockProcessedData: ReturnType<typeof compareAreasTableData> = {
      benchmarkToUse: 'England',
      groupData: mockHealthDataForArea(),
      englandData: mockHealthDataForArea_England(),
      healthIndicatorData: [mockHealthDataForArea()],
      benchmarkComparisonMethod:
        BenchmarkComparisonMethod.CIOverlappingReferenceValue95,
      polarity: IndicatorPolarity.HighIsGood,
    };

    mockUseSearchStateParams.mockReturnValue(mockSearchState);
    mockUseCompareAreasTableRequestParams.mockReturnValue(mockRequestParams);
    mockUseApiGetHealthDataForAnIndicator.mockReturnValue({
      healthData: mockHealthData,
      healthDataLoading: false,
      healthDataError: null,
    });
    mockUseApiGetIndicatorMetaData.mockReturnValue({
      indicatorMetaData: mockMetaData,
      indicatorMetaDataLoading: false,
      indicatorMetaDataError: null,
    });
    mockCompareAreasTableData.mockReturnValue(mockProcessedData);

    const { result } = renderHook(() => useCompareAreasTableData());

    expect(result.current).toEqual({
      indicatorMetaData: mockMetaData,
      ...mockProcessedData,
    });

    expect(mockCompareAreasTableData).toHaveBeenCalledWith(
      mockHealthData,
      'G123',
      'E92000001'
    );
  });
});

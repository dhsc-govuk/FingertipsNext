// MUST BE AT THE TOP DUE TO HOISTING OF MOCKED MODULES
import { mockUseSearchStateParams } from '@/mock/utils/mockUseSearchStateParams';
import { mockUseApiGetHealthDataForAnIndicator } from '@/mock/utils/mockUseApiGetHealthDataForAnIndicator';
//
import { renderHook } from '@testing-library/react';
import { useCompareAreasTableData } from '@/components/charts/CompareAreasTable/hooks/useCompareAreasTableData';
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
import { MockedFunction } from 'vitest';
import { areaCodeForEngland } from '@/lib/chartHelpers/constants';
import { useOneIndicatorRequestParams } from '@/components/charts/hooks/useOneIndicatorRequestParams';

vi.mock('@/components/charts/hooks/useOneIndicatorRequestParams');
vi.mock('@/components/charts/hooks/useApiGetIndicatorMetaData');
vi.mock('@/components/charts/CompareAreasTable/helpers/compareAreasTableData');

const mockUseOneIndicatorRequestParams =
  useOneIndicatorRequestParams as MockedFunction<
    typeof useOneIndicatorRequestParams
  >;

const mockUseApiGetIndicatorMetaData =
  useApiGetIndicatorMetaData as MockedFunction<
    typeof useApiGetIndicatorMetaData
  >;
const mockCompareAreasTableData = compareAreasTableData as MockedFunction<
  typeof compareAreasTableData
>;

describe('useCompareAreasTableData', () => {
  beforeEach(() => {
    vi.clearAllMocks();
  });

  it('returns null when healthData is not available', () => {
    mockUseSearchStateParams.mockReturnValue({
      [SearchParams.GroupSelected]: 'G123',
      [SearchParams.BenchmarkAreaSelected]: 'E92000001',
    });

    mockUseOneIndicatorRequestParams.mockReturnValue({
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
    mockUseOneIndicatorRequestParams.mockReturnValue(mockRequestParams);
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
      name: `${mockHealthData.name} (Persons, All ages)`,
    });

    const lastCall = mockCompareAreasTableData.mock.lastCall;
    expect(lastCall?.at(0)).toEqual({
      ...mockHealthData,
      areaHealthData: [
        {
          ...mockHealthData.areaHealthData?.at(0),
          indicatorSegments: undefined,
        },
      ],
      name: `${mockHealthData.name} (Persons, All ages)`,
    });
    expect(lastCall?.at(1)).toEqual('G123');
    expect(lastCall?.at(2)).toEqual(areaCodeForEngland);
  });
});

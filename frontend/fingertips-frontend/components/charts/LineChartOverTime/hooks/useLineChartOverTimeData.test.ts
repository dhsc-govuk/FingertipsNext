import { useLineChartOverTimeData } from '@/components/charts/LineChartOverTime/hooks/useLineChartOverTimeData';
import { useSearchStateParams } from '@/components/hooks/useSearchStateParams';
import { useApiGetHealthDataForAnIndicator } from '@/components/charts/hooks/useApiGetHealthDataForAnIndicator';
import { useApiGetIndicatorMetaData } from '@/components/charts/hooks/useApiGetIndicatorMetaData';
import { lineChartOverTimeIsRequired } from '@/components/charts/LineChartOverTime/helpers/lineChartOverTimeIsRequired';
import { lineChartOverTimeData } from '@/components/charts/LineChartOverTime/helpers/lineChartOverTimeData';
import { mockIndicatorDocument } from '@/mock/data/mockIndicatorDocument';
import { renderHook } from '@testing-library/react';
import { mockIndicatorWithHealthDataForArea } from '@/mock/data/mockIndicatorWithHealthDataForArea';
import { SearchParams, SearchStateParams } from '@/lib/searchStateManager';
import { MockedFunction } from 'vitest';

vi.mock('@/components/hooks/useSearchStateParams');
vi.mock(
  '@/components/charts/LineChartOverTime/hooks/useLineChartOverTimeRequestParams'
);
vi.mock('@/components/charts/hooks/useApiGetHealthDataForAnIndicator');
vi.mock('@/components/charts/hooks/useApiGetIndicatorMetaData');
vi.mock(
  '@/components/charts/LineChartOverTime/helpers/lineChartOverTimeIsRequired'
);
vi.mock('@/components/charts/LineChartOverTime/helpers/lineChartOverTimeData');

vi.mock('@/components/hooks/useSearchStateParams');
const mockUseSearchStateParams = useSearchStateParams as MockedFunction<
  typeof useSearchStateParams
>;

const mockUseApiGetHealthDataForAnIndicator =
  useApiGetHealthDataForAnIndicator as MockedFunction<
    typeof useApiGetHealthDataForAnIndicator
  >;
const mockUseApiGetIndicatorMetaData =
  useApiGetIndicatorMetaData as MockedFunction<
    typeof useApiGetIndicatorMetaData
  >;
const mockLineChartOverTimeIsRequired =
  lineChartOverTimeIsRequired as MockedFunction<
    typeof lineChartOverTimeIsRequired
  >;
const mockLineChartOverTimeData = lineChartOverTimeData as MockedFunction<
  typeof lineChartOverTimeData
>;

describe('useLineChartOverTimeData', () => {
  const mockSearchState: SearchStateParams = {
    [SearchParams.IndicatorsSelected]: ['101'],
    [SearchParams.GroupSelected]: 'G001',
    [SearchParams.BenchmarkAreaSelected]: 'BA001',
    [SearchParams.AreasSelected]: ['A001'],
  };

  let mockHealthQuery: ReturnType<typeof useApiGetHealthDataForAnIndicator>;
  let mockMetaQuery: ReturnType<typeof useApiGetIndicatorMetaData>;
  beforeEach(() => {
    vi.clearAllMocks();

    mockUseSearchStateParams.mockReturnValue(mockSearchState);

    mockHealthQuery = {
      healthData: mockIndicatorWithHealthDataForArea(),
      healthDataLoading: false,
      healthDataError: null,
    };

    mockMetaQuery = {
      indicatorMetaData: mockIndicatorDocument(),
      indicatorMetaDataError: null,
      indicatorMetaDataLoading: false,
    };
  });

  it('returns null if healthData is missing', () => {
    mockUseApiGetHealthDataForAnIndicator.mockReturnValue({
      ...mockHealthQuery,
      healthData: undefined,
    });
    mockUseApiGetIndicatorMetaData.mockReturnValue(mockMetaQuery);
    mockLineChartOverTimeIsRequired.mockReturnValue(true);

    const { result } = renderHook(() => useLineChartOverTimeData());
    expect(result.current).toBeNull();
  });

  it('returns null if indicatorMetaData is missing', () => {
    mockUseApiGetHealthDataForAnIndicator.mockReturnValue(mockHealthQuery);
    mockUseApiGetIndicatorMetaData.mockReturnValue({
      ...mockMetaQuery,
      indicatorMetaData: undefined,
    });
    mockLineChartOverTimeIsRequired.mockReturnValue(true);

    const { result } = renderHook(() => useLineChartOverTimeData());
    expect(result.current).toBeNull();
  });

  it('returns null if chart is not required', () => {
    mockUseApiGetHealthDataForAnIndicator.mockReturnValue(mockHealthQuery);
    mockUseApiGetIndicatorMetaData.mockReturnValue(mockMetaQuery);
    mockLineChartOverTimeIsRequired.mockReturnValue(false);

    const { result } = renderHook(() => useLineChartOverTimeData());
    expect(result.current).toBeNull();
  });

  it('returns chart data when all inputs are valid', () => {
    const expectedChartData = { chart: 'data' };

    mockUseApiGetHealthDataForAnIndicator.mockReturnValue(mockHealthQuery);
    mockUseApiGetIndicatorMetaData.mockReturnValue(mockMetaQuery);
    mockLineChartOverTimeIsRequired.mockReturnValue(true);
    mockLineChartOverTimeData.mockReturnValue(
      expectedChartData as unknown as ReturnType<typeof lineChartOverTimeData>
    );

    const { result } = renderHook(() => useLineChartOverTimeData());
    expect(result.current).toEqual(expectedChartData);
    expect(mockLineChartOverTimeData).toHaveBeenCalledWith(
      mockMetaQuery.indicatorMetaData,
      mockHealthQuery.healthData,
      ['A001'],
      'G001',
      'BA001'
    );
  });
});

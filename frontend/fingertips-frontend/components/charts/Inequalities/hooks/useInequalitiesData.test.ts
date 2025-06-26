// MUST BE AT THE TOP DUE TO HOISTING OF MOCKED MODULES
import { mockUseSearchStateParams } from '@/mock/utils/mockUseSearchStateParams';
//
import { renderHook } from '@testing-library/react';
import { useIndicatorMetaData } from '@/components/charts/hooks/useIndicatorMetaData';
import { useApiGetHealthDataForAnIndicator } from '@/components/charts/hooks/useApiGetHealthDataForAnIndicator';
import { inequalitiesData } from '@/components/charts/Inequalities/helpers/inequalitiesData';
import { useInequalitiesData } from '@/components/charts/Inequalities/hooks/useInequalitiesData';
import { ChartType } from '@/components/charts/Inequalities/helpers/inequalitiesHelpers';
import { mockIndicatorDocument } from '@/mock/data/mockIndicatorDocument';
import { SearchParams } from '@/lib/searchStateManager';
import { mockIndicatorWithHealthDataForArea } from '@/mock/data/mockIndicatorWithHealthDataForArea';
import { Mock, MockedFunction } from 'vitest';

vi.mock('@/components/charts/hooks/useIndicatorMetaData');
vi.mock('@/components/charts/Inequalities/hooks/useInequalitiesRequestParams');
vi.mock('@/components/charts/hooks/useApiGetHealthDataForAnIndicator');
vi.mock('@/components/charts/Inequalities/helpers/inequalitiesData');

const mockUseIndicatorMetaData = useIndicatorMetaData as MockedFunction<
  typeof useIndicatorMetaData
>;

const mockUseApiGetHealthDataForAnIndicator =
  useApiGetHealthDataForAnIndicator as MockedFunction<
    typeof useApiGetHealthDataForAnIndicator
  >;
const mockInequalitiesData = inequalitiesData as MockedFunction<
  typeof inequalitiesData
>;

const mockSearchState = {
  [SearchParams.InequalityBarChartAreaSelected]: 'E123456',
};
mockUseSearchStateParams.mockReturnValue(mockSearchState);

describe('useInequalitiesData', () => {
  beforeEach(() => {
    vi.clearAllMocks();

    mockUseIndicatorMetaData.mockReturnValue({
      indicatorMetaData: mockIndicatorDocument(),
      indicatorMetaDataError: null,
      indicatorMetaDataLoading: false,
    });
    mockUseApiGetHealthDataForAnIndicator.mockReturnValue({
      healthData: mockIndicatorWithHealthDataForArea(),
      healthDataError: null,
      healthDataLoading: false,
    });

    (inequalitiesData as Mock).mockReturnValue({ transformed: 'data' });
  });

  it.each(Object.values(ChartType))(
    'calls inequalitiesData() when all inputs are present for %s',
    (chartType) => {
      renderHook(() => useInequalitiesData(chartType));
      expect(mockInequalitiesData).toHaveBeenCalledWith(
        mockSearchState,
        mockIndicatorDocument(),
        mockIndicatorWithHealthDataForArea(),
        chartType
      );
    }
  );

  it('returns null if any dependency is missing', () => {
    mockUseApiGetHealthDataForAnIndicator.mockReturnValue({
      healthData: undefined,
      healthDataLoading: false,
      healthDataError: null,
    });

    const { result } = renderHook(() => useInequalitiesData());
    expect(result.current).toBeNull();
  });
});

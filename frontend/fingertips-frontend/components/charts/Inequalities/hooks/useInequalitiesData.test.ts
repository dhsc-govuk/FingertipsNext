// MUST BE AT THE TOP
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

jest.mock('@/components/charts/hooks/useIndicatorMetaData');
jest.mock(
  '@/components/charts/Inequalities/hooks/useInequalitiesRequestParams'
);
jest.mock('@/components/charts/hooks/useApiGetHealthDataForAnIndicator');
jest.mock('@/components/charts/Inequalities/helpers/inequalitiesData');

const mockUseIndicatorMetaData = useIndicatorMetaData as jest.MockedFunction<
  typeof useIndicatorMetaData
>;

const mockUseApiGetHealthDataForAnIndicator =
  useApiGetHealthDataForAnIndicator as jest.MockedFunction<
    typeof useApiGetHealthDataForAnIndicator
  >;
const mockInequalitiesData = inequalitiesData as jest.MockedFunction<
  typeof inequalitiesData
>;

const mockSearchState = {
  [SearchParams.InequalityBarChartAreaSelected]: 'E123456',
};
mockUseSearchStateParams.mockReturnValue(mockSearchState);

describe('useInequalitiesData', () => {
  beforeEach(() => {
    jest.clearAllMocks();

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

    (inequalitiesData as jest.Mock).mockReturnValue({ transformed: 'data' });
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

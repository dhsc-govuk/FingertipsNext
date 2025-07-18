// MUST BE AT THE TOP DUE TO HOISTING OF MOCKED MODULES
import { mockUseApiGetHealthDataForMultipleIndicatorsSetup } from '@/mock/utils/mockUseApiGetHealthDataForMultipleIndicators';
import { mockUseApiGetIndicatorMetaDatasSetup } from '@/mock/utils/mockUseApiGetIndicatorMetaDatas';
import { mockUseSearchStateParams } from '@/mock/utils/mockUseSearchStateParams';
import { mockUseApiAvailableAreasSetup } from '@/mock/utils/mockUseApiAvailableAreas';
//
import { mockIndicatorWithHealthDataForArea } from '@/mock/data/mockIndicatorWithHealthDataForArea';
import { mockIndicatorDocument } from '@/mock/data/mockIndicatorDocument';
import { renderHook } from '@testing-library/react';
import { useMultipleIndicatorData } from '@/components/charts/hooks/useMultipleIndicatorData';

const testHealthData = [mockIndicatorWithHealthDataForArea()];
const testMetaData = [mockIndicatorDocument()];
const testSearch = {};

mockUseApiAvailableAreasSetup();
mockUseApiGetHealthDataForMultipleIndicatorsSetup(testHealthData);
mockUseApiGetIndicatorMetaDatasSetup(testMetaData);
mockUseSearchStateParams.mockReturnValue(testSearch);

describe('useMultipleIndicatorData', () => {
  it('returns healthData and metaData for a single indicator', () => {
    const { result } = renderHook(() => useMultipleIndicatorData());
    expect(result.current).toEqual({
      indicatorMetaData: testMetaData,
      healthData: testHealthData,
    });
  });
});

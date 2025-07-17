// MUST BE AT THE TOP DUE TO HOISTING OF MOCKED MODULES
import { mockUseApiGetIndicatorMetaDataSetup } from '@/mock/utils/mockUseApiGetIndicatorMetaData';
import { mockUseApiGetHealthDataForAnIndicatorSetup } from '@/mock/utils/mockUseApiGetHealthDataForAnIndicator';
import { mockUseSearchStateParams } from '@/mock/utils/mockUseSearchStateParams';
import { mockUseApiAvailableAreasSetup } from '@/mock/utils/mockUseApiAvailableAreas';
//
import { mockIndicatorWithHealthDataForArea } from '@/mock/data/mockIndicatorWithHealthDataForArea';
import { mockIndicatorDocument } from '@/mock/data/mockIndicatorDocument';
import { useOneIndicatorData } from '@/components/charts/hooks/useOneIndicatorData';
import { renderHook } from '@testing-library/react';

const testHealthData = mockIndicatorWithHealthDataForArea();
const testMetaData = mockIndicatorDocument();

mockUseApiAvailableAreasSetup();
mockUseApiGetHealthDataForAnIndicatorSetup(testHealthData);
mockUseApiGetIndicatorMetaDataSetup(testMetaData);
mockUseSearchStateParams.mockReturnValue({});

describe('useOneIndicatorData', () => {
  it('returns healthData and metaData for a single indicator', () => {
    const { result } = renderHook(() => useOneIndicatorData());
    expect(result.current).toEqual({
      indicatorMetaData: testMetaData,
      healthData: testHealthData,
    });
  });
});

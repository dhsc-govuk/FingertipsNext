import { mockUseApiGetHealthDataForAnIndicator } from '@/mock/utils/mockUseApiGetHealthData';
import { testRenderQueryClient } from '@/mock/utils/testRenderQueryClient';
//
import { OneIndicatorSegmentationOptions } from '@/components/viewPlots/OneIndicatorSegmentationOptions';

mockUseApiGetHealthDataForAnIndicator.mockReturnValue({
  healthData: undefined,
  healthDataLoading: false,
  healthDataError: null,
});

describe('OneIndicatorSegmentationOptions', () => {
  it('should return null if there is no data', async () => {
    const { htmlContainer } = await testRenderQueryClient(
      <OneIndicatorSegmentationOptions />
    );

    expect(htmlContainer?.firstChild).toBeNull();
  });
});

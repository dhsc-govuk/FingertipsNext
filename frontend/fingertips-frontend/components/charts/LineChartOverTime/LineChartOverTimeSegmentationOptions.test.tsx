import { mockUseApiGetHealthDataForAnIndicator } from '@/mock/utils/mockUseApiGetHealthData';
import { testRenderQueryClient } from '@/mock/utils/testRenderQueryClient';
//
import { LineChartOverTimeSegmentationOptions } from '@/components/charts/LineChartOverTime/LineChartOverTimeSegmentationOptions';

mockUseApiGetHealthDataForAnIndicator.mockReturnValue({
  healthData: undefined,
  healthDataLoading: false,
  healthDataError: null,
});

describe('LineChartOverTimeSegmentationOptions', () => {
  it('should return null if there is no data', async () => {
    const { htmlContainer } = await testRenderQueryClient(
      <LineChartOverTimeSegmentationOptions />
    );

    expect(htmlContainer?.firstChild).toBeNull();
  });
});

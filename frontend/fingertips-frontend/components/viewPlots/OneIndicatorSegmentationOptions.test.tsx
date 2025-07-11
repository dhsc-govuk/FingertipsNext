import { mockUseApiGetHealthDataForAnIndicator } from '@/mock/utils/mockUseApiGetHealthData';
import { testRenderQueryClient } from '@/mock/utils/testRenderQueryClient';
//
import { OneIndicatorSegmentationOptions } from '@/components/viewPlots/OneIndicatorSegmentationOptions';
import { SessionProvider } from 'next-auth/react';
import { auth } from '@/lib/auth';
import { Mock } from 'vitest';

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

// MUST BE AT THE TOP DUE TO HOISTING OF MOCKED MODULES
import {
  mockIndicatorsQuartilesGet,
  mockIndicatorsQuartilesAllGet,
} from '@/mock/utils/mockApiClient';
//
import { QueryClient } from '@tanstack/react-query';
import { useApiGetQuartiles } from './useApiGetQuartiles';
import { testRenderWrapper } from '@/mock/utils/testRenderQueryClient';
import { renderHook, waitFor } from '@testing-library/react';
import { BenchmarkReferenceType } from '@/generated-sources/ft-api-client';

describe('useApiGetQuartiles', () => {
  afterEach(() => vi.clearAllMocks());

  const options = {
    ancestorCode: 'E92000001',
    areaCode: 'E92000001',
    areaType: undefined,
    benchmarkRefType: BenchmarkReferenceType.England,
    indicatorIds: [333, 444],
  };

  it('should call the published quartiles endpoint when there is no session', async () => {
    // arrange
    const queryClient = new QueryClient();

    // act
    renderHook(() => useApiGetQuartiles(options), {
      wrapper: testRenderWrapper({}, queryClient, null),
    });

    // assert
    await waitFor(() => {
      expect(mockIndicatorsQuartilesGet).toHaveBeenCalledWith(options);
    });

    expect(mockIndicatorsQuartilesAllGet).not.toHaveBeenCalled();
  });

  it('should call the unpublished quartiles endpoint when there is a session', async () => {
    // arrange
    const queryClient = new QueryClient();

    // act
    renderHook(() => useApiGetQuartiles(options), {
      wrapper: testRenderWrapper({}, queryClient, {
        expires: 'some timestamp',
      }),
    });

    // assert
    await waitFor(() => {
      expect(mockIndicatorsQuartilesAllGet).toHaveBeenCalledWith(options);
    });

    expect(mockIndicatorsQuartilesGet).not.toHaveBeenCalled();
  });

  it('should not trigger the query when indicatorIds length is less than 2', async () => {
    // arrange
    const queryClient = new QueryClient();
    const optionsWithSingleIndicator = {
      ...options,
      indicatorIds: [333],
    };

    // act
    renderHook(() => useApiGetQuartiles(optionsWithSingleIndicator), {
      wrapper: testRenderWrapper({}, queryClient, null),
    });

    // assert
    await waitFor(() => {
      expect(mockIndicatorsQuartilesGet).not.toHaveBeenCalled();
      expect(mockIndicatorsQuartilesAllGet).not.toHaveBeenCalled();
    });
  });
});

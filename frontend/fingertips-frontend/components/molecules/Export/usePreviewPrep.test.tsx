import { renderHook, waitFor } from '@testing-library/react';
import { QueryClientProvider } from '@tanstack/react-query';
import { usePreviewPrep } from '@/components/molecules/Export/usePreviewPrep';
import { ExportType } from '@/components/molecules/Export/export.types';
import { Options } from 'highcharts';
import { ReactNode } from 'react';
import { QueryClient } from '@tanstack/query-core';

jest.mock('@/components/molecules/Export/exportHelpers', () => ({
  getHtmlToImageCanvas: jest.fn(() => {
    return Promise.resolve({ nodeName: 'CANVAS' });
  }),
  svgStringToDomElement: jest.fn(() => document.createElement('svg')),
}));

jest.mock(
  '@/components/molecules/Export/helpers/svgStringFromChartOptions',
  () => ({
    svgStringFromChartOptions: jest.fn(() => '<svg></svg>'),
  })
);

const createWrapper = () => {
  const client = new QueryClient({
    defaultOptions: {
      queries: {
        staleTime: Infinity,
        retry: false,
      },
    },
  });
  // eslint-disable-next-line react/display-name
  return ({ children }: { children: ReactNode }) => (
    <QueryClientProvider client={client}>{children}</QueryClientProvider>
  );
};

describe('usePreviewPrep', () => {
  it('returns a canvas element for PNG export', async () => {
    const { result } = renderHook(
      () => usePreviewPrep('target-id', ExportType.PNG),
      { wrapper: createWrapper() }
    );
    await waitFor(() => result.current.isSuccess);
    await waitFor(() => {
      expect(result.current.element?.nodeName).toBe('CANVAS');
    });
  });

  it('returns svg element and string for SVG export', async () => {
    const mockChartOptions: Options = {
      series: [
        {
          type: 'line',
          data: [1, 2, 3],
        },
      ],
    };

    const { result } = renderHook(
      () =>
        usePreviewPrep(
          'target-id',
          ExportType.SVG,
          undefined,
          mockChartOptions
        ),
      { wrapper: createWrapper() }
    );

    await waitFor(() => result.current.isSuccess);
    expect(result.current.element?.nodeName).toBe('svg');
    expect(result.current.text).toBe('<svg></svg>');
  });

  it('should error if chart is not defined when asking for SVG', async () => {
    const { result } = renderHook(
      () => usePreviewPrep('target-id', ExportType.SVG),
      { wrapper: createWrapper() }
    );

    await waitFor(() => {
      expect(result.current.error).not.toBeNull();
    });
    expect(result.current.error).toHaveProperty('message', 'invalid chartRef');
  });

  it('returns CSV string for CSV export', async () => {
    const csvData = [
      ['a', 'b', 'c'],
      [1, 2, 3],
    ];

    const { result } = renderHook(
      () => usePreviewPrep('target-id', ExportType.CSV, csvData),
      { wrapper: createWrapper() }
    );

    await waitFor(() => result.current.isSuccess);
    expect(result.current.text).toEqual('a,b,c\r\n1,2,3');
  });

  it('should error if csvData is not defined when asking for CSV', async () => {
    const { result } = renderHook(
      () => usePreviewPrep('target-id', ExportType.CSV),
      { wrapper: createWrapper() }
    );

    await waitFor(() => {
      expect(result.current.error).not.toBeNull();
    });
    expect(result.current.error).toHaveProperty('message', 'invalid csvData');
  });
});

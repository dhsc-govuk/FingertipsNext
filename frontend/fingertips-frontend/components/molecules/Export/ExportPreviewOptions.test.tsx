import { ExportPreviewOptions } from '@/components/molecules/Export/ExportPreviewOptions';
import { render, screen, waitFor } from '@testing-library/react';
import { reactQueryClient } from '@/lib/reactQueryClient';
import { QueryClientProvider } from '@tanstack/react-query';
import { Options } from 'highcharts';
import userEvent from '@testing-library/user-event';
import { CsvData } from '@/lib/downloadHelpers/convertToCsv';

import { svgStringFromChartOptions } from '@/components/molecules/Export/helpers/svgStringFromChartOptions';

jest.mock('html2canvas', () => ({
  __esModule: true,
  default: () => Promise.resolve(document.createElement('canvas')),
}));

jest.mock('@/components/molecules/Export/exportHelpers', () => ({
  getHtmlToImageCanvas: () => Promise.resolve(document.createElement('canvas')),
}));

jest.mock(
  '@/components/molecules/Export/helpers/svgStringFromChartOptions',
  () => ({
    svgStringFromChartOptions: jest.fn(() => '<svg></svg>'),
  })
);

const testRender = (chartOptions?: Options, csvData?: CsvData) => {
  render(
    <QueryClientProvider client={reactQueryClient}>
      <div id={'container'}></div>
      <div id={'testId'}>Hello</div>
      <ExportPreviewOptions
        targetId="testId"
        chartOptions={chartOptions}
        csvData={csvData}
      />
    </QueryClientProvider>
  );
};

describe('ExportPreviewOptions', () => {
  it('renders with the correct text', async () => {
    testRender();

    const heading = screen.getByRole('group');
    expect(heading).toHaveTextContent('Export options');

    const hint = screen.getByText(/Select an export format/);
    expect(hint).toBeInTheDocument();

    const btn = screen.getByRole('button');
    await waitFor(() => expect(btn).toBeEnabled());

    expect(btn).toHaveTextContent('Export');
  });

  it('shows only png if no chart or csvData are supplied', async () => {
    testRender();

    const radio = screen.getAllByRole('radio');
    expect(radio).toHaveLength(1);

    const png = screen.getByLabelText('PNG');
    expect(png).toBeInTheDocument();
  });

  it('should show svg if the chart object is supplied', async () => {
    const mockChartOptions: Options = {
      accessibility: {
        enabled: false,
      },
      series: [
        {
          type: 'line',
          data: [1, 2, 3],
        },
      ],
    };

    testRender(mockChartOptions);

    const radio = screen.getAllByRole('radio');
    expect(radio).toHaveLength(2);

    const svg = screen.getByLabelText('SVG');
    expect(svg).toBeInTheDocument();

    await userEvent.click(svg);

    await waitFor(() => {
      expect(svgStringFromChartOptions).toHaveBeenCalled();
    });
  });

  it('should show csv if the csvData is supplied', async () => {
    const csvData = [
      ['x', 'y', 'z'],
      [9, 8, 7],
    ];

    testRender(undefined, csvData);

    const radio = screen.getAllByRole('radio');
    expect(radio).toHaveLength(2);

    const csv = screen.getByLabelText('CSV');
    expect(csv).toBeInTheDocument();

    await userEvent.click(csv);

    await waitFor(() => {
      expect(screen.getByText(/x,y,z/i)).toBeInTheDocument();
    });
  });
});

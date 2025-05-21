import { ExportPreviewOptions } from '@/components/molecules/Export/ExportPreviewOptions';
import { render, screen, waitFor } from '@testing-library/react';
import { reactQueryClient } from '@/lib/reactQueryClient';
import { QueryClientProvider } from '@tanstack/react-query';
import { Chart } from 'highcharts';
import userEvent from '@testing-library/user-event';
import { CsvData } from '@/lib/downloadHelpers/convertToCsv';

jest.mock('html2canvas', () => ({
  __esModule: true,
  default: () => Promise.resolve(document.createElement('canvas')),
}));

const testRender = (chart?: Chart, csvData?: CsvData) => {
  const chartRef = { current: chart };
  render(
    <QueryClientProvider client={reactQueryClient}>
      <div id={'container'}></div>
      <div id={'testId'}>Hello</div>
      <ExportPreviewOptions
        targetId="testId"
        chartRef={chartRef}
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
    const getSVG = jest.fn().mockReturnValue('<svg></svg>');
    const chart = { getSVG } as unknown as Chart;

    testRender(chart);

    const radio = screen.getAllByRole('radio');
    expect(radio).toHaveLength(2);

    const svg = screen.getByLabelText('SVG');
    expect(svg).toBeInTheDocument();

    await userEvent.click(svg);

    await waitFor(() => {
      expect(getSVG).toHaveBeenCalled();
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

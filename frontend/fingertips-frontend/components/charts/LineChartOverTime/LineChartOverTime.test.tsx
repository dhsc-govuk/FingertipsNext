import React from 'react';
import { render, screen } from '@testing-library/react';
import { LineChartOverTime } from '@/components/charts/LineChartOverTime/LineChartOverTime';
import { useLineChartOverTimeData } from '@/components/charts/LineChartOverTime/hooks/useLineChartOverTimeData';
import { lineChartOverTimeData } from '@/components/charts/LineChartOverTime/helpers/lineChartOverTimeData';

jest.mock(
  '@/components/charts/LineChartOverTime/hooks/useLineChartOverTimeData'
);
jest.mock('@/components/organisms/LineChart', () => ({
  LineChart: ({ title }: { title: string }) => (
    <div data-testid="mock-line-chart">{title}</div>
  ),
}));

const mockUseLineChartOverTimeData =
  useLineChartOverTimeData as jest.MockedFunction<
    typeof useLineChartOverTimeData
  >;

describe('LineChartOverTime', () => {
  it('returns null when useLineChartOverTimeData returns null', () => {
    mockUseLineChartOverTimeData.mockReturnValue(null);

    const { container } = render(<LineChartOverTime />);
    expect(container.firstChild).toBeNull();
  });

  it('renders LineChart with correct props when data is available', () => {
    const mockChartOptions = {
      title: { text: 'Smoking Trends' },
      xAxis: {},
      yAxis: {},
      series: [],
    };

    mockUseLineChartOverTimeData.mockReturnValue({
      chartOptions: mockChartOptions,
    } as unknown as ReturnType<typeof lineChartOverTimeData>);

    render(<LineChartOverTime />);

    const chart = screen.getByTestId('mock-line-chart');
    expect(chart).toBeInTheDocument();
    expect(chart).toHaveTextContent('Smoking Trends');
  });

  it('renders LineChart with empty title if no title is provided', () => {
    mockUseLineChartOverTimeData.mockReturnValue({
      chartOptions: { title: undefined },
    } as unknown as ReturnType<typeof lineChartOverTimeData>);

    render(<LineChartOverTime />);

    const chart = screen.getByTestId('mock-line-chart');
    expect(chart).toBeInTheDocument();
    expect(chart).toHaveTextContent('');
  });
});

import { render, screen } from '@testing-library/react';
import { LineChartAndTableOverTime } from '@/components/charts/LineChartOverTime/LineChartAndTableOverTime';
import { useLineChartOverTimeData } from '@/components/charts/LineChartOverTime/hooks/useLineChartOverTimeData';
import { MockedFunction } from 'vitest';
import {
  chartTitleConfig,
  ChartTitleKeysEnum,
} from '@/lib/ChartTitles/chartTitleEnums';

vi.mock('@/components/charts/LineChartOverTime/LineChartOverTime', () => ({
  LineChartOverTime: () => <div data-testid="mock-line-chart" />,
}));

vi.mock('@/components/charts/LineChartOverTime/LineChartTableOverTime', () => ({
  LineChartTableOverTime: () => <div data-testid="mock-line-chart-table" />,
}));

vi.mock('@/components/charts/LineChartOverTime/hooks/useLineChartOverTimeData');
const mockUseLineChartOverTimeData = useLineChartOverTimeData as MockedFunction<
  typeof useLineChartOverTimeData
>;

describe('LineChartAndTableOverTime', () => {
  it('returns null when useLineChartOverTimeData returns null', () => {
    mockUseLineChartOverTimeData.mockReturnValue(null);
    const { container } = render(<LineChartAndTableOverTime />);
    expect(container.firstChild).toBeNull();
  });

  it('renders all components when data is available', () => {
    mockUseLineChartOverTimeData.mockReturnValue({
      indicatorMetaData: { dataSource: 'Public Health England' },
    } as unknown as never);

    render(<LineChartAndTableOverTime />);

    expect(
      screen.getByRole('heading', {
        name: chartTitleConfig[ChartTitleKeysEnum.LineChart].title,
      })
    ).toBeInTheDocument();
    expect(screen.getByTestId('mock-line-chart')).toBeInTheDocument();
    expect(screen.getByTestId('mock-line-chart-table')).toBeInTheDocument();
    expect(
      screen.queryAllByText('Data source: Public Health England')
    ).toHaveLength(2);
  });

  it('renders empty DataSource if dataSource is undefined', () => {
    mockUseLineChartOverTimeData.mockReturnValue({
      indicatorMetaData: {},
    } as unknown as never);

    render(<LineChartAndTableOverTime />);
    expect(screen.queryByTestId('data-source')).not.toBeInTheDocument();
  });
});

import { render, screen } from '@testing-library/react';
import { AvailableChartLinks } from '@/components/organisms/AvailableChartLinks/index';
import { ChartTitlesEnum } from '@/lib/ChartTitles/chartTitleEnums';

const mockAvailableCharts = [
  ChartTitlesEnum.LineChart,
  ChartTitlesEnum.InequalitiesLineChart,
];

describe('AvailableChartLinks', () => {
  it('should render the Available charts heading', () => {
    render(<AvailableChartLinks availableCharts={mockAvailableCharts} />);

    expect(screen.getByText('Available charts')).toBeInTheDocument();
  });

  it('should filter the links for available charts', () => {
    render(<AvailableChartLinks availableCharts={mockAvailableCharts} />);
  });
});

import { render, screen } from '@testing-library/react';
import {
  AvailableChartLinks,
  filterChartLinks,
} from '@/components/organisms/AvailableChartLinks/index';
import {
  ChartTitleKeysEnum,
  ChartTitlesEnum,
} from '@/lib/ChartTitles/chartTitleEnums';

const mockAvailableCharts = [
  ChartTitleKeysEnum.LineChart,
  ChartTitleKeysEnum.InequalitiesLineChart,
];

const mockChartLinks = [
  {
    key: 'population-pyramid-chart',
    title: ChartTitlesEnum.PopulationPyramid,
    href: '#population-pyramid-chart',
  },
  {
    key: 'inequalities-line-chart',
    title: ChartTitlesEnum.InequalitiesLineChart,
    href: '#inequalities-line-chart',
  },
  {
    key: 'line-chart',
    title: ChartTitlesEnum.LineChart,
    href: '#line-chart',
  },
];

const mockInvalidChartLinks = [
  {
    key: 'not-a-chart',
    title: ChartTitlesEnum.LineChart,
    href: '#not-a-chart',
  },
];

describe('AvailableChartLinks', () => {
  it('should render the Available charts heading', () => {
    render(<AvailableChartLinks availableCharts={mockAvailableCharts} />);

    expect(screen.getByText('Available charts')).toBeInTheDocument();
  });

  it('should render the available chart links', () => {
    render(<AvailableChartLinks availableCharts={mockAvailableCharts} />);
    filterChartLinks(mockChartLinks, mockAvailableCharts);

    const listItems = screen.getAllByRole('listitem');

    expect(listItems).toHaveLength(2);
    expect(listItems[0]).toBeInTheDocument();
    expect(listItems[1]).toBeInTheDocument();
  });
});

describe('filterChartLinks', () => {
  it('should filter the chart links based on available charts', () => {
    const filteredLinks = filterChartLinks(mockChartLinks, mockAvailableCharts);

    expect(filteredLinks).toHaveLength(2);
    expect(filteredLinks[0].title).toBe(ChartTitlesEnum.LineChart);
    expect(filteredLinks[1].title).toBe(ChartTitlesEnum.InequalitiesLineChart);
  });

  it('should sort the filtered chart links based on available charts order', () => {
    const filteredLinks = filterChartLinks(mockChartLinks, mockAvailableCharts);

    expect(filteredLinks[0].title).toBe(ChartTitlesEnum.LineChart);
    expect(filteredLinks[1].title).toBe(ChartTitlesEnum.InequalitiesLineChart);
  });

  it('should return an empty array when no valid chart links are available', () => {
    const filteredLinks = filterChartLinks(
      mockInvalidChartLinks,
      mockAvailableCharts
    );

    expect(filteredLinks).toHaveLength(0);
  });
});

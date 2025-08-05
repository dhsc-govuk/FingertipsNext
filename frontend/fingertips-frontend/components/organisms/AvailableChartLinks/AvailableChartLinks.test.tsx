import { render, screen } from '@testing-library/react';
import {
  AvailableChartLinks,
  filterChartLinks,
} from '@/components/organisms/AvailableChartLinks/index';
import {
  chartTitleConfig,
  ChartTitleConfigType,
  ChartTitleKeysEnum,
} from '@/lib/ChartTitles/chartTitleEnums';

const mockAvailableCharts = [
  ChartTitleKeysEnum.LineChart,
  ChartTitleKeysEnum.InequalitiesCharts,
];

const mockChartLinks = {
  [ChartTitleKeysEnum.PopulationPyramid]: {
    title: chartTitleConfig[ChartTitleKeysEnum.ThematicMap].title,
    href: '#population-pyramid-chart',
  },
  [ChartTitleKeysEnum.InequalitiesCharts]: {
    title: chartTitleConfig[ChartTitleKeysEnum.InequalitiesCharts].title,
    href: '#inequalities-charts',
  },
  [ChartTitleKeysEnum.LineChart]: {
    title: chartTitleConfig[ChartTitleKeysEnum.LineChart].title,
    href: '#line-chart',
  },
} as unknown as ChartTitleConfigType;

const mockInvalidChartLinks = {
  'not-a-chart': { title: 'Not a valid chart', href: '#not-a-chart' },
} as unknown as ChartTitleConfigType;

describe('AvailableChartLinks', () => {
  it('should render the Available charts heading', () => {
    render(<AvailableChartLinks availableCharts={mockAvailableCharts} />);

    expect(screen.getByText('Available charts')).toBeInTheDocument();
  });

  it('should render the available chart links', () => {
    render(<AvailableChartLinks availableCharts={mockAvailableCharts} />);

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
    expect(filteredLinks[0]).toBe(mockChartLinks[ChartTitleKeysEnum.LineChart]);
    expect(filteredLinks[1]).toBe(
      mockChartLinks[ChartTitleKeysEnum.InequalitiesCharts]
    );
  });

  it('should return only the defined chart links', () => {
    const filteredLinks = filterChartLinks(mockChartLinks, mockAvailableCharts);

    expect(filteredLinks[0]).toBe(mockChartLinks[ChartTitleKeysEnum.LineChart]);
    expect(filteredLinks[1]).toBe(
      mockChartLinks[ChartTitleKeysEnum.InequalitiesCharts]
    );
  });

  it('should return an empty array when no valid chart links are available', () => {
    const filteredLinks = filterChartLinks(
      mockInvalidChartLinks,
      mockAvailableCharts
    );

    expect(filteredLinks).toHaveLength(0);
  });
});

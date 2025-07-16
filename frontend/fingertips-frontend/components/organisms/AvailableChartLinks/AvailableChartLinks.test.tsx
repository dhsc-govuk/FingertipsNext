import { render, screen } from '@testing-library/react';
import {
  AvailableChartLinks,
  filterChartLinks,
} from '@/components/organisms/AvailableChartLinks/index';
import {
  chartTitleConfig,
  ChartTitleKeysEnum,
} from '@/lib/ChartTitles/chartTitleEnums';

const mockAvailableCharts = [
  ChartTitleKeysEnum.LineChart,
  ChartTitleKeysEnum.InequalitiesLineChart,
];

const mockChartLinks = {
  [ChartTitleKeysEnum.PopulationPyramid]: {
    title: chartTitleConfig[ChartTitleKeysEnum.ThematicMap].title,
    href: '#population-pyramid-chart',
  },
    [ChartTitleKeysEnum.InequalitiesLineChart]: {
      title: chartTitleConfig[ChartTitleKeysEnum.InequalitiesLineChart].title,
      href: '#inequalities-line-chart',
    },
  [ChartTitleKeysEnum.LineChart]: {
    title: chartTitleConfig[ChartTitleKeysEnum.LineChart].title,
    href: '#line-chart',
  },
  [ChartTitleKeysEnum.InequalitiesBarChart]: {
    title: chartTitleConfig[ChartTitleKeysEnum.InequalitiesBarChart].title,
    href: '#inequalities-bar-chart',
  },
  [ChartTitleKeysEnum.BarChartEmbeddedTable]: {
    title: chartTitleConfig[ChartTitleKeysEnum.BarChartEmbeddedTable].title,
    href: '#bar-chart-embedded-table-chart',
  },
  [ChartTitleKeysEnum.Heatmap]: {
    title: chartTitleConfig[ChartTitleKeysEnum.Heatmap].title,
    href: '#heatmap-chart',
  },
  [ChartTitleKeysEnum.SpineChart]: {
    title: chartTitleConfig[ChartTitleKeysEnum.SpineChart].title,
    href: '#spine-chart',
  },
  [ChartTitleKeysEnum.ThematicMap]: {
    title: chartTitleConfig[ChartTitleKeysEnum.ThematicMap].title,
    href: '#thematic-map-chart',
  },
  [ChartTitleKeysEnum.BasicTableChart]: {
    title: chartTitleConfig[ChartTitleKeysEnum.BasicTableChart].title,
    href: '#basic-table-chart',
  },
};

const mockInvalidChartLinks = {
    ['not-a-chart']: {
      title: chartTitleConfig[ChartTitleKeysEnum.LineChart].title,
      href: '#not-a-chart',
    },
  }
;

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

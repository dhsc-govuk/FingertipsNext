import { render, screen } from '@testing-library/react';
import { AvailableChartLinks } from '@/components/organisms/AvailableChartLinks/index';
import { ChartTitlesEnum } from '@/lib/chartTitleEnums';

describe('AvailableChartLinks', () => {
  it('should render the Available charts heading', () => {
    render(<AvailableChartLinks />);
    expect(screen.getByText('Available charts')).toBeInTheDocument();
  });

  it('should render all chart links with the correct labels and hrefs', () => {
    render(<AvailableChartLinks />);

    expect(
      screen.getByRole('link', { name: ChartTitlesEnum.LineChart })
    ).toHaveAttribute('href', '#line-chart');
    expect(
      screen.getByRole('link', { name: ChartTitlesEnum.BarChartEmbeddedTable })
    ).toHaveAttribute('href', '#bar-chart-embedded-table-chart');
    expect(
      screen.getByRole('link', { name: ChartTitlesEnum.Heatmap })
    ).toHaveAttribute('href', '#heatmap-chart');
    expect(
      screen.getByRole('link', { name: ChartTitlesEnum.SpineChart })
    ).toHaveAttribute('href', '#spine-chart');
    expect(
      screen.getByRole('link', { name: ChartTitlesEnum.InequalitiesBarChart })
    ).toHaveAttribute('href', '#inequalities-bar-chart');
    expect(
      screen.getByRole('link', { name: ChartTitlesEnum.InequalitiesLineChart })
    ).toHaveAttribute('href', '#inequalities-line-chart');
    expect(
      screen.getByRole('link', { name: ChartTitlesEnum.ThematicMap })
    ).toHaveAttribute('href', '#thematic-map-chart');
    expect(
      screen.getByRole('link', { name: ChartTitlesEnum.PopulationPyramid })
    ).toHaveAttribute('href', '#population-pyramid-chart');
  });

  it('renders the correct number of list items', () => {
    render(<AvailableChartLinks />);
    expect(screen.getAllByRole('listitem')).toHaveLength(8);
  });
});

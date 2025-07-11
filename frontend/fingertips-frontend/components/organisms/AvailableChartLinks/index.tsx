import { Link, ListItem, UnorderedList } from 'govuk-react';
import { ChartTitlesEnum } from '@/lib/ChartTitles/chartTitleEnums';
import { ZeroMarginParagraph } from '@/components/pages/home';
import { chartLinks } from '@/lib/ChartTitles/chartTitleLinksKey';

interface AvailableChartLinksProps {
  availableCharts: string[];
}

export const AvailableChartLinks = ({availableCharts} : Readonly<AvailableChartLinksProps>) => {
  
 const charts = ['line-chart', 'bar-chart-embedded-table-chart', 'heatmap-chart', 'spine-chart', 'inequalities-bar-chart', 'inequalities-line-chart', 'thematic-map-chart', 'population-pyramid-chart'];

  const filterCharts = charts.filter(chart => availableCharts.includes(chart));
  
  const filteredChartLinks = Object.keys(chartLinks).filter(chart => availableCharts.includes(chart));

  console.log('filtered charts:', filterCharts);
  
  return (
    <section data-testid="availableChartLinks-component">
      <ZeroMarginParagraph>Available charts</ZeroMarginParagraph>
      <UnorderedList listStyleType='"— "'>
        <ListItem>
          <Link href="#line-chart">{ChartTitlesEnum.LineChart}</Link>
        </ListItem>
        <ListItem>
          <Link href="#bar-chart-embedded-table-chart">
            {ChartTitlesEnum.BarChartEmbeddedTable}
          </Link>
        </ListItem>
        <ListItem>
          <Link href="#heatmap-chart">{ChartTitlesEnum.Heatmap}</Link>
        </ListItem>
        <ListItem>
          <Link href="#spine-chart">{ChartTitlesEnum.SpineChart}</Link>
        </ListItem>
        <ListItem>
          <Link href="#inequalities-bar-chart">
            {ChartTitlesEnum.InequalitiesBarChart}
          </Link>
        </ListItem>
        <ListItem>
          <Link href="#inequalities-line-chart">
            {ChartTitlesEnum.InequalitiesLineChart}
          </Link>
        </ListItem>
        <ListItem>
          <Link href="#thematic-map-chart">{ChartTitlesEnum.ThematicMap}</Link>
        </ListItem>
        <ListItem>
          <Link href="#population-pyramid-chart">
            {ChartTitlesEnum.PopulationPyramid}
          </Link>
        </ListItem>
      </UnorderedList>
    </section>
  );
};

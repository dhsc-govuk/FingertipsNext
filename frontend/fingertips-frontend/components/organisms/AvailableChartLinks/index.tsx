import { Link, ListItem, UnorderedList } from 'govuk-react';
import { ZeroMarginParagraph } from '@/components/pages/home';
import { chartLinks } from '@/lib/ChartTitles/chartTitleLinksKey';

interface AvailableChartLinksProps {
  availableCharts: string[];
}

export const AvailableChartLinks = ({availableCharts} : Readonly<AvailableChartLinksProps>) => {
  
 const charts = ['line-chart', 'bar-chart-embedded-table-chart', 'heatmap-chart', 'spine-chart', 'inequalities-bar-chart', 'inequalities-line-chart', 'thematic-map-chart', 'population-pyramid-chart'];

  const filterCharts = charts.filter(chart => availableCharts.includes(chart));
  
  const filteredChartLinks = Object.keys(chartLinks).filter(chart => availableCharts.includes(chart));

  console.log('filteredChartLinks:', filteredChartLinks);
  console.log('filtered charts:', filterCharts);
  
  return (
    <section data-testid="availableChartLinks-component">
      <ZeroMarginParagraph>Available charts</ZeroMarginParagraph>
      <UnorderedList listStyleType='"— "'>
        {chartLinks
          .filter(link => availableCharts.includes(link.key))
          .map(link => (
            <ListItem key={link.key}>
              <Link href={link.href}>{link.title}</Link>
            </ListItem>
          ))}
      </UnorderedList>
    </section>
  );
};

import { Link, ListItem, UnorderedList } from 'govuk-react';
import { ZeroMarginParagraph } from '@/components/pages/home';
import { chartTitleConfig, ChartTitleConfigType } from '@/lib/ChartTitles/chartTitleEnums';

interface AvailableChartLinksProps {
  availableCharts: string[];
}

export function filterChartLinks(
  chartTitleConfig: ChartTitleConfigType,
  availableCharts: string[]
) {
  const chart = Object.entries(chartTitleConfig)

    .filter(([key]) => availableCharts.includes(key))
    .sort(
      ([aKey], [bKey]) => availableCharts.indexOf(aKey) - availableCharts.indexOf(bKey)
    );
  return chart 
}

export const AvailableChartLinks = ({
  availableCharts,
}: Readonly<AvailableChartLinksProps>) => {
  const filteredChartLinks = filterChartLinks(chartTitleConfig, availableCharts);
  
  console.log('Filtered Chart Links:', filteredChartLinks);

  return (
    <section data-testid="availableChartLinks-component">
      <ZeroMarginParagraph>Available charts</ZeroMarginParagraph>
      <UnorderedList listStyleType='"— "'>
        {filteredChartLinks.map(([key, value]) => (
          <ListItem key={key}>
            <Link href={value.href}>{value.title}</Link>
          </ListItem>
        ))}
      </UnorderedList>
    </section>
  );
};

import { Link, ListItem, UnorderedList } from 'govuk-react';
import { ZeroMarginParagraph } from '@/components/pages/home';
import { chartLinks } from '@/lib/ChartTitles/chartTitleLinksKey';

interface AvailableChartLinksProps {
  availableCharts: string[];
}

export const AvailableChartLinks = ({
  availableCharts,
}: Readonly<AvailableChartLinksProps>) => {
  const filteredChartLinks = chartLinks
    .filter((chart) => availableCharts.includes(chart.key))
    .sort(
      (a, b) => availableCharts.indexOf(a.key) - availableCharts.indexOf(b.key)
    );

  return (
    <section data-testid="availableChartLinks-component">
      <ZeroMarginParagraph>Available charts</ZeroMarginParagraph>
      <UnorderedList listStyleType='"— "'>
        {filteredChartLinks.map((link) => (
          <ListItem key={link.key}>
            <Link href={link.href}>{link.title}</Link>
          </ListItem>
        ))}
      </UnorderedList>
    </section>
  );
};

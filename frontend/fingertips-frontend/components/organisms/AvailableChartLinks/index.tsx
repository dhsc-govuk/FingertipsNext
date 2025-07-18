import { Link, ListItem, UnorderedList } from 'govuk-react';
import { ZeroMarginParagraph } from '@/components/pages/home';
import {
  chartTitleConfig,
  ChartTitleConfigType,
  ChartTitleKeysEnum,
} from '@/lib/ChartTitles/chartTitleEnums';
import { filterDefined } from '@/lib/chartHelpers/filterDefined';

interface AvailableChartLinksProps {
  availableCharts: ChartTitleKeysEnum[];
}

export function filterChartLinks(
  chartTitleConfig: ChartTitleConfigType,
  availableCharts: ChartTitleKeysEnum[]
) {
  return availableCharts
    .map((key) => chartTitleConfig[key])
    .filter(filterDefined);
}

export const AvailableChartLinks = ({
  availableCharts,
}: Readonly<AvailableChartLinksProps>) => {
  const filteredChartLinks = filterChartLinks(
    chartTitleConfig,
    availableCharts
  );

  return (
    <section data-testid="availableChartLinks-component">
      <ZeroMarginParagraph>Available charts</ZeroMarginParagraph>
      <UnorderedList listStyleType='"— "'>
        {filteredChartLinks.map((item) => (
          <ListItem key={item.href}>
            <Link href={item.href}>{item.title}</Link>
          </ListItem>
        ))}
      </UnorderedList>
    </section>
  );
};

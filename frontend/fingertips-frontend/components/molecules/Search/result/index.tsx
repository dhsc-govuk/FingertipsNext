import {
  H5,
  Paragraph,
  ListItem,
  SectionBreak,
  GridRow,
  GridCol,
  Checkbox,
  Link,
} from 'govuk-react';
import { spacing, typography } from '@govuk-react/lib';
import { IndicatorSearchResult } from '@/app/search/results/search-result-data';
import styled from 'styled-components';
import { usePathname, useSearchParams, useRouter } from 'next/navigation';
import { SearchStateManager } from '@/lib/searchStateManager';

type SearchResultProps = {
  result: IndicatorSearchResult;
  indicatorSelected?: boolean;
};

const StyledParagraph = styled(Paragraph)(
  typography.font({ size: 19, lineHeight: '0.5' })
);

const StyledRow = styled(GridRow)(
  spacing.withWhiteSpace({
    padding: [
      { size: 3, direction: 'top' },
      { size: 0, direction: 'bottom' },
      { size: 7, direction: 'left' },
      { size: 7, direction: 'right' },
    ],
  })
);

export function SearchResult({
  result,
  indicatorSelected,
}: Readonly<SearchResultProps>) {
  const searchParams = useSearchParams();
  const pathname = usePathname();
  const { replace } = useRouter();

  const handleClick = (indicatorId: string, checked: boolean) => {
    const params = new URLSearchParams(searchParams);
    const searchState = SearchStateManager.setStateFromParams(params);

    if (checked) {
      searchState.addIndicatorSelected(indicatorId);
    } else {
      searchState.removeIndicatorSelected(indicatorId);
    }

    replace(searchState.generatePath(pathname), { scroll: false });
  };

  const generatePath = (indicatorId: string): string => {
    const params = new URLSearchParams(searchParams);
    const searchState = SearchStateManager.setStateFromParams(params);
    const chartPath = '/chart';
    searchState.removeAllIndicatorSelected();
    searchState.addIndicatorSelected(indicatorId);

    return searchState.generatePath(chartPath);
  };

  return (
    <ListItem data-testid="search-result">
      <StyledRow>
        <GridCol>
          <Checkbox
            id={`search-results-indicator-${result.id.toString()}`}
            data-testid={`search-results-indicator-${result.id}`}
            name="indicator"
            value={result.id}
            defaultChecked={indicatorSelected}
            onChange={(e) => {
              handleClick(result.id.toString(), e.target.checked);
            }}
          >
            <H5>
              <Link href={generatePath(result.id.toString())}>
                {result.indicatorName}
              </Link>
            </H5>
            <StyledParagraph>{`Latest data period: ${result.latestDataPeriod}`}</StyledParagraph>
            <StyledParagraph>{`Data source: ${result.dataSource}`}</StyledParagraph>
            <StyledParagraph>{`Last updated: ${result.lastUpdated}`}</StyledParagraph>
          </Checkbox>
        </GridCol>
      </StyledRow>
      <SectionBreak visible={true} />
    </ListItem>
  );
}

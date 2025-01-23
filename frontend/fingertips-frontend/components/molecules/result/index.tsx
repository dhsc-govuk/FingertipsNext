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
import { IndicatorSearchResult } from '@/lib/search/searchResultData';
import styled from 'styled-components';
import { usePathname, useSearchParams, useRouter } from 'next/navigation';
import { SearchStateManager } from '@/lib/searchStateManager';

type SearchResultProps = {
  result: IndicatorSearchResult;
  indicatorSelected?: boolean;
};

const StyledParagraph = styled(Paragraph)(
  typography.font({ size: 19, lineHeight: '1.2' })
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

export function formatDate(date: Date | undefined): string {
  if (!date) return 'unknown';
  const day = String(date.getDate()).padStart(2, '0');
  const month = date.toLocaleString('en-GB', { month: 'long' });
  const year = date.getFullYear();

  return `${day} ${month} ${year}`;
}

export function SearchResult({
  result,
  indicatorSelected,
}: Readonly<SearchResultProps>) {
  const searchParams = useSearchParams();
  const pathname = usePathname();
  const { replace } = useRouter();
  const params = new URLSearchParams(searchParams);

  const handleClick = (indicatorId: string, checked: boolean) => {
    const searchState = SearchStateManager.setStateFromParams(params);

    if (checked) {
      searchState.addIndicatorSelected(indicatorId);
    } else {
      searchState.removeIndicatorSelected(indicatorId);
    }

    replace(searchState.generatePath(pathname), { scroll: false });
  };

  const generateIndicatorChartPath = (indicatorId: string): string => {
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
            id={`search-results-indicator-${result.indicatorId.toString()}`}
            data-testid={`search-results-indicator-${result.indicatorId}`}
            name="indicator"
            value={result.indicatorId}
            defaultChecked={indicatorSelected}
            onChange={(e) => {
              handleClick(result.indicatorId.toString(), e.target.checked);
            }}
          >
            <H5>
              <Link
                href={generateIndicatorChartPath(result.indicatorId.toString())}
              >
                {result.indicatorName}
              </Link>
            </H5>
            <StyledParagraph>{`Latest data period: ${result.latestDataPeriod}`}</StyledParagraph>
            <StyledParagraph>{`Data source: ${result.dataSource}`}</StyledParagraph>
            <StyledParagraph>{`Last updated: ${formatDate(result.lastUpdated)}`}</StyledParagraph>
          </Checkbox>
        </GridCol>
      </StyledRow>
      <SectionBreak visible={true} />
    </ListItem>
  );
}

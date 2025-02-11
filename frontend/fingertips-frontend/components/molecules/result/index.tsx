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
import styled from 'styled-components';
import { usePathname, useRouter } from 'next/navigation';
import {
  SearchParams,
  SearchStateManager,
  SearchStateParams,
} from '@/lib/searchStateManager';
import { IndicatorDocument } from '@/lib/search/searchTypes';

type SearchResultProps = {
  result: IndicatorDocument;
  indicatorSelected?: boolean;
  searchState?: SearchStateParams;
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
  searchState,
}: Readonly<SearchResultProps>) {
  const pathname = usePathname();
  const { replace } = useRouter();
  const stateManager =
    SearchStateManager.setStateFromSearchStateParams(searchState);

  const handleClick = (indicatorId: string, checked: boolean) => {
    if (checked) {
      stateManager.addParamValueToState(
        SearchParams.IndicatorsSelected,
        indicatorId
      );
    } else {
      stateManager.removeParamValueFromState(
        SearchParams.IndicatorsSelected,
        indicatorId
      );
    }

    replace(stateManager.generatePath(pathname), { scroll: false });
  };

  const generateIndicatorChartPath = (indicatorId: string): string => {
    const chartPath = '/chart';
    stateManager.removeAllParamFromState(SearchParams.IndicatorsSelected);
    stateManager.addParamValueToState(
      SearchParams.IndicatorsSelected,
      indicatorId
    );

    return stateManager.generatePath(chartPath);
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
                {result.name}
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

import {
  H5,
  Paragraph,
  ListItem,
  SectionBreak,
  GridRow,
  GridCol,
  Checkbox,
  Link,
  Tag,
} from 'govuk-react';
import { spacing, typography } from '@govuk-react/lib';
import styled from 'styled-components';
import {
  SearchParams,
  SearchStateManager,
  SearchStateParams,
} from '@/lib/searchStateManager';
import { IndicatorDocument } from '@/lib/search/searchTypes';
import { TagColours } from '@/lib/styleHelpers/colours';
import { isWithinOneMonth } from '@/lib/dateHelpers/dateComparison';

type SearchResultProps = {
  result: IndicatorDocument;
  indicatorSelected?: boolean;
  searchState?: SearchStateParams;
  handleClick: (indicatorId: string, checked: boolean) => void;
  currentDate?: Date;
};

const StyledParagraph = styled(Paragraph)(
  typography.font({ size: 19, lineHeight: '1' })
);

const FinalParagraph = styled(StyledParagraph)(
  spacing.withWhiteSpace({
    margin: [{ size: 2, direction: 'bottom' }],
  })
);

const PrimaryRow = styled(GridRow)(
  spacing.withWhiteSpace({
    padding: [
      { size: 3, direction: 'top' },
      { size: 0, direction: 'bottom' },
    ],
  })
);

const TagRow = styled(GridRow)(
  spacing.withWhiteSpace({
    margin: [{ size: 1, direction: 'top' }],
    padding: [
      { size: 0, direction: 'top' },
      { size: 0, direction: 'bottom' },
    ],
  })
);

const GreyTag = styled(Tag)({
  padding: '5px 8px 4px 8px',
  alignItems: 'center',
  fontWeight: '300',
  textTransform: 'unset',
  color: TagColours.GreyText,
  backgroundColor: TagColours.GreyBackground,
});

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
  handleClick,
  currentDate = new Date(),
}: Readonly<SearchResultProps>) {
  const stateManager = SearchStateManager.initialise(searchState);

  const generateIndicatorChartPath = (indicatorId: string): string => {
    const chartPath = '/chart';
    stateManager.removeAllParamFromState(SearchParams.IndicatorsSelected);
    stateManager.addParamValueToState(
      SearchParams.IndicatorsSelected,
      indicatorId
    );

    return stateManager.generatePath(chartPath);
  };

  const buildPeriodText = (earliest: string, latest: string): string => {
    return earliest === latest ? earliest : `${earliest} to ${latest}`;
  };

  return (
    <ListItem data-testid="search-result">
      <PrimaryRow>
        <GridCol>
          <Checkbox
            id={`search-results-indicator-${result.indicatorID.toString()}`}
            data-testid={`search-results-indicator-${result.indicatorID}`}
            name="indicator"
            value={result.indicatorID}
            defaultChecked={indicatorSelected}
            onChange={(e) => {
              handleClick(result.indicatorID.toString(), e.target.checked);
            }}
          >
            <H5>
              <Link
                href={generateIndicatorChartPath(result.indicatorID.toString())}
              >
                {result.indicatorName}
              </Link>
            </H5>
            <StyledParagraph>{`Data Period: ${buildPeriodText(result.earliestDataPeriod, result.latestDataPeriod)}`}</StyledParagraph>
            <FinalParagraph>{`Last updated: ${formatDate(result.lastUpdatedDate)}`}</FinalParagraph>
            <TagRow>
              <GridCol>
                {isWithinOneMonth(currentDate, result.lastUpdatedDate) ? (
                  <GreyTag data-testid="tag-recent-indicator">
                    Updated in last month
                  </GreyTag>
                ) : (
                  <></>
                )}
              </GridCol>
              <GridCol></GridCol>
              <GridCol></GridCol>
            </TagRow>
          </Checkbox>
        </GridCol>
      </PrimaryRow>
      <SectionBreak visible={true} />
    </ListItem>
  );
}

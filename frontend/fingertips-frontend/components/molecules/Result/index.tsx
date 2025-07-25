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
import { SearchParams, SearchStateManager } from '@/lib/searchStateManager';
import { IndicatorDocument } from '@/lib/search/searchTypes';
import { TagColours } from '@/lib/styleHelpers/colours';
import { formatDate, isWithinOneMonth } from '@/lib/dateHelpers/dateHelpers';
import { useLoadingState } from '@/context/LoaderContext';
import { TrendTag } from '../TrendTag';
import { HealthDataPointTrendEnum } from '@/generated-sources/ft-api-client';
import { useSearchStateParams } from '@/components/hooks/useSearchStateParams';

type SearchResultProps = {
  result: IndicatorDocument;
  showTrends: boolean;
  indicatorSelected?: boolean;
  handleClick: (indicatorId: string, checked: boolean) => void;
  currentDate?: Date;
};

const TagsColumn = styled(GridCol)`
  padding-right: 0px;
`;

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

export function SearchResult({
  result,
  showTrends,
  indicatorSelected,
  handleClick,
  currentDate = new Date(),
}: Readonly<SearchResultProps>) {
  const { setIsLoading } = useLoadingState();
  const searchState = useSearchStateParams();

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

  const formatDataPeriod = (earliest: string, latest: string): string => {
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
            className=""
          >
            <H5>
              <Link
                onClick={() => setIsLoading(true)}
                href={generateIndicatorChartPath(result.indicatorID.toString())}
              >
                {result.indicatorName}
              </Link>
            </H5>
            <StyledParagraph>{`Data period: ${formatDataPeriod(result.earliestDataPeriod, result.latestDataPeriod)}`}</StyledParagraph>
            <FinalParagraph>{`Last updated: ${formatDate(result.lastUpdatedDate)}`}</FinalParagraph>
            <TagRow>
              {isWithinOneMonth(currentDate, result.lastUpdatedDate) ? (
                <TagsColumn>
                  <GreyTag data-testid="tag-recent-indicator">
                    Updated in last month
                  </GreyTag>
                </TagsColumn>
              ) : (
                <></>
              )}
              {result.hasInequalities ? (
                <TagsColumn>
                  <GreyTag data-testid="tag-has-inequalities">
                    Contains inequality data
                  </GreyTag>
                </TagsColumn>
              ) : (
                <></>
              )}
            </TagRow>
          </Checkbox>
        </GridCol>
        {showTrends ? (
          <GridCol setWidth="one-quarter">
            <TrendTag
              trendFromResponse={
                result.trend ?? HealthDataPointTrendEnum.CannotBeCalculated
              }
            />
          </GridCol>
        ) : null}
      </PrimaryRow>
      <SectionBreak visible={true} />
    </ListItem>
  );
}

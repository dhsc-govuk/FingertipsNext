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
import { formatDate, isWithinOneMonth } from '@/lib/dateHelpers/dateHelpers';
import { areaCodeForEngland } from '@/lib/chartHelpers/constants';
import { TrendTag } from '../TrendTag';
import { HealthDataPointTrendEnum } from '@/generated-sources/ft-api-client';

type SearchResultProps = {
  result: IndicatorDocument;
  showTrends: boolean;
  indicatorSelected?: boolean;
  searchState?: SearchStateParams;
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
  }),
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

const IndicatorAndTrendContainer = styled.span({
  alignItems: 'center',
  alignSelf: 'stretch',
  display: 'flex',
  justifyContent: 'space-between'
});

export function SearchResult({
  result,
  showTrends,
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

    const areasSelected =
      stateManager.getSearchState()[SearchParams.AreasSelected];

    if (!areasSelected || areasSelected.length < 1) {
      stateManager.addParamValueToState(
        SearchParams.AreasSelected,
        areaCodeForEngland
      );
    }

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
          >
            <IndicatorAndTrendContainer>
              <H5>
                <Link
                  href={generateIndicatorChartPath(result.indicatorID.toString())}
                >
                  {result.indicatorName}
                </Link>
              </H5>
              { showTrends ? 
                <TrendTag 
                  trendFromResponse={result.trend ?? HealthDataPointTrendEnum.CannotBeCalculated}
                />
                : null 
              }
            </IndicatorAndTrendContainer>
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
      </PrimaryRow>
      <SectionBreak visible={true} />
    </ListItem>
  );
}

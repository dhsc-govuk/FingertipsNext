import { SearchResult } from '@/components/molecules/Result';
import { useLoadingState } from '@/context/LoaderContext';
import { IndicatorDocument } from '@/lib/search/searchTypes';
import {
  SearchParams,
  SearchStateManager,
  SearchStateParams,
} from '@/lib/searchStateManager';
import {
  Button,
  Checkbox,
  ListItem,
  Paragraph,
  SectionBreak,
  UnorderedList,
} from 'govuk-react';
import { usePathname, useRouter } from 'next/navigation';
import styled from 'styled-components';
import { IndicatorSort } from '@/components/forms/IndicatorSort/IndicatorSort';
import { useIndicatorSort } from '@/components/forms/IndicatorSort/useIndicatorSort';
import ReactPaginate from 'react-paginate';
import { GovukColours } from '@/lib/styleHelpers/colours';
import { Arrow } from '@/components/atoms/Arrow';
import { Direction } from '@/lib/common-types';
import { RESULTS_PER_PAGE } from '@/components/pages/results';
import { useSearchStateParams } from '@/components/hooks/useSearchStateParams';

const ResultLabelsContainer = styled.span({
  alignItems: 'center',
  display: 'flex',
  justifyContent: 'space-between',
});

const StyledParagraph = styled(Paragraph)({
  fontWeight: 'bold',
});

const StyledPagination = styled(ReactPaginate)({
  display: 'flex',
  fontSize: '19px',
  color: '#005ea5',
  justifyContent: 'center',
  marginTop: '20px',
  marginBottom: '20px',
  li: {
    'listStyleType': 'none',
    'textDecoration': 'underline',
    'textDecorationThickness': '1px',
    'textUnderlineOffset': '4px',
    'padding': '10px',
    'cursor': 'pointer',
    '&:hover': {
      backgroundColor: '#f0f0f0',
      textDecorationThickness: '4px',
    },
    '&.disabled': {
      display: 'none',
    },
    '&.selected': {
      backgroundColor: '#005ea5',
      color: '#fff',
    },
    'a': {
      '&:focus-visible': {
        color: `${GovukColours.Black}`,
        outline: `1px solid ${GovukColours.Yellow}`,
        background: `${GovukColours.Yellow}`,
      },
    },
    '&.break': {
      'color': `${GovukColours.DarkGrey}`,
      'textDecoration': 'none',
      'cursor': 'default',
      '&:hover': {
        backgroundColor: 'transparent',
      },
    },
  },
});

type IndicatorSelectionProps = {
  searchResults: IndicatorDocument[];
  showTrends: boolean;
  formAction: (payload: FormData) => void;
  currentDate?: Date;
  currentPage?: number;
  totalPages?: number;
};

const isIndicatorSelected = (
  indicatorId: string,
  state?: SearchStateParams
): boolean => {
  return state?.[SearchParams.IndicatorsSelected]
    ? state[SearchParams.IndicatorsSelected]?.some((ind) => ind === indicatorId)
    : false;
};

const generateKey = (
  indicatorId: string,
  state?: SearchStateParams
): string => {
  return `${indicatorId}-${isIndicatorSelected(indicatorId, state)}`;
};

function PageLabel(direction: Readonly<Direction>): React.ReactNode {
  if (direction === Direction.LEFT) {
    return (
      <>
        <Arrow direction={Direction.LEFT} strokeColour={GovukColours.Black} />
        <span style={{ paddingLeft: '10px' }}>Previous</span>
      </>
    );
  }
  return (
    <>
      <span style={{ paddingRight: '10px' }}>Next</span>
      <Arrow direction={Direction.RIGHT} strokeColour={GovukColours.Black} />
    </>
  );
}

const shouldDisableViewDataButton = (state?: SearchStateParams): boolean => {
  if (
    state?.[SearchParams.IndicatorsSelected] &&
    state?.[SearchParams.IndicatorsSelected]?.length > 0
  ) {
    return false;
  }
  return true;
};

export function IndicatorSelectionForm({
  searchResults,
  showTrends,
  formAction,
  currentDate,
  currentPage = 1,
  totalPages = 1,
}: Readonly<IndicatorSelectionProps>) {
  const pathname = usePathname();
  const { replace } = useRouter();
  const { setIsLoading } = useLoadingState();

  const searchStateFromQueryString = useSearchStateParams();
  const searchState = { ...searchStateFromQueryString };
  const availableIndicatorIds = searchResults.map(
    ({ indicatorID }) => indicatorID
  );
  searchState[SearchParams.IndicatorsSelected] =
    searchState[SearchParams.IndicatorsSelected]?.filter((indicatorId) =>
      availableIndicatorIds.includes(indicatorId)
    ) ?? [];

  const stateManager = SearchStateManager.initialise(searchState);

  const checkAllIndicatorsSelected = (
    searchResults: IndicatorDocument[],
    selectedIndicators: string[]
  ): boolean => {
    return searchResults.every((result) =>
      selectedIndicators.includes(result.indicatorID.toString())
    );
  };

  const selectedIndicators =
    searchState?.[SearchParams.IndicatorsSelected] || [];

  const setCurrentPage = (page: number) => {
    stateManager.setState({
      ...searchState,
      [SearchParams.PageNumber]: page.toString(),
    });
    history.replaceState({}, '', stateManager.generatePath(pathname));
  };

  const { sortedResults, selectedSortOrder, handleSortOrder } =
    useIndicatorSort(searchResults, setCurrentPage);

  const pageSearchResults = sortedResults.slice(
    (currentPage - 1) * RESULTS_PER_PAGE,
    currentPage * RESULTS_PER_PAGE
  );

  const areAllIndicatorsSelected = checkAllIndicatorsSelected(
    pageSearchResults,
    selectedIndicators
  );

  const handleClick = async (indicatorId: string, checked: boolean) => {
    setIsLoading(true);

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
    const newPath = stateManager.generatePath(pathname);
    replace(`${newPath}#search-results-indicator-${indicatorId}`, {
      scroll: false,
    });
  };

  const handleSelectAll = (checked: boolean) => {
    setIsLoading(true);

    const allIndicatorIdsForPage = pageSearchResults.map((result) =>
      result.indicatorID.toString()
    );

    if (checked) {
      stateManager.setState({
        ...searchState,
        [SearchParams.IndicatorsSelected]: allIndicatorIdsForPage,
      });
    } else {
      const newSelectedIndicators = selectedIndicators.filter(
        (indicatorId) => !allIndicatorIdsForPage.includes(indicatorId)
      );
      stateManager.setState({
        ...searchState,
        [SearchParams.IndicatorsSelected]: newSelectedIndicators,
      });
    }

    replace(
      `${stateManager.generatePath(pathname)}#search-results-indicator-all`,
      { scroll: false }
    );
  };

  return (
    <form
      action={formAction}
      data-testid="indicator-selection-form"
      style={{
        wordBreak: 'break-word',
      }}
    >
      <input
        data-testid="indicators-selection-form-state"
        key={`indicators-selection-form-state-${JSON.stringify(searchState)}`}
        name="searchState"
        defaultValue={JSON.stringify(searchState)}
        hidden
      />
      <IndicatorSort
        selectedSortOrder={selectedSortOrder}
        onChange={handleSortOrder}
      />
      {pageSearchResults.length ? (
        <>
          <ResultLabelsContainer>
            <Checkbox
              key={`select-all-indicator-${areAllIndicatorsSelected}`}
              data-testid="select-all-checkbox"
              defaultChecked={areAllIndicatorsSelected}
              onChange={(e) => handleSelectAll(e.target.checked)}
              id={'search-results-indicator-all'}
            >
              Select all
            </Checkbox>

            {showTrends ? (
              <StyledParagraph>Recent trend for selected area</StyledParagraph>
            ) : null}
          </ResultLabelsContainer>

          <UnorderedList listStyleType="none">
            <ListItem>
              <SectionBreak visible={true} />
            </ListItem>
            {pageSearchResults.map((result) => (
              <SearchResult
                key={generateKey(result.indicatorID.toString(), searchState)}
                result={result}
                showTrends={showTrends}
                indicatorSelected={isIndicatorSelected(
                  result.indicatorID.toString(),
                  searchState
                )}
                handleClick={handleClick}
                currentDate={currentDate}
              />
            ))}
          </UnorderedList>

          <Button
            type="submit"
            data-testid="search-results-button-submit"
            disabled={shouldDisableViewDataButton(searchState)}
            onClick={() => setIsLoading(true)}
          >
            View data
          </Button>

          {totalPages > 1 ? (
            <div data-testid="search-results-pagination">
              <StyledPagination
                nextLabel={PageLabel(Direction.RIGHT)}
                onPageChange={(event) =>
                  setCurrentPage && setCurrentPage(event.selected + 1)
                }
                marginPagesDisplayed={1}
                pageRangeDisplayed={2}
                pageCount={totalPages}
                previousLabel={PageLabel(Direction.LEFT)}
                renderOnZeroPageCount={null}
                forcePage={currentPage - 1}
              />
            </div>
          ) : null}
        </>
      ) : (
        <Paragraph>**No results found**</Paragraph>
      )}
    </form>
  );
}

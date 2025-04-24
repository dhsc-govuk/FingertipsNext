import { SearchResult } from '@/components/molecules/Result';
import { useLoadingState } from '@/context/LoaderContext';
import { useSearchState } from '@/context/SearchStateContext';
import { localeSort } from '@/components/organisms/Inequalities/inequalitiesHelpers';
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
  Pagination,
  Paragraph,
  SectionBreak,
  UnorderedList,
} from 'govuk-react';
import { usePathname, useRouter } from 'next/navigation';
import styled from 'styled-components';
import { IndicatorSort } from '@/components/forms/IndicatorSort/IndicatorSort';
import { useIndicatorSort } from '@/components/forms/IndicatorSort/useIndicatorSort';
import { useState } from 'react';

const ResultLabelsContainer = styled.span({
  alignItems: 'center',
  display: 'flex',
  justifyContent: 'space-between',
});

const StyledParagraph = styled(Paragraph)({
  fontWeight: 'bold',
});

type IndicatorSelectionProps = {
  searchResults: IndicatorDocument[];
  showTrends: boolean;
  formAction: (payload: FormData) => void;
  currentDate?: Date;
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
}: Readonly<IndicatorSelectionProps>) {
  const pathname = usePathname();
  const { replace } = useRouter();
  const { setIsLoading } = useLoadingState();
  const { getSearchState } = useSearchState();
  const searchState = getSearchState();
  const stateManager = SearchStateManager.initialise(searchState);

  const RESULTS_PER_PAGE = 15;
  const [currentPage, setCurrentPage] = useState(1);
  const totalPages = Math.ceil(searchResults.length / RESULTS_PER_PAGE);

  const checkAllIndicatorsSelected = (
    searchResults: IndicatorDocument[],
    selectedIndicators: string[]
  ): boolean => {
    const sortedResultIds = searchResults
      .map((result) => result.indicatorID.toString())
      .toSorted(localeSort);

    const sortedSelectedIndicators = selectedIndicators.toSorted(localeSort);

    return (
      JSON.stringify(sortedResultIds) ===
      JSON.stringify(sortedSelectedIndicators)
    );
  };

  const selectedIndicators =
    searchState?.[SearchParams.IndicatorsSelected] || [];

  const areAllIndicatorsSelected = checkAllIndicatorsSelected(
    searchResults,
    selectedIndicators
  );

  const { sortedResults, selectedSortOrder, handleSortOrder } =
    useIndicatorSort(searchResults);

  const pageSearchResults = sortedResults.slice(
    (currentPage - 1) * RESULTS_PER_PAGE,
    currentPage * RESULTS_PER_PAGE
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

    replace(stateManager.generatePath(pathname), { scroll: false });
  };

  const handleSelectAll = (checked: boolean) => {
    setIsLoading(true);

    if (checked) {
      const allIndicatorIds = pageSearchResults.map((result) =>
        result.indicatorID.toString()
      );
      stateManager.setState({
        ...searchState,
        [SearchParams.IndicatorsSelected]: allIndicatorIds,
      });
    } else {
      stateManager.removeAllParamFromState(SearchParams.IndicatorsSelected);
    }

    replace(stateManager.generatePath(pathname), { scroll: false });
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

          {sortedResults.length > RESULTS_PER_PAGE && (
            <Pagination data-testid="search-results-pagination">
              {currentPage > 1 && (
                <Pagination.Anchor
                  onClick={() => setCurrentPage(currentPage - 1)}
                  pageTitle={`${currentPage - 1} of ${totalPages}`}
                  previousPage
                  data-testid="pagination-previous-page"
                >
                  Previous page
                </Pagination.Anchor>
              )}
              {currentPage < totalPages && (
                <Pagination.Anchor
                  onClick={() => setCurrentPage(currentPage + 1)}
                  nextPage
                  pageTitle={`${currentPage + 1} of ${totalPages}`}
                  data-testid="pagination-next-page"
                >
                  Next page
                </Pagination.Anchor>
              )}
            </Pagination>
          )}
        </>
      ) : (
        <Paragraph>**No results found**</Paragraph>
      )}
    </form>
  );
}

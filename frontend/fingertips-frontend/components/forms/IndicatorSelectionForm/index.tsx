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
  ListItem,
  Paragraph,
  SectionBreak,
  UnorderedList,
  Checkbox,
} from 'govuk-react';
import { usePathname, useRouter } from 'next/navigation';
import styled from 'styled-components';

const ResultLabelsContainer = styled.span({
  alignItems: 'center',
  alignSelf: 'stretch',
  display: 'flex',
  justifyContent: 'space-between',
  padding: '20px 0px',
  fontWeight: 700,
  fontSize: '19px'
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
      const allIndicatorIds = searchResults.map((result) =>
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
      {searchResults.length ? (
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

            { showTrends ? <b>Recent trend for selected area</b> : null }
          </ResultLabelsContainer>

          <UnorderedList listStyleType="none">
            <ListItem>
              <SectionBreak visible={true} />
            </ListItem>
            {searchResults.map((result) => (
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
        </>
      ) : (
        <Paragraph>**No results found**</Paragraph>
      )}
    </form>
  );
}

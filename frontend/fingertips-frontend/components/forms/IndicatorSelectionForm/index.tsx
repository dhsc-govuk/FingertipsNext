import { SearchResult } from '@/components/molecules/Result';
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
  display: 'flex',
  justifyContent: 'space-between',
  padding: '20px 0px',
  fontFamily: 'nta,Arial,sans-serif',
  fontWeight: 700,
  fontSize: '19px',
  fontStyle: 'normal',
});

type IndicatorSelectionProps = {
  searchResults: IndicatorDocument[];
  searchState?: SearchStateParams;
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
  searchState,
  showTrends,
  formAction,
  currentDate,
}: Readonly<IndicatorSelectionProps>) {
  const pathname = usePathname();
  const { replace } = useRouter();

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
        name="searchState"
        defaultValue={JSON.stringify(searchState)}
        hidden
      />
      {searchResults.length ? (
        <>
          <ResultLabelsContainer>
            <Checkbox
              data-testid="select-all-checkbox"
              defaultChecked={areAllIndicatorsSelected}
              onChange={(e) => handleSelectAll(e.target.checked)}
            >
              Select all
            </Checkbox>

            {showTrends ? 'Recent trend for selected area' : null}
          </ResultLabelsContainer>

          <UnorderedList listStyleType="none">
            <ListItem>
              <SectionBreak visible={true} />
            </ListItem>
            {searchResults.map((result) => (
              <SearchResult
                key={result.indicatorID}
                result={result}
                showTrends={showTrends}
                indicatorSelected={isIndicatorSelected(
                  result.indicatorID.toString(),
                  searchState
                )}
                searchState={searchState}
                handleClick={handleClick}
                currentDate={currentDate}
              />
            ))}
          </UnorderedList>

          <Button
            type="submit"
            data-testid="search-results-button-submit"
            disabled={shouldDisableViewDataButton(searchState)}
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

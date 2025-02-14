import { SearchResult } from '@/components/molecules/result';
import { IndicatorSelectionState } from '@/components/forms/IndicatorSelectionForm/indicatorSelectionActions';
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
} from 'govuk-react';
import { usePathname, useRouter } from 'next/navigation';

type IndicatorSelectionProps = {
  searchResultsFormState: IndicatorSelectionState;
  searchResults: IndicatorDocument[];
  searchState?: SearchStateParams;
  formAction: (payload: FormData) => void;
};

const isIndicatorSelected = (
  indicatorId: string,
  state?: IndicatorSelectionState
): boolean => {
  return state?.indicatorsSelected
    ? state.indicatorsSelected?.some((ind) => ind === indicatorId)
    : false;
};

export function IndicatorSelectionForm({
  searchResultsFormState,
  searchResults,
  searchState,
  formAction,
}: Readonly<IndicatorSelectionProps>) {
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

  return (
    <form action={formAction} data-testid="indicator-selection-form">
      <input
        name="searchState"
        defaultValue={JSON.stringify(searchState)}
        hidden
      />
      {searchResults.length ? (
        <UnorderedList listStyleType="none">
          <ListItem>
            <SectionBreak visible={true} />
          </ListItem>
          {searchResults.map((result) => (
            <SearchResult
              key={result.indicatorId}
              result={result}
              indicatorSelected={isIndicatorSelected(
                result.indicatorId.toString(),
                searchResultsFormState
              )}
              searchState={searchState}
              handleClick={handleClick}
            />
          ))}
        </UnorderedList>
      ) : (
        <Paragraph>No results found</Paragraph>
      )}
      <Button type="submit" data-testid="search-results-button-submit">
        View charts
      </Button>
    </form>
  );
}

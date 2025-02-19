import { SearchResult } from '@/components/molecules/result';
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
  searchResults: IndicatorDocument[];
  searchState?: SearchStateParams;
  formAction: (payload: FormData) => void;
};

const isIndicatorSelected = (
  indicatorId: string,
  state?: SearchStateParams
): boolean => {
  return state?.[SearchParams.IndicatorsSelected]
    ? state[SearchParams.IndicatorsSelected]?.some((ind) => ind === indicatorId)
    : false;
};

export function IndicatorSelectionForm({
  searchResults,
  searchState,
  formAction,
}: Readonly<IndicatorSelectionProps>) {
  const pathname = usePathname();
  const { replace } = useRouter();

  const stateManager = SearchStateManager.initialise(searchState);

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
              key={result.indicatorID}
              result={result}
              indicatorSelected={isIndicatorSelected(
                result.indicatorID.toString(),
                searchState
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

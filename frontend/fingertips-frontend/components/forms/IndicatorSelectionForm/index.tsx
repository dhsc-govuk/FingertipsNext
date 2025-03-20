import { SearchResult } from '@/components/molecules/Result';
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
import { useState, useEffect} from 'react';

type IndicatorSelectionProps = {
  searchResults: IndicatorDocument[];
  searchState?: SearchStateParams;
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
  formAction,
  currentDate,
}: Readonly<IndicatorSelectionProps>) {
  const pathname = usePathname();
  const { replace } = useRouter();

  const stateManager = SearchStateManager.initialise(searchState);

  const [selectedIndicators, setSelectedIndicators] = useState<string[]>([]);
  const [isAllSelected, setIsAllSelected] = useState(false);

  useEffect(() => {
    const selectedFromState = searchState?.[SearchParams.IndicatorsSelected] || [];
    setSelectedIndicators(selectedFromState);
    setIsAllSelected(selectedFromState.length === searchResults.length);
  }, [searchState, searchResults.length]);

  const handleClick = async (indicatorId: string, checked: boolean) => {
    let updateIndicators = [...selectedIndicators];

    if (checked) {
      updateIndicators.push(indicatorId);
    } else {
      updateIndicators = updateIndicators.filter(id => id !== indicatorId);
    }

    setSelectedIndicators(updateIndicators);
    setIsAllSelected(updateIndicators.length === searchResults.length);
    
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
      const allIndicatorIds = searchResults.map(result => result.indicatorID.toString());
      setSelectedIndicators(allIndicatorIds);
    } else {
      setSelectedIndicators([]);
    }
    setIsAllSelected(checked);

    if (checked) {
      searchResults.forEach(result => {
        stateManager.addParamValueToState(SearchParams.IndicatorsSelected, result.indicatorID.toString());
      });
    } else {
      searchResults.forEach(result => {
        stateManager.removeParamValueFromState(SearchParams.IndicatorsSelected, result.indicatorID.toString());
      });
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
          <Checkbox
            id="select-all-checkbox"
            checked={isAllSelected}
            onChange={(e) => handleSelectAll(e.target.checked)}
          >
            Select all
          </Checkbox>

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

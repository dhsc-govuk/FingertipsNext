'use client';

import {
  BackLink,
  Button,
  ErrorSummary,
  GridCol,
  GridRow,
  H1,
  ListItem,
  Paragraph,
  SectionBreak,
  UnorderedList,
} from 'govuk-react';
import { useActionState } from 'react';
import { SearchResult } from '@/components/molecules/result';
import {
  SearchResultState,
  submitIndicatorSelection,
} from './searchResultsActions';
import {
  SearchParams,
  SearchStateManager,
  SearchStateParams,
} from '@/lib/searchStateManager';
import { AreaFilter } from '@/components/organisms/AreaFilter';
import { IndicatorDocument } from '@/lib/search/searchTypes';
import { AreaWithRelations, AreaType } from '@/generated-sources/ft-api-client';
import { IndicatorSearchForm } from '@/components/forms/IndicatorSearchForm';
import {
  IndicatorSearchFormState,
  searchIndicator,
} from '@/components/forms/IndicatorSearchForm/indicatorSearchActions';
import { useSearchParams } from 'next/navigation';

type SearchResultsProps = {
  searchResultsFormState: SearchResultState;
  searchResults: IndicatorDocument[];
  availableAreaTypes?: AreaType[];
  selectedAreas?: AreaWithRelations[];
};

const isIndicatorSelected = (
  indicatorId: string,
  state?: SearchResultState
): boolean => {
  return state?.indicatorsSelected
    ? state.indicatorsSelected?.some((ind) => ind === indicatorId)
    : false;
};

const generateBackLinkPath = (state: SearchStateParams) => {
  const stateManager = new SearchStateManager({
    [SearchParams.SearchedIndicator]: state[SearchParams.SearchedIndicator],
  });
  return stateManager.generatePath('/');
};

export function SearchResults({
  searchResultsFormState,
  searchResults,
  availableAreaTypes,
  selectedAreas,
}: Readonly<SearchResultsProps>) {
  const [state, formAction] = useActionState(
    viewCharts,
    searchResultsFormState
  );
  const stateParsed: SearchStateParams = JSON.parse(state.searchState);
  const backLinkPath = generateBackLinkPath(stateParsed);
  const [indicatorSelectionState, indicatorSelectionFormAction] =
    useActionState(submitIndicatorSelection, searchResultsFormState);

  const searchState = new SearchStateManager({
    [SearchParams.SearchedIndicator]: searchResultsFormState.searchedIndicator,
  });

  const urlSearchParams = useSearchParams();
  const params = new URLSearchParams(urlSearchParams);
  const areasSelected = params.getAll(SearchParams.AreasSelected);

  const initialIndicatorSearchFormState: IndicatorSearchFormState = {
    indicator: searchResultsFormState.searchedIndicator ?? '',
    areasSelected: areasSelected,
  };
  const [indicatorSearchState, indicatorSearchFormAction] = useActionState(
    searchIndicator,
    initialIndicatorSearchFormState
  );

  const backLinkPath = searchState.generatePath('/');

  return (
    <>
      <BackLink href={backLinkPath} data-testid="search-results-back-link" />
      {stateParsed[SearchParams.SearchedIndicator] ? (
        <>
          {indicatorSelectionState.message && (
            <ErrorSummary
              description={indicatorSelectionState.message}
              errors={[
                {
                  targetName: `search-results-indicator-${searchResults[0].indicatorId.toString()}`,
                  text: 'Available indicators',
                },
              ]}
              data-testid="search-result-form-error-summary"
              onHandleErrorClick={(targetName: string) => {
                const indicator = document.getElementById(targetName);
                indicator?.scrollIntoView(true);
                indicator?.focus();
              }}
            />
          )}
          <H1>
            Search results for {stateParsed[SearchParams.SearchedIndicator]}
          </H1>
          <form action={indicatorSearchFormAction}>
            <IndicatorSearchForm
              indicatorSearchFormState={indicatorSearchState}
            />
          </form>
          <GridRow>
            <GridCol setWidth="one-third">
              <AreaFilter
                availableAreaTypes={availableAreaTypes}
                selectedAreas={selectedAreas}
              />
            </GridCol>
            <GridCol>
              <form action={indicatorSelectionFormAction}>
                <input
                  name="searchState"
                  defaultValue={state.searchState}
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
                          indicatorSelectionState
                        )}
                      />
                    ))}
                  </UnorderedList>
                ) : (
                  <Paragraph>No results found</Paragraph>
                )}
                <Button
                  type="submit"
                  data-testid="search-results-button-submit"
                >
                  View charts
                </Button>
              </form>
            </GridCol>
          </GridRow>
        </>
      ) : (
        <Paragraph>No indicator entered</Paragraph>
      )}
    </>
  );
}

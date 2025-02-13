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
import {
  AreaWithRelations,
  AreaType,
  Area,
} from '@/generated-sources/ft-api-client';
import { IndicatorSearchForm } from '@/components/forms/IndicatorSearchForm';
import {
  IndicatorSearchFormState,
  searchIndicator,
} from '@/components/forms/IndicatorSearchForm/indicatorSearchActions';

type SearchResultsProps = {
  searchResultsFormState: SearchResultState;
  searchResults: IndicatorDocument[];
  availableAreaTypes?: AreaType[];
  availableGroupTypes?: AreaType[];
  availableAreas?: Area[];
  selectedAreasData?: AreaWithRelations[];
  searchState?: SearchStateParams;
};

const isIndicatorSelected = (
  indicatorId: string,
  state?: SearchResultState
): boolean => {
  return state?.indicatorsSelected
    ? state.indicatorsSelected?.some((ind) => ind === indicatorId)
    : false;
};

const generateBackLinkPath = (state?: SearchStateParams) => {
  const stateManager = new SearchStateManager({
    [SearchParams.SearchedIndicator]: state?.[SearchParams.SearchedIndicator],
  });
  return stateManager.generatePath('/');
};

export function SearchResults({
  searchResultsFormState,
  searchResults,
  availableAreaTypes,
  availableGroupTypes,
  availableAreas,
  selectedAreasData,
  searchState,
}: Readonly<SearchResultsProps>) {
  const [indicatorSelectionState, indicatorSelectionFormAction] =
    useActionState(submitIndicatorSelection, searchResultsFormState);

  const backLinkPath = generateBackLinkPath(searchState);

  const initialIndicatorSearchFormState: IndicatorSearchFormState = {
    indicator: searchState?.[SearchParams.SearchedIndicator] ?? '',
    areasSelected: searchState?.[SearchParams.AreasSelected],
  };
  const [indicatorSearchState, indicatorSearchFormAction] = useActionState(
    searchIndicator,
    initialIndicatorSearchFormState
  );

  return (
    <>
      <BackLink href={backLinkPath} data-testid="search-results-back-link" />
      {searchState?.[SearchParams.SearchedIndicator] ? (
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
            Search results for {searchState?.[SearchParams.SearchedIndicator]}
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
                availableGroupTypes={availableGroupTypes}
                availableAreas={availableAreas}
                selectedAreasData={selectedAreasData}
                searchState={searchState}
              />
            </GridCol>
            <GridCol>
              <form action={indicatorSelectionFormAction}>
                <input
                  name="searchState"
                  defaultValue={indicatorSelectionState.searchState}
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
                        searchState={searchState}
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

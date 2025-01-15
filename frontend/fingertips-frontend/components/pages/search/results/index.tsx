/* eslint-disable @typescript-eslint/no-explicit-any */
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
import { SearchResult } from '@/components/molecules/Search/result';

import { IndicatorSearchResult } from '@/app/search/results/search-result-data';
import { SearchResultState, viewCharts } from './searchResultsActions';
import { SearchStateManager } from '@/lib/searchStateManager';
import { GeographyFilter } from '@/components/organisms/GeographyFilter';
import { useSearchParams } from 'next/navigation';

type SearchResultsProps = {
  searchResultsFormState: SearchResultState;
  searchResults: IndicatorSearchResult[];
  selectedAreaCodesData: any[];
  availableGroupTypes: any[];
  availableGroups: any[];
  availableAreasInGroup: any[];
};

const isIndicatorSelected = (
  indicatorId: string,
  state?: SearchResultState
): boolean => {
  return state?.indicatorsSelected
    ? state.indicatorsSelected?.some((ind) => ind === indicatorId)
    : false;
};

export function SearchResults({
  searchResultsFormState,
  searchResults,
  selectedAreaCodesData,
  availableGroupTypes,
  availableGroups,
  availableAreasInGroup,
}: Readonly<SearchResultsProps>) {
  const searchParams = useSearchParams();

  const existingParams = new URLSearchParams(searchParams);
  const searchStateManager =
    SearchStateManager.setStateFromParams(existingParams);
  const searchState = searchStateManager.getSearchState();
  // const viewChartsWithState = viewCharts.bind(
  //   null,
  //   searchState.getSearchState()
  // );

  const [state, formAction] = useActionState(
    viewCharts,
    searchResultsFormState
  );

  // const searchState = new SearchStateManager({
  //   searchedIndicator: searchResultsFormState.searchedIndicator,
  // });

  const backLinkPath = searchStateManager.generatePath('/search');

  return (
    <>
      <BackLink href={backLinkPath} data-testid="search-results-back-link" />
      {searchState.searchedIndicator ? (
        <>
          {state.message && (
            <ErrorSummary
              description={state.message}
              errors={[
                {
                  targetName: `search-results-indicator-${searchResults[0].id.toString()}`,
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
          <H1>Search results</H1>
          <Paragraph>{`You searched for indicator "**${searchState.searchedIndicator}**"`}</Paragraph>

          <GridRow>
            <GridCol setWidth="one-third">
              <GeographyFilter
                // selectedAreas={'Greater Manchester ICB - 00T sub-location'}
                selectedAreaCodesData={selectedAreaCodesData}
                availableGroupTypes={availableGroupTypes}
                availableGroups={availableGroups}
                availableAreasInGroup={availableAreasInGroup}
              />
            </GridCol>
            <GridCol>
              <form action={formAction}>
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
                        key={result.id}
                        result={result}
                        indicatorSelected={isIndicatorSelected(
                          result.id.toString(),
                          state
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

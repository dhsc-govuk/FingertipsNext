'use client';

import {
  BackLink,
  Button,
  ErrorSummary,
  H1,
  ListItem,
  Paragraph,
  SectionBreak,
  UnorderedList,
} from 'govuk-react';
import { useActionState } from 'react';
import { SearchResult } from '@/components/molecules/result';

import { IndicatorSearchResult } from '@/app/results/search-result-data';
import { SearchResultState, viewCharts } from './searchResultsActions';
import { SearchStateManager } from '@/lib/searchStateManager';

type SearchResultsProps = {
  searchResultsFormState: SearchResultState;
  searchResults: IndicatorSearchResult[];
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
}: Readonly<SearchResultsProps>) {
  const [state, formAction] = useActionState(
    viewCharts,
    searchResultsFormState
  );

  const searchState = new SearchStateManager({
    searchedIndicator: searchResultsFormState.searchedIndicator,
  });

  const backLinkPath = searchState.generatePath('/');

  return (
    <>
      <BackLink href={backLinkPath} data-testid="search-results-back-link" />
      {searchResultsFormState.searchedIndicator ? (
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
          <Paragraph>{`You searched for indicator "**${searchResultsFormState.searchedIndicator}**"`}</Paragraph>
          <form action={formAction}>
            <input
              name="searchedIndicator"
              defaultValue={searchResultsFormState.searchedIndicator}
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

            <Button type="submit" data-testid="search-results-button-submit">
              View charts
            </Button>
          </form>
        </>
      ) : (
        <Paragraph>No indicator entered</Paragraph>
      )}
    </>
  );
}

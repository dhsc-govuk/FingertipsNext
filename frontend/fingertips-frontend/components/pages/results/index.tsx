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
import { SearchResultState, viewCharts } from './searchResultsActions';
import { SearchParams, SearchStateManager } from '@/lib/searchStateManager';
import { AreaFilter } from '@/components/organisms/AreaFilter';
import { IndicatorDocument } from '@/lib/search/searchTypes';
import { Area, AreaType } from '@/generated-sources/ft-api-client';

type SearchResultsProps = {
  searchResultsFormState: SearchResultState;
  searchResults: IndicatorDocument[];
  availableAreaTypes?: AreaType[];
  availableAreas?: Area[];
  selectedAreaType?: string;
  selectedGroupType?: string;
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
  availableAreaTypes,
  availableAreas,
  selectedAreaType,
  selectedGroupType,
}: Readonly<SearchResultsProps>) {
  const [state, formAction] = useActionState(
    viewCharts,
    searchResultsFormState
  );

  const searchState = new SearchStateManager({
    [SearchParams.SearchedIndicator]: searchResultsFormState.searchedIndicator,
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
          <H1>Search results</H1>
          <Paragraph>{`You searched for indicator "**${searchResultsFormState.searchedIndicator}**"`}</Paragraph>

          <GridRow>
            <GridCol setWidth="one-third">
              <AreaFilter
                availableAreaTypes={availableAreaTypes}
                availableAreas={availableAreas}
                selectedAreaType={selectedAreaType}
                selectedGroupType={selectedGroupType}
              />
            </GridCol>
            <GridCol>
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
                        key={result.indicatorId}
                        result={result}
                        indicatorSelected={isIndicatorSelected(
                          result.indicatorId.toString(),
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

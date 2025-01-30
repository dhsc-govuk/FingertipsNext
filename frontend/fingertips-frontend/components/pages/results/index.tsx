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
import { AreaType } from '@/generated-sources/ft-api-client';
import { IndicatorSearchForm } from '@/components/forms/IndicatorSearchForm';
import {
  IndicatorSearchFormState,
  searchIndicator,
} from '@/components/forms/IndicatorSearchForm/searchActions';

type SearchResultsProps = {
  searchResultsFormState: SearchResultState;
  searchResults: IndicatorDocument[];
  availableAreaTypes?: AreaType[];
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
}: Readonly<SearchResultsProps>) {
  const [viewChartsState, viewChartsFormAction] = useActionState(
    viewCharts,
    searchResultsFormState
  );

  const searchState = new SearchStateManager({
    [SearchParams.SearchedIndicator]: searchResultsFormState.searchedIndicator,
  });

  const initialIndicatorSearchFormState: IndicatorSearchFormState = {
    indicator: searchResultsFormState.searchedIndicator ?? '',
  };
  const [indicatorSearchState, indicatorSearchFormAction] = useActionState(
    searchIndicator,
    initialIndicatorSearchFormState
  );

  const backLinkPath = searchState.generatePath('/');

  return (
    <>
      <BackLink href={backLinkPath} data-testid="search-results-back-link" />
      {searchResultsFormState.searchedIndicator ? (
        <>
          {viewChartsState.message && (
            <ErrorSummary
              description={viewChartsState.message}
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
          <H1>Search results for {searchResultsFormState.searchedIndicator}</H1>
          <form action={indicatorSearchFormAction}>
            <IndicatorSearchForm searchFormState={indicatorSearchState} />
          </form>
          <GridRow>
            <GridCol setWidth="one-third">
              <AreaFilter availableAreaTypes={availableAreaTypes} />
            </GridCol>
            <GridCol>
              <form action={viewChartsFormAction}>
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
                          viewChartsState
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

'use client';

import {
  BackLink,
  Button,
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

type SearchResultsProps = {
  indicator: string;
  indicatorsSelected?: string[];
  searchResults: IndicatorSearchResult[];
};

const isIndicatorSelected = (
  indicatorId: string,
  state?: SearchResultState
): boolean => {
  return state?.indicators
    ? state.indicators?.some((ind) => ind === indicatorId)
    : false;
};

export function SearchResults({
  indicator,
  indicatorsSelected,
  searchResults,
}: Readonly<SearchResultsProps>) {
  const initialState: SearchResultState = { indicators: indicatorsSelected };
  const [state, formAction] = useActionState(viewCharts, initialState);

  return (
    <>
      <BackLink
        href={`/search?indicator=${indicator}`}
        data-testid="search-results-back-link"
      />
      {indicator ? (
        <>
          <H1>Search results</H1>
          <Paragraph>{`You searched for indicator "**${indicator}**"`}</Paragraph>
          <form action={formAction}>
            <input name="searchedIndicator" defaultValue={indicator} hidden />
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

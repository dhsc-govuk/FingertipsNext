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
import { SomeState, viewCharts } from './searchResultsActions';

type SearchResultsProps = {
  indicator: string;
  indicatorsSelected?: string[];
  searchResults: IndicatorSearchResult[];
};

const isIndicatorSelected = (
  state: SomeState,
  result: IndicatorSearchResult
): boolean => {
  return state.indicators
    ? state.indicators?.some((ind) => ind === result.id.toString())
    : false;
};

export function SearchResults({
  indicator,
  indicatorsSelected,
  searchResults,
}: Readonly<SearchResultsProps>) {
  const initialState: SomeState = { indicators: indicatorsSelected };
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
            {searchResults.length ? (
              <UnorderedList listStyleType="none">
                <ListItem>
                  <SectionBreak visible={true} />
                </ListItem>
                {searchResults.map((result) => (
                  <SearchResult
                    key={result.id}
                    result={result}
                    indicatorSelected={isIndicatorSelected(state, result)}
                  />
                ))}
              </UnorderedList>
            ) : (
              <Paragraph>No results found</Paragraph>
            )}

            <Button type="submit">View charts</Button>
          </form>
        </>
      ) : (
        <Paragraph>No indicator entered</Paragraph>
      )}
    </>
  );
}

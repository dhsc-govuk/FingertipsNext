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
  searchResults: IndicatorSearchResult[];
};

export function SearchResults({
  indicator,
  searchResults,
}: Readonly<SearchResultsProps>) {
  const initialState: SomeState = { indicators: [] };
  const [_state, formAction] = useActionState(viewCharts, initialState);

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
                  <SearchResult key={result.id} result={result} />
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

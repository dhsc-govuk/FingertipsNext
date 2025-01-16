'use client';

import {
  BackLink,
  H1,
  ListItem,
  Paragraph,
  SectionBreak,
  UnorderedList,
} from 'govuk-react';
import { SearchResult } from '@/components/molecules/Search/result';

import { IndicatorSearchResult } from '@/lib/search/searchResultData';

type SearchResultsProps = {
  indicator: string;
  searchResults: IndicatorSearchResult[];
};

export function SearchResults({
  indicator,
  searchResults,
}: Readonly<SearchResultsProps>) {
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
        </>
      ) : (
        <Paragraph>No indicator entered</Paragraph>
      )}
    </>
  );
}

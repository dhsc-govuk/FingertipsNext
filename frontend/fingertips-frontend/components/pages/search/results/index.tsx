'use client';

import { BackLink, H1, Paragraph, UnorderedList } from 'govuk-react';
import SearchResult from '@/components/molecules/Search/result';

import { SearchResultInterface } from '@/app/search/results/search-result-data';
import classes from './index.module.css';

type SearchResultsProps = {
  indicator: string;
  searchResults: SearchResultInterface[];
};

export default function SearchResults({
  indicator,
  searchResults,
}: Readonly<SearchResultsProps>) {
  return (
    <>
      <BackLink
        href={`/search?indicator=${indicator}`}
        data-testid="search-results-back-link"
      />
      <H1>Search results</H1>
      <Paragraph>{`You searched for indicator "**${indicator}**"`}</Paragraph>
      {searchResults.length ? (
        <UnorderedList className={classes['result']}>
          {searchResults.map((result) => (
            <SearchResult key={result.id} result={result} />
          ))}
        </UnorderedList>
      ) : null}
      {!searchResults.length && <Paragraph>No results found</Paragraph>}
    </>
  );
}

'use client';

import { BackLink, H1, Paragraph } from 'govuk-react';

export function SearchResults({ indicator }: Readonly<{ indicator: string }>) {
  return (
    <>
      <BackLink
        href={`/search?indicator=${indicator}`}
        data-testid="search-results-back-link"
      />
      <H1>Search results</H1>
      <Paragraph>{`You searched for indicator "**${indicator}**"`}</Paragraph>
    </>
  );
}

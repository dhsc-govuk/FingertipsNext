import { H5, Paragraph, ListItem } from 'govuk-react';

import { SearchResultInterface } from '@/app/search/results/search-result-data';

type SearchResultProps = {
  result: SearchResultInterface;
};

export default function SearchResult({ result }: Readonly<SearchResultProps>) {
  return (
    <ListItem data-testid="search-result">
      <H5>{result.topic}</H5>
      <Paragraph>{`Latest data period: ${result.latestDataPeriod}`}</Paragraph>
      <Paragraph>{`Data source: ${result.dataSource}`}</Paragraph>
      <Paragraph>{`Last updated: ${result.lastUpdated}`}</Paragraph>
    </ListItem>
  );
}

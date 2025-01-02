import {
  H5,
  Paragraph,
  ListItem,
  SectionBreak,
  GridRow,
  GridCol,
} from 'govuk-react';
import { spacing, typography } from '@govuk-react/lib';

import { BasicSearchResult } from '@/lib/search/searchResultData';
import styled from 'styled-components';

type SearchResultProps = {
  result: BasicSearchResult;
};

const StyledParagraph = styled(Paragraph)(
  typography.font({ size: 19, lineHeight: '1.2' })
);

const StyledRow = styled(GridRow)(
  spacing.withWhiteSpace({
    padding: [
      { size: 3, direction: 'top' },
      { size: 0, direction: 'bottom' },
      { size: 7, direction: 'left' },
      { size: 7, direction: 'right' },
    ],
  })
);

export function SearchResult({ result }: Readonly<SearchResultProps>) {
  return (
    <ListItem data-testid="search-result">
      <StyledRow>
        <GridCol>
          <H5>{result.indicatorName}</H5>
          <StyledParagraph>{`Latest data period: ${result.latestDataPeriod}`}</StyledParagraph>
          <StyledParagraph>{`Data source: ${result.dataSource}`}</StyledParagraph>
          <StyledParagraph>{`Last updated: ${result.lastUpdated}`}</StyledParagraph>
        </GridCol>
      </StyledRow>
      <SectionBreak visible="true" />
    </ListItem>
  );
}

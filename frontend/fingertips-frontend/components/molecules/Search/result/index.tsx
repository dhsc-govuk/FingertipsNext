import {
  H5,
  Paragraph,
  ListItem,
  SectionBreak,
  GridRow,
  GridCol,
  Checkbox,
} from 'govuk-react';
import { spacing, typography } from '@govuk-react/lib';
import { IndicatorSearchResult } from '@/app/search/results/search-result-data';
import styled from 'styled-components';
import { usePathname, useSearchParams, useRouter } from 'next/navigation';
import { updateIndicatorsSelectedUrlParam } from './clientActions';

type SearchResultProps = {
  result: IndicatorSearchResult;
  indicatorSelected?: boolean;
};

const StyledParagraph = styled(Paragraph)(
  typography.font({ size: 19, lineHeight: '0.5' })
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

export function SearchResult({
  result,
  indicatorSelected,
}: Readonly<SearchResultProps>) {
  const searchParams = useSearchParams();
  const pathname = usePathname();
  const { replace } = useRouter();

  const handleClick = (indicatorId: string, checked: boolean) => {
    const params = new URLSearchParams(searchParams);

    const updatedParams = updateIndicatorsSelectedUrlParam(
      params,
      indicatorId,
      checked
    );

    replace(`${pathname}?${updatedParams.toString()}`, { scroll: false });
  };

  return (
    <ListItem data-testid="search-result">
      <StyledRow>
        <GridCol>
          <Checkbox
            data-testid={`search-results-indicator-${result.id}`}
            name="indicator"
            value={result.id}
            defaultChecked={indicatorSelected}
            onChange={(e) => {
              handleClick(result.id.toString(), e.target.checked);
            }}
          >
            <H5>{result.indicatorName}</H5>
            <StyledParagraph>{`Latest data period: ${result.latestDataPeriod}`}</StyledParagraph>
            <StyledParagraph>{`Data source: ${result.dataSource}`}</StyledParagraph>
            <StyledParagraph>{`Last updated: ${result.lastUpdated}`}</StyledParagraph>
          </Checkbox>
        </GridCol>
      </StyledRow>
      <SectionBreak visible={true} />
    </ListItem>
  );
}

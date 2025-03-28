'use client';

import { IndicatorDocument } from '@/lib/search/searchTypes';
import { SearchStateParams } from '@/lib/searchStateManager';
import { GovukColours } from '@/lib/styleHelpers/colours';
import styled from 'styled-components';
import { IndicatorSelectedPill } from '@/components/molecules/IndicatorSelectedPill';
import { typography } from '@govuk-react/lib';

export interface FilterSummaryPanelProps {
  selectedIndicatorsData: IndicatorDocument[] | undefined;
  searchState?: SearchStateParams;
  changeSelection?: () => void;
}

const FocusAnchor = styled('button')(
  typography.font({ size: 16, lineHeight: '1' }),
  {
    'cursor': 'pointer',
    'textDecoration': 'underline',
    'border': 'none',
    'backgroundColor': 'transparent',
    '&:focus-visible': {
      outline: `3px solid ${GovukColours.Yellow}`,
      outlineOffset: -1,
      background: `${GovukColours.Yellow}`,
    },
  }
);

/*
Provides a view-only summary of the area filters and selected indicators
 */
export const FilterSummaryPanel = ({
  selectedIndicatorsData,
  searchState,
  changeSelection,
}: FilterSummaryPanelProps) => {
  return (
    <div data-testid="filter-summary-panel">
      <FocusAnchor data-testid="show-filter-cta" onClick={changeSelection}>
        Show filter
      </FocusAnchor>

      {selectedIndicatorsData?.length === 1 ? (
        <IndicatorSelectedPill
          key={selectedIndicatorsData[0].indicatorID}
          indicator={selectedIndicatorsData[0]}
          isFullWidth={false}
          searchState={searchState}
        />
      ) : null}

      <br />
    </div>
  );
};

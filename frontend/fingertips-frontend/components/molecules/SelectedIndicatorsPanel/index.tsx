import { IndicatorDocument } from '@/lib/search/searchTypes';
import { IndicatorSelectedPill } from '../IndicatorSelectedPill';
import styled from 'styled-components';
import { LabelText, SectionBreak } from 'govuk-react';
import { SearchStateParams } from '@/lib/searchStateManager';

interface SelectedIndicatorsPanelProps {
  selectedIndicatorsData: IndicatorDocument[];
  searchState?: SearchStateParams;
}

const StyledFilterSelectedIndicatorDiv = styled('div')({
  paddingBottom: '1.5em',
});

const StyledFilterLabel = styled(LabelText)({
  fontWeight: 'bold',
});

export function SelectedIndicatorsPanel({
  selectedIndicatorsData,
  searchState,
}: Readonly<SelectedIndicatorsPanelProps>) {
  return (
    <StyledFilterSelectedIndicatorDiv data-testid="selected-indicators-panel">
      <StyledFilterLabel>Selected indicators</StyledFilterLabel>
      {selectedIndicatorsData.map((indicator) => (
        <IndicatorSelectedPill
          key={indicator.indicatorID}
          indicator={indicator}
          inFilterPane={true}
          searchState={searchState}
        />
      ))}
      <SectionBreak visible={true} />
    </StyledFilterSelectedIndicatorDiv>
  );
}

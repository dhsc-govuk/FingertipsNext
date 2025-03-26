import { IndicatorDocument } from '@/lib/search/searchTypes';
import { IndicatorSelectedPill } from '../IndicatorSelectedPill';
import styled from 'styled-components';
import { Button, LabelText, SectionBreak } from 'govuk-react';
import {
  SearchStateManager,
  SearchStateParams,
} from '@/lib/searchStateManager';
import { useRouter } from 'next/navigation';

interface SelectedIndicatorsPanelProps {
  selectedIndicatorsData: IndicatorDocument[];
  searchState?: SearchStateParams;
  isFullWidth?: boolean;

  // If true the pill should only allow the data to be viewed, and have no
  // behaviour that can cause the UI to be changed.
  isViewOnly?: boolean;
}

const StyledFilterSelectedIndicatorDiv = styled('div')({
  paddingBottom: '1.5em',
});

const StyledFilterLabel = styled(LabelText)({
  fontWeight: 'bold',
});

const StyledButtonLink = styled(Button)({
  fontSize: 16,
  margin: '1em 0',
});

export function SelectedIndicatorsPanel({
  selectedIndicatorsData,
  searchState,
  isViewOnly,
  isFullWidth = true,
}: Readonly<SelectedIndicatorsPanelProps>) {
  const { replace } = useRouter();
  const stateManager = SearchStateManager.initialise(searchState);

  const addOrChangeIndicatorClick = () => {
    replace(stateManager.generatePath('/results'));
  };

  return (
    <StyledFilterSelectedIndicatorDiv data-testid="selected-indicators-panel">
      <StyledFilterLabel>
        {`Selected indicators (${selectedIndicatorsData?.length})`}
      </StyledFilterLabel>

      {selectedIndicatorsData.map((indicator) => (
        <IndicatorSelectedPill
          key={indicator.indicatorID}
          indicator={indicator}
          isFullWidth={isFullWidth}
          searchState={searchState}
        />
      ))}

      {isViewOnly ? null : (
        <>
          <StyledButtonLink onClick={addOrChangeIndicatorClick}>
            Add or change indicators
          </StyledButtonLink>

          <SectionBreak visible={true} />
        </>
      )}
    </StyledFilterSelectedIndicatorDiv>
  );
}

import { IndicatorDocument } from '@/lib/search/searchTypes';
import { IndicatorSelectedPill } from '../IndicatorSelectedPill';
import styled from 'styled-components';
import { Button, LabelText, SectionBreak } from 'govuk-react';
import { SearchStateManager } from '@/lib/searchStateManager';
import { useRouter } from 'next/navigation';
import { useLoadingState } from '@/context/LoaderContext';
import { useSearchState } from '@/context/SearchStateContext';

interface SelectedIndicatorsPanelProps {
  selectedIndicatorsData: IndicatorDocument[];
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
}: Readonly<SelectedIndicatorsPanelProps>) {
  const { replace } = useRouter();
  const { setIsLoading } = useLoadingState();
  const { getSearchState } = useSearchState();
  const searchState = getSearchState();

  const stateManager = SearchStateManager.initialise(searchState);

  const addOrChangeIndicatorClick = () => {
    setIsLoading(true);

    replace(stateManager.generatePath('/results'));
  };

  return (
    <StyledFilterSelectedIndicatorDiv data-testid="selected-indicators-panel">
      <StyledFilterLabel>Selected indicators</StyledFilterLabel>
      {selectedIndicatorsData.map((indicator) => (
        <IndicatorSelectedPill
          key={indicator.indicatorID}
          indicator={indicator}
          isFullWidth={true}
          searchState={searchState}
        />
      ))}
      <StyledButtonLink onClick={addOrChangeIndicatorClick}>
        Add or change indicators
      </StyledButtonLink>
      <SectionBreak visible={true} />
    </StyledFilterSelectedIndicatorDiv>
  );
}

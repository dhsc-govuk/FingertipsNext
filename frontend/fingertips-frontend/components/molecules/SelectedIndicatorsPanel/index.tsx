import { IndicatorDocument } from '@/lib/search/searchTypes';
import { IndicatorSelectedPill } from '../IndicatorSelectedPill';
import styled from 'styled-components';
import { Button, LabelText, SectionBreak } from 'govuk-react';
import { SearchStateManager } from '@/lib/searchStateManager';
import { useRouter } from 'next/navigation';
import { useLoadingState } from '@/context/LoaderContext';
import { useSearchStateParams } from '@/components/hooks/useSearchStateParams';

interface SelectedIndicatorsPanelProps {
  selectedIndicatorsData: IndicatorDocument[];
  isFullWidth?: boolean;
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
  isViewOnly,
  isFullWidth = true,
}: Readonly<SelectedIndicatorsPanelProps>) {
  const { replace } = useRouter();
  const { setIsLoading } = useLoadingState();
  const searchState = useSearchStateParams();

  const stateManager = SearchStateManager.initialise(searchState);

  const addOrChangeIndicatorClick = () => {
    setIsLoading(true);

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

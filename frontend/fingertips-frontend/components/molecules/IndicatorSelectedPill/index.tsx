'use client';

import { Pill } from '../Pill';
import styled from 'styled-components';
import { IndicatorDocument } from '@/lib/search/searchTypes';
import { Link } from 'govuk-react';
import { SearchStateManager } from '@/lib/searchStateManager';
import { useLoadingState } from '@/context/LoaderContext';
import { useSearchStateParams } from '@/components/hooks/useSearchStateParams';

const StyleIndicatorLink = styled(Link)({
  fontSize: 16,
});

interface IndicatorSelectedPillProps {
  indicator: IndicatorDocument;
  isFullWidth?: boolean;
}

export const IndicatorSelectedPill = ({
  indicator,
  isFullWidth,
}: Readonly<IndicatorSelectedPillProps>) => {
  const searchState = useSearchStateParams();
  const stateManager = SearchStateManager.initialise(searchState);
  const { setIsLoading } = useLoadingState();

  const indicatorInfoLink = stateManager.generatePath(
    `/indicator/${indicator.indicatorID}`
  );

  return (
    <Pill selectedFilterId={indicator.indicatorID} isFullWidth={isFullWidth}>
      {indicator.indicatorName}
      <br />
      <StyleIndicatorLink
        data-testid="view-background-info-link"
        href={indicatorInfoLink}
        onClick={() => setIsLoading(true)}
      >
        View background information
      </StyleIndicatorLink>
    </Pill>
  );
};

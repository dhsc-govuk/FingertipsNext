'use client';

import { Pill } from '../Pill';
import styled from 'styled-components';
import { IndicatorDocument } from '@/lib/search/searchTypes';
import { Link } from 'govuk-react';
import {
  SearchStateManager,
  SearchStateParams,
} from '@/lib/searchStateManager';

const StyleIndicatorLink = styled(Link)({
  fontSize: 16,
});

interface IndicatorSelectedPillProps {
  indicator: IndicatorDocument;
  isFullWidth?: boolean;
  searchState?: SearchStateParams;
}

export const IndicatorSelectedPill = ({
  indicator,
  isFullWidth,
  searchState,
}: Readonly<IndicatorSelectedPillProps>) => {
  const stateManager = SearchStateManager.initialise(searchState);

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
      >
        View background information
      </StyleIndicatorLink>
    </Pill>
  );
};

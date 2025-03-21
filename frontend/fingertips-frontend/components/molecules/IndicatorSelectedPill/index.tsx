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
  inFilterPane?: boolean;
  searchState?: SearchStateParams;
}

export const IndicatorSelectedPill = ({
  indicator,
  inFilterPane,
  searchState,
}: Readonly<IndicatorSelectedPillProps>) => {
  const stateManager = SearchStateManager.initialise(searchState);

  const indicatorInfoLink = stateManager.generatePath(
    `/indicator/${indicator.indicatorID}`
  );

  return (
    <Pill selectedFilterId={indicator.indicatorID} isFullWidth={inFilterPane}>
      {indicator.indicatorName}
      <br />
      <StyleIndicatorLink href={indicatorInfoLink}>
        View background information
      </StyleIndicatorLink>
    </Pill>
  );
};

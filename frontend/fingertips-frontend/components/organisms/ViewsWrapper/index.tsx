'use client';

import { IndicatorWithHealthDataForArea } from '@/generated-sources/ft-api-client';
import { SearchParams, SearchStateParams } from '@/lib/searchStateManager';
import { Paragraph } from 'govuk-react';
import { hasHealthDataCheck } from './hasHealthDataCheck';

interface ViewsWrapperProps {
  children: React.ReactNode;
  searchState?: SearchStateParams;
  indicatorsDataForAreas?: IndicatorWithHealthDataForArea[];
}

export function ViewsWrapper({
  children,
  searchState,
  indicatorsDataForAreas,
}: Readonly<ViewsWrapperProps>) {
  const areasSelected = searchState?.[SearchParams.AreasSelected];

  const hasHealthDataForAllSelectedAreasAndIndicators = hasHealthDataCheck(
    indicatorsDataForAreas ?? [],
    areasSelected ?? []
  );

  return (
    <>
      {hasHealthDataForAllSelectedAreasAndIndicators ? (
        children
      ) : (
        <Paragraph>No data</Paragraph>
      )}
    </>
  );
}

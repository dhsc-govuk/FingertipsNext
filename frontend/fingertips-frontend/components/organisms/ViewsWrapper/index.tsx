'use client';

import { IndicatorWithHealthDataForArea } from '@/generated-sources/ft-api-client';
import { SearchParams, SearchStateParams } from '@/lib/searchStateManager';
import { Paragraph } from 'govuk-react';
import { hasNoHealthDataCheck } from './hasNoHealthDataCheck';

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

  const hasNoHealthDataForAllSelectedAreasAndIndicators = hasNoHealthDataCheck(
    indicatorsDataForAreas ?? [],
    areasSelected ?? []
  );

  return (
    <>
      {!hasNoHealthDataForAllSelectedAreasAndIndicators ? (
        children
      ) : (
        <Paragraph>No data</Paragraph>
      )}
    </>
  );
}

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

  console.log(`ViewsWrapper ${areasSelected}`);

  const hasNoHealthDataForAllSelectedAreasAndIndicators = hasNoHealthDataCheck(
    indicatorsDataForAreas ?? [],
    areasSelected ?? []
  );

  console.log(
    `hasNoHealthDataForAllSelectedAreasAndIndicators ${hasNoHealthDataForAllSelectedAreasAndIndicators}`
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

'use client';

import { IndicatorWithHealthDataForArea } from '@/generated-sources/ft-api-client';
import { SearchParams, SearchStateParams } from '@/lib/searchStateManager';
import { Paragraph } from 'govuk-react';

interface ViewsWrapperProps {
  children: React.ReactNode;
  searchState?: SearchStateParams;
  indicatorData?: IndicatorWithHealthDataForArea;
}

export function ViewsWrapper({
  children,
  searchState,
  indicatorData,
}: Readonly<ViewsWrapperProps>) {
  const areasSelected = searchState?.[SearchParams.AreasSelected];

  const hasHealthDataForSelectedAreas = indicatorData?.areaHealthData
    ? indicatorData?.areaHealthData.reduce<boolean>(
        (hasHealthData, healthData) => {
          if (!hasHealthData) {
            return hasHealthData;
          }

          if (!areasSelected?.includes(healthData.areaCode)) {
            return false;
          }
          return true;
        },
        true
      )
    : false;

  return (
    <>
      {hasHealthDataForSelectedAreas ? (
        children
      ) : (
        <Paragraph>No data</Paragraph>
      )}
    </>
  );
}

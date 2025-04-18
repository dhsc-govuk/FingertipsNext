'use client';

import { IndicatorWithHealthDataForArea } from '@/generated-sources/ft-api-client';
import { SearchParams, SearchStateParams } from '@/lib/searchStateManager';
import { Paragraph } from 'govuk-react';
import { hasHealthDataCheck } from './hasHealthDataCheck';
import { determineAreaCodes } from '@/lib/chartHelpers/chartHelpers';

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

  const areaCodes = determineAreaCodes(areasSelected);

  const hasHealthDataForAllSelectedAreasAndIndicators = hasHealthDataCheck(
    indicatorsDataForAreas ?? [],
    areaCodes ?? []
  );

  return (
    <>
      {hasHealthDataForAllSelectedAreasAndIndicators ? (
        children
      ) : (
        <div
          data-testid="no-health-data-message"
          style={{ marginBottom: '3em' }}
        >
          <Paragraph>
            There is no indicator data available for the selected areas. Try
            again by selecting a different area.
          </Paragraph>
        </div>
      )}
    </>
  );
}

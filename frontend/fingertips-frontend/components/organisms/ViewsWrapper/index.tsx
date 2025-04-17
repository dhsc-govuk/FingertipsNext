'use client';

import { IndicatorWithHealthDataForArea } from '@/generated-sources/ft-api-client';
import { Paragraph } from 'govuk-react';
import { hasSufficientHealthDataCheck } from './hasSufficientHealthDataCheck';

interface ViewsWrapperProps {
  children: React.ReactNode;
  areaCodes: string[];
  indicatorsDataForAreas?: IndicatorWithHealthDataForArea[];
}

export function ViewsWrapper({
  children,
  areaCodes,
  indicatorsDataForAreas,
}: Readonly<ViewsWrapperProps>) {
  const hasHealthDataForAllSelectedAreasAndIndicators =
    hasSufficientHealthDataCheck(indicatorsDataForAreas ?? [], areaCodes ?? []);

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

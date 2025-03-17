'use client';

import { AreaFilterData } from '@/components/molecules/SelectAreasFilterPanel';
import { AreaFilterPane } from '@/components/organisms/AreaFilterPane';
import {
  SearchStateManager,
  SearchStateParams,
} from '@/lib/searchStateManager';
import { BackLink, GridCol, GridRow } from 'govuk-react';

interface ChartPageWrapperProps {
  children: React.ReactNode;
  searchState?: SearchStateParams;
  areaFilterData?: AreaFilterData;
}

export function ChartPageWrapper({
  children,
  searchState,
  areaFilterData,
}: Readonly<ChartPageWrapperProps>) {
  const stateManager = SearchStateManager.initialise(searchState);

  const backLinkPath = stateManager.generatePath('/results');

  return (
    <>
      <BackLink
        data-testid="chart-page-back-link"
        href={backLinkPath}
        aria-label="Go back to the previous page"
      />
      <GridRow>
        <GridCol setWidth="one-third">
          <AreaFilterPane
            key={JSON.stringify(searchState)}
            areaFilterData={areaFilterData}
            searchState={searchState}
          />
        </GridCol>
        <GridCol>{children}</GridCol>
      </GridRow>
    </>
  );
}

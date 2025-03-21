'use client';

import { AreaFilterData } from '@/components/molecules/SelectAreasFilterPanel';
import { AreaFilterPane } from '@/components/organisms/AreaFilterPane';
import { AreaWithRelations } from '@/generated-sources/ft-api-client';
import {
  SearchStateManager,
  SearchStateParams,
} from '@/lib/searchStateManager';
import { BackLink, GridCol, GridRow } from 'govuk-react';
import { useEffect } from 'react';

interface ChartPageWrapperProps {
  children: React.ReactNode;
  searchState?: SearchStateParams;
  areaFilterData?: AreaFilterData;
  selectedAreasData?: AreaWithRelations[];
}

export function ChartPageWrapper({
  children,
  searchState,
  areaFilterData,
  selectedAreasData,
}: Readonly<ChartPageWrapperProps>) {
  useEffect(() => {
    window.scrollTo(0, 0);
  }, []);

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
            selectedAreasData={selectedAreasData}
            searchState={searchState}
          />
        </GridCol>
        <GridCol>{children}</GridCol>
      </GridRow>
    </>
  );
}

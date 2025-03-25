'use client';

import { AreaFilterData } from '@/components/molecules/SelectAreasFilterPanel';
import { AreaFilterPane } from '@/components/organisms/AreaFilterPane';
import { useLoader } from '@/context/LoaderContext';
import { AreaWithRelations } from '@/generated-sources/ft-api-client';
import { IndicatorDocument } from '@/lib/search/searchTypes';
import {
  SearchStateManager,
  SearchStateParams,
} from '@/lib/searchStateManager';
import { BackLink, GridCol, GridRow, LoadingBox } from 'govuk-react';
import { useEffect } from 'react';

interface ChartPageWrapperProps {
  children: React.ReactNode;
  searchState?: SearchStateParams;
  areaFilterData?: AreaFilterData;
  selectedAreasData?: AreaWithRelations[];
  selectedIndicatorsData?: IndicatorDocument[];
}

export function ChartPageWrapper({
  children,
  searchState,
  areaFilterData,
  selectedAreasData,
  selectedIndicatorsData,
}: Readonly<ChartPageWrapperProps>) {
  const { isLoading, setIsLoading } = useLoader();

  useEffect(() => {
    setIsLoading(false);
  }, [setIsLoading]);

  const stateManager = SearchStateManager.initialise(searchState);

  const backLinkPath = stateManager.generatePath('/results');

  return (
    <LoadingBox loading={isLoading} timeIn={200} timeOut={200}>
      <>
        <BackLink
          data-testid="chart-page-back-link"
          onClick={() => setIsLoading(true)}
          href={backLinkPath}
          aria-label="Go back to the previous page"
        />
        <GridRow>
          <GridCol setWidth="one-third">
            <AreaFilterPane
              key={JSON.stringify(searchState)}
              areaFilterData={areaFilterData}
              selectedAreasData={selectedAreasData}
              selectedIndicatorsData={selectedIndicatorsData}
              searchState={searchState}
              pageType={'chart'}
            />
          </GridCol>
          <GridCol>{children}</GridCol>
        </GridRow>
      </>
    </LoadingBox>
  );
}

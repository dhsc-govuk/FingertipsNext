'use client';

import { AreaFilterData } from '@/components/molecules/SelectAreasFilterPanel';
import { AreaFilterPane } from '@/components/organisms/AreaFilterPane';
import { useLoadingState } from '@/context/LoaderContext';
import { useSearchState } from '@/context/SearchStateContext';
import { AreaWithRelations } from '@/generated-sources/ft-api-client';
import { IndicatorDocument } from '@/lib/search/searchTypes';
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
  selectedIndicatorsData?: IndicatorDocument[];
}

export function ChartPageWrapper({
  children,
  searchState,
  areaFilterData,
  selectedAreasData,
  selectedIndicatorsData,
}: Readonly<ChartPageWrapperProps>) {
  const { setIsLoading } = useLoadingState();
  const { setSearchState } = useSearchState();

  useEffect(() => {
    setSearchState(searchState ?? {});
  }, [searchState, setSearchState]);

  useEffect(() => {
    window.scrollTo(0, 0);
  }, []);

  const stateManager = SearchStateManager.initialise(searchState);

  const backLinkPath = stateManager.generatePath('/results');

  return (
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
            areaFilterData={areaFilterData}
            selectedAreasData={selectedAreasData}
            selectedIndicatorsData={selectedIndicatorsData}
          />
        </GridCol>
        <GridCol>{children}</GridCol>
      </GridRow>
    </>
  );
}

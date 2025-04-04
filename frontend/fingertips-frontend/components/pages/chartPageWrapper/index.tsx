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
import { BackLink, GridCol, GridRow, H2 } from 'govuk-react';
import { useEffect, useState } from 'react';
import { FilterSummaryPanel } from '@/components/molecules/FilterSummaryPanel';
import styled from 'styled-components';

const StyleGridColumnContentPanel = styled(GridCol)({
  overflow: 'hidden !important',
});

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
  const [isHideFilters, setIsHideFilters] = useState(false);
  const backLinkPath = stateManager.generatePath('/results');

  const width = !isHideFilters ? 'two-thirds' : undefined;

  return (
    <>
      <BackLink
        data-testid="chart-page-back-link"
        onClick={() => setIsLoading(true)}
        href={backLinkPath}
        aria-label="Go back to the previous page"
      />
      <GridRow>
        {isHideFilters ? null : (
          <GridCol setWidth="one-third">
            <AreaFilterPane
              areaFilterData={areaFilterData}
              selectedAreasData={selectedAreasData}
              selectedIndicatorsData={selectedIndicatorsData}
              hideFilters={() => setIsHideFilters(true)}
            />
          </GridCol>
        )}
        <StyleGridColumnContentPanel setWidth={width}>
          <H2>View data for selected indicators and areas</H2>

          {isHideFilters ? (
            <FilterSummaryPanel
              selectedIndicatorsData={selectedIndicatorsData}
              changeSelection={() => setIsHideFilters(false)}
            />
          ) : null}
          {children}
        </StyleGridColumnContentPanel>
      </GridRow>
    </>
  );
}

'use client';

import { AreaFilterData } from '@/components/molecules/SelectAreasFilterPanel';
import { AreaFilterPane } from '@/components/organisms/AreaFilterPane';
import { AreaWithRelations } from '@/generated-sources/ft-api-client';
import { IndicatorDocument } from '@/lib/search/searchTypes';
import {
  SearchStateManager,
  SearchStateParams,
} from '@/lib/searchStateManager';
import { BackLink, GridCol, GridRow, H2 } from 'govuk-react';
import { useEffect, useState } from 'react';
import { FilterSummaryPanel } from '@/components/molecules/FilterSummaryPanel';

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
  useEffect(() => {
    window.scrollTo(0, 0);
  }, []);

  const stateManager = SearchStateManager.initialise(searchState);
  // TODO: will need to persist this hide filters state when the chart page has dropdowns that can trigger a page refresh
  const [isHideFilters, setIsHideFilters] = useState(false);
  const backLinkPath = stateManager.generatePath('/results');

  return (
    <>
      <BackLink
        data-testid="chart-page-back-link"
        href={backLinkPath}
        aria-label="Go back to the previous page"
      />
      <GridRow>
        {isHideFilters ? null : (
          <GridCol setWidth="one-third">
            <AreaFilterPane
              key={JSON.stringify(searchState)}
              areaFilterData={areaFilterData}
              selectedAreasData={selectedAreasData}
              selectedIndicatorsData={selectedIndicatorsData}
              searchState={searchState}
              hideFilters={() => setIsHideFilters(true)}
            />
          </GridCol>
        )}
        <GridCol>
          <H2>View data for selected indicators and areas</H2>

          {isHideFilters ? (
            <FilterSummaryPanel
              selectedIndicatorsData={selectedIndicatorsData}
              searchState={searchState}
              changeSelection={() => setIsHideFilters(false)}
            />
          ) : null}
          {children}
        </GridCol>
      </GridRow>
    </>
  );
}

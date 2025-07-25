'use client';

import { AreaFilterData } from '@/components/molecules/SelectAreasFilterPanel';
import { AreaFilterPane } from '@/components/organisms/AreaFilterPane';
import { useLoadingState } from '@/context/LoaderContext';
import { Area } from '@/generated-sources/ft-api-client';
import { IndicatorDocument } from '@/lib/search/searchTypes';
import { SearchStateManager } from '@/lib/searchStateManager';
import { BackLink, GridCol, GridRow, H2 } from 'govuk-react';
import { useEffect, useState } from 'react';
import { FilterSummaryPanel } from '@/components/molecules/FilterSummaryPanel';
import styles from './ChartPageWrapper.module.css';
import { useSearchStateParams } from '@/components/hooks/useSearchStateParams';

interface ChartPageWrapperProps {
  children: React.ReactNode;
  areaFilterData?: AreaFilterData;
  selectedAreasData?: Area[];
  selectedIndicatorsData?: IndicatorDocument[];
}

export function ChartPageWrapper({
  children,
  areaFilterData,
  selectedAreasData,
  selectedIndicatorsData,
}: Readonly<ChartPageWrapperProps>) {
  const { setIsLoading } = useLoadingState();
  const searchState = useSearchStateParams();

  useEffect(() => {
    window.scrollTo(0, 0);
  }, []);

  const stateManager = SearchStateManager.initialise(searchState);
  const [isHideFilters, setIsHideFilters] = useState(false);
  const backLinkPath = stateManager.generatePath('/results');

  return (
    <div className={styles['chart-page-wrapper']}>
      <BackLink
        data-testid="chart-page-back-link"
        onClick={() => setIsLoading(true)}
        href={backLinkPath}
        aria-label="Go back to the previous page"
      />
      <GridRow>
        {isHideFilters ? null : (
          <GridCol className={styles['chart-area-filter-col']}>
            <AreaFilterPane
              areaFilterData={areaFilterData}
              selectedAreasData={selectedAreasData}
              selectedIndicatorsData={selectedIndicatorsData}
              hideFilters={() => setIsHideFilters(true)}
            />
          </GridCol>
        )}
        <GridCol
          className={styles['chart-content-col']}
          id={'chartPageContent'}
        >
          <H2>View data for selected indicators and areas</H2>

          {isHideFilters ? (
            <FilterSummaryPanel
              selectedIndicatorsData={selectedIndicatorsData}
              changeSelection={() => setIsHideFilters(false)}
            />
          ) : null}
          {children}
        </GridCol>
      </GridRow>
    </div>
  );
}

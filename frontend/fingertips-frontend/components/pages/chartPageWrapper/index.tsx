'use client';

import { AreaFilterData } from '@/components/molecules/SelectAreasFilterPanel';
import { AreaFilterPane } from '@/components/organisms/AreaFilterPane';
import { useLoadingState } from '@/context/LoaderContext';
import { useSearchState } from '@/context/SearchStateContext';
import { Area } from '@/generated-sources/ft-api-client';
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
  selectedAreasData?: Area[];
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

  const [containerStyle, setContainerStyle] = useState({
    width: 80,
    areaFilterCol: 'one-quarter',
    chartCol: 'three-quarters',
  });

  useEffect(() => {
    function handleResize() {
      if (window.innerWidth > 1200) {
        setContainerStyle({
          width: 80,
          areaFilterCol: 'one-quarter',
          chartCol: 'three-quarters',
        });
      } else {
        setContainerStyle({
          width: 90,
          areaFilterCol: 'one-third',
          chartCol: 'two-thirds',
        });
      }
    }
    window.addEventListener('resize', handleResize);
    handleResize();
    return () => window.removeEventListener('resize', handleResize);
  }, []);

  const chartContentWidth = isHideFilters ? 'full' : containerStyle.chartCol;

  return (
    <div
      style={{
        width: `${containerStyle.width}vw`,
        marginLeft: `calc(-${containerStyle.width / 2}vw + 50%)`,
      }}
    >
      <BackLink
        data-testid="chart-page-back-link"
        onClick={() => setIsLoading(true)}
        href={backLinkPath}
        aria-label="Go back to the previous page"
      />
      <GridRow>
        {isHideFilters ? null : (
          <GridCol setWidth={containerStyle.areaFilterCol}>
            <AreaFilterPane
              areaFilterData={areaFilterData}
              selectedAreasData={selectedAreasData}
              selectedIndicatorsData={selectedIndicatorsData}
              hideFilters={() => setIsHideFilters(true)}
            />
          </GridCol>
        )}
        <GridCol setWidth={chartContentWidth} id={'chartPageContent'}>
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

'use client';

import { H2, Paragraph } from 'govuk-react';
import { BarChartEmbeddedTable } from '@/components/organisms/BarChartEmbeddedTable';
import {
  SearchParams,
  SearchStateManager,
  SearchStateParams,
} from '@/lib/searchStateManager';
import { HealthDataForArea } from '@/generated-sources/ft-api-client';
import { IndicatorDocument } from '@/lib/search/searchTypes';
import { seriesDataWithoutEnglandOrGroup } from '@/lib/chartHelpers/chartHelpers';
import { areaCodeForEngland } from '@/lib/chartHelpers/constants';
import styled from 'styled-components';
import { typography } from '@govuk-react/lib';

type OneIndicatorTwoOrMoreAreasViewPlotsProps = {
  healthIndicatorData: HealthDataForArea[];
  searchState: SearchStateParams;
  indicatorMetadata?: IndicatorDocument;
};

const StyledParagraphDataSource = styled(Paragraph)(
  typography.font({ size: 16 })
);
export function OneIndicatorTwoOrMoreAreasViewPlots({
  healthIndicatorData,
  searchState,
  indicatorMetadata,
}: Readonly<OneIndicatorTwoOrMoreAreasViewPlotsProps>) {
  const stateManager = SearchStateManager.initialise(searchState);
  const {
    [SearchParams.AreasSelected]: areasSelected,
    [SearchParams.GroupSelected]: selectedGroupCode,
  } = stateManager.getSearchState();

  const dataWithoutEngland = seriesDataWithoutEnglandOrGroup(
    healthIndicatorData,
    selectedGroupCode
  );
  const englandBenchmarkData = healthIndicatorData.find(
    (areaData) => areaData.areaCode === areaCodeForEngland
  );

  const groupData =
    selectedGroupCode && selectedGroupCode != areaCodeForEngland
      ? healthIndicatorData.find(
          (areaData) => areaData.areaCode === selectedGroupCode
        )
      : undefined;

  return (
    <section data-testid={'oneIndicatorTwoOrMoreAreasViewPlot-component'}>
      <H2>View data for selected indicators and areas</H2>
      <BarChartEmbeddedTable
        healthIndicatorData={dataWithoutEngland}
        benchmarkData={englandBenchmarkData}
        groupIndicatorData={groupData}
      ></BarChartEmbeddedTable>

      <>
        {indicatorMetadata ? (
          <StyledParagraphDataSource>
            {`Data source: ${indicatorMetadata.dataSource}`}
          </StyledParagraphDataSource>
        ) : null}
      </>
    </section>
  );
}

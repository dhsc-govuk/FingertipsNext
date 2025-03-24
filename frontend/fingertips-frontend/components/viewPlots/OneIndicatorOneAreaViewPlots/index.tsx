'use client';

import { TabContainer } from '@/components/layouts/tabContainer';
import { LineChart } from '@/components/organisms/LineChart';
import { LineChartTable } from '@/components/organisms/LineChartTable';
import {
  isEnglandSoleSelectedArea,
  seriesDataWithoutEnglandOrGroup,
} from '@/lib/chartHelpers/chartHelpers';
import { areaCodeForEngland } from '@/lib/chartHelpers/constants';
import { SearchParams, SearchStateManager } from '@/lib/searchStateManager';
import { H2, H3, Paragraph } from 'govuk-react';
import styled from 'styled-components';
import { typography } from '@govuk-react/lib';
import { ViewPlotProps } from '../ViewPlotProps';
import { HealthDataForArea } from '@/generated-sources/ft-api-client';
import { Inequalities } from '@/components/organisms/Inequalities';
import {
  generateStandardLineChartOptions,
  getAllDataWithoutInequalities,
  LineChartVariant,
} from '@/components/organisms/LineChart/lineChartHelpers';
import { useState } from 'react';

const StyledParagraphDataSource = styled(Paragraph)(
  typography.font({ size: 16 })
);

function shouldLineChartBeShown(
  dataWithoutEnglandOrGroup: HealthDataForArea[],
  englandBenchmarkData: HealthDataForArea | undefined
) {
  return (
    dataWithoutEnglandOrGroup[0]?.healthData.length > 1 ||
    (englandBenchmarkData && englandBenchmarkData.healthData.length > 1)
  );
}

export function OneIndicatorOneAreaViewPlots({
  healthIndicatorData,
  searchState,
  indicatorMetadata,
}: Readonly<ViewPlotProps>) {
  const stateManager = SearchStateManager.initialise(searchState);
  const {
    [SearchParams.GroupSelected]: selectedGroupCode,
    [SearchParams.AreasSelected]: areasSelected,
  } = stateManager.getSearchState();
  const [showConfidenceIntervalsData, setShowConfidenceIntervalsData] =
    useState<boolean>(false);

  const dataWithoutEnglandOrGroup = seriesDataWithoutEnglandOrGroup(
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

  const {
    areaDataWithoutInequalities,
    englandBenchmarkWithoutInequalities,
    groupDataWithoutInequalities,
  } = getAllDataWithoutInequalities(
    dataWithoutEnglandOrGroup,
    { englandBenchmarkData, groupData },
    areasSelected
  );

  const yAxisTitle = indicatorMetadata?.unitLabel
    ? `Value: ${indicatorMetadata?.unitLabel}`
    : undefined;

  const lineChartOptions: Highcharts.Options = generateStandardLineChartOptions(
    areaDataWithoutInequalities,
    showConfidenceIntervalsData,
    {
      benchmarkData: englandBenchmarkWithoutInequalities,
      groupIndicatorData: groupDataWithoutInequalities,
      yAxisTitle,
      xAxisTitle: 'Year',
      measurementUnit: indicatorMetadata?.unitLabel,
      accessibilityLabel: 'A line chart showing healthcare data',
    }
  );
  return (
    <section data-testid="oneIndicatorOneAreaViewPlot-component">
      <H2>View data for selected indicators and areas</H2>
      {shouldLineChartBeShown(
        areaDataWithoutInequalities,
        englandBenchmarkWithoutInequalities
      ) && (
        <>
          <H3>Indicator data over time</H3>
          <TabContainer
            id="lineChartAndTable"
            items={[
              {
                id: 'lineChart',
                title: 'Line chart',
                content: (
                  <LineChart
                    lineChartOptions={lineChartOptions}
                    showConfidenceIntervalsData={showConfidenceIntervalsData}
                    setShowConfidenceIntervalsData={
                      setShowConfidenceIntervalsData
                    }
                    variant={LineChartVariant.Standard}
                  />
                ),
              },
              {
                id: 'lineChartTable',
                title: 'Table',
                content: (
                  <LineChartTable
                    healthIndicatorData={areaDataWithoutInequalities}
                    englandBenchmarkData={englandBenchmarkWithoutInequalities}
                    groupIndicatorData={groupDataWithoutInequalities}
                    measurementUnit={indicatorMetadata?.unitLabel}
                  />
                ),
              },
            ]}
            footer={
              <>
                {indicatorMetadata ? (
                  <StyledParagraphDataSource>
                    {`Data source: ${indicatorMetadata.dataSource}`}
                  </StyledParagraphDataSource>
                ) : null}
              </>
            }
          />
        </>
      )}
      <Inequalities
        healthIndicatorData={
          !isEnglandSoleSelectedArea(searchState[SearchParams.AreasSelected])
            ? dataWithoutEnglandOrGroup[0]
            : healthIndicatorData[0]
        }
        searchState={searchState}
        measurementUnit={indicatorMetadata?.unitLabel}
      />
    </section>
  );
}

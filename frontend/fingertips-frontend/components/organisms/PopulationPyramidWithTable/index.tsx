'use client';

import { HealthDataForArea } from '@/generated-sources/ft-api-client';
import { PopulationPyramid } from '@/components/organisms/PopulationPyramid';
import {
  createPyramidPopulationDataFrom,
  PopulationDataForArea,
} from '@/lib/chartHelpers/preparePopulationData';
import { TabContainer } from '@/components/layouts/tabContainer';
import { H3 } from 'govuk-react';
import {
  determineHealthDataForArea,
  seriesDataWithoutGroup,
} from '@/lib/chartHelpers/chartHelpers';
import { SearchParams, SearchStateParams } from '@/lib/searchStateManager';
import { ArrowExpander } from '@/components/molecules/ArrowExpander';
import { PopulationPyramidChartTable } from '../PopulationPyramidChartTable';
import { ChartSelectArea } from '@/components/molecules/ChartSelectArea';
import { areaCodeForEngland } from '@/lib/chartHelpers/constants';
import { StyleChartWrapper } from '@/components/styles/viewPlotStyles/styleChartWrapper';
import {
  determineHeaderTitle,
  determinePopulationDataForArea,
  determineYear,
} from './populationPyramidHelpers';
import { AreaWithoutAreaType } from '@/lib/common-types';

interface PyramidPopulationChartViewProps {
  healthDataForAreas: HealthDataForArea[];
  xAxisTitle: string;
  yAxisTitle: string;
  searchState: SearchStateParams;
  indicatorId: string;
  indicatorName: string;
}
export const PopulationPyramidWithTable = ({
  healthDataForAreas,
  xAxisTitle,
  yAxisTitle,
  searchState,
  indicatorId,
  indicatorName,
}: Readonly<PyramidPopulationChartViewProps>) => {
  const {
    [SearchParams.PopulationAreaSelected]: populationAreaSelected,
    [SearchParams.GroupSelected]: groupSelected,
    [SearchParams.AreaTypeSelected]: areaTypeSelected,
  } = searchState;

  const healthdataWithoutGroup = seriesDataWithoutGroup(
    healthDataForAreas,
    groupSelected,
    true
  );

  const healthDataForAreaSelected = determineHealthDataForArea(
    healthdataWithoutGroup,
    populationAreaSelected
  );

  const { areas, benchmark, group } = createPyramidPopulationDataFrom(
    healthDataForAreas,
    groupSelected ?? ''
  );

  const availableAreas: AreaWithoutAreaType[] = healthdataWithoutGroup
    .map((area) => {
      if (area.areaCode && area.areaName) {
        return {
          code: area.areaCode,
          name: area.areaName,
        };
      }
    })
    .filter((area) => area !== undefined);

  const areasForPopulationData: PopulationDataForArea[] = [];
  areasForPopulationData.push(...areas);
  if (benchmark) areasForPopulationData.push(benchmark);
  if (group) areasForPopulationData.push(group);

  const populationDataForSelectedArea = determinePopulationDataForArea(
    areasForPopulationData,
    availableAreas,
    populationAreaSelected
  );

  if (!populationDataForSelectedArea) return null;

  const benchmarkToUse =
    populationDataForSelectedArea.areaCode !== areaCodeForEngland
      ? benchmark
      : undefined;

  const groupToUse =
    populationDataForSelectedArea.areaCode !== areaCodeForEngland
      ? group
      : undefined;

  const period = determineYear(healthDataForAreaSelected?.healthData ?? []);

  const title = determineHeaderTitle(
    healthDataForAreaSelected,
    areaTypeSelected,
    period
  );

  return (
    <div data-testid="populationPyramidWithTable-component">
      <StyleChartWrapper>
        <H3 style={{ fontSize: '24px' }}>Related population data</H3>
        <ArrowExpander
          openTitle="Show population data"
          closeTitle="Hide population data"
        >
          <div key={`population-pyramid-${JSON.stringify(searchState)}`}>
            <ChartSelectArea
              availableAreas={availableAreas}
              chartAreaSelectedKey={SearchParams.PopulationAreaSelected}
              searchState={searchState}
            />
            <TabContainer
              id="pyramidChartAndTableView"
              items={[
                {
                  id: 'populationPyramidChart',
                  title: 'Population pyramid',
                  content: (
                    <PopulationPyramid
                      title={title}
                      dataForSelectedArea={populationDataForSelectedArea}
                      dataForGroup={groupToUse}
                      dataForBenchmark={benchmarkToUse}
                      xAxisTitle={xAxisTitle}
                      yAxisTitle={yAxisTitle}
                    />
                  ),
                },
                {
                  id: 'populationPyramidTable',
                  title: 'Table',
                  content: (
                    <PopulationPyramidChartTable
                      title={title}
                      healthDataForArea={populationDataForSelectedArea}
                      benchmarkData={benchmarkToUse}
                      groupData={groupToUse}
                      indicatorId={indicatorId}
                      indicatorName={indicatorName}
                      period={period}
                    />
                  ),
                },
              ]}
            />
          </div>
        </ArrowExpander>
      </StyleChartWrapper>
    </div>
  );
};

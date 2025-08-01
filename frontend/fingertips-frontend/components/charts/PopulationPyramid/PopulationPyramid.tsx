'use client';

import {
  HealthDataForArea,
  PeriodType,
  ReportingPeriod,
} from '@/generated-sources/ft-api-client';
import { PopulationPyramidChart } from '@/components/charts/PopulationPyramid/PopulationPyramidChart/PopulationPyramidChart';
import {
  createPyramidPopulationDataFrom,
  PopulationDataForArea,
} from './helpers/preparePopulationData';
import { TabContainer } from '@/components/layouts/tabContainer';
import { H3 } from 'govuk-react';
import {
  determineHealthDataForArea,
  seriesDataWithoutGroup,
} from '@/lib/chartHelpers/chartHelpers';
import { SearchParams } from '@/lib/searchStateManager';
import { ArrowExpander } from '@/components/molecules/ArrowExpander';
import { PopulationPyramidChartTable } from './PopulationPyramidTable/PopulationPyramidTableGroup';
import { ChartSelectArea } from '@/components/molecules/ChartSelectArea';
import { areaCodeForEngland } from '@/lib/chartHelpers/constants';
import { StyleChartWrapper } from '@/components/styles/viewPlotStyles/styleChartWrapper';
import {
  determineHeaderTitle,
  determinePopulationDataForArea,
  determineYear,
} from './helpers/populationPyramidHelpers';
import { AreaWithoutAreaType } from '@/lib/common-types';
import { useSearchStateParams } from '@/components/hooks/useSearchStateParams';
import {
  chartTitleConfig,
  ChartTitleKeysEnum,
} from '@/lib/ChartTitles/chartTitleEnums';

interface PyramidPopulationChartViewProps {
  healthDataForAreas: HealthDataForArea[];
  xAxisTitle: string;
  yAxisTitle: string;
  indicatorId: string;
  indicatorName: string;
}
export const PopulationPyramid = ({
  healthDataForAreas,
  xAxisTitle,
  yAxisTitle,
  indicatorId,
  indicatorName,
}: Readonly<PyramidPopulationChartViewProps>) => {
  if (
    !healthDataForAreas ||
    healthDataForAreas.length === 0 ||
    healthDataForAreas[0].indicatorSegments?.[0]?.healthData?.length !== 1 ||
    healthDataForAreas[0].indicatorSegments?.[0]?.reportingPeriod !==
      ReportingPeriod.Yearly ||
    healthDataForAreas[0].indicatorSegments?.[0]?.healthData[0]?.datePeriod
      ?.type !== PeriodType.Calendar
  )
    return;

  const searchState = useSearchStateParams();
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

  const popualtionData = createPyramidPopulationDataFrom(
    healthDataForAreas,
    groupSelected
  );
  if (!popualtionData) return;
  const { pyramidDataForAreas, pyramidDataForEngland, pyramidDataForGroup } =
    popualtionData;

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
  areasForPopulationData.push(...pyramidDataForAreas);
  if (pyramidDataForEngland) areasForPopulationData.push(pyramidDataForEngland);
  if (pyramidDataForGroup) areasForPopulationData.push(pyramidDataForGroup);

  const populationDataForSelectedArea = determinePopulationDataForArea(
    areasForPopulationData,
    availableAreas,
    populationAreaSelected
  );

  if (!populationDataForSelectedArea) return null;

  const benchmarkToUse =
    populationDataForSelectedArea.areaCode !== areaCodeForEngland
      ? pyramidDataForEngland
      : undefined;

  const groupToUse =
    populationDataForSelectedArea.areaCode !== areaCodeForEngland
      ? pyramidDataForGroup
      : undefined;

  // TODO: DHSCFT-1201 change to use Period
  const period = determineYear(healthDataForAreaSelected?.healthData ?? []);
  const title = determineHeaderTitle(
    healthDataForAreaSelected,
    areaTypeSelected,
    period
  );

  return (
    <div data-testid="populationPyramidWithTable-component">
      <StyleChartWrapper>
        <H3
          style={{ fontSize: '24px' }}
          id={ChartTitleKeysEnum.PopulationPyramid}
        >
          {chartTitleConfig[ChartTitleKeysEnum.PopulationPyramid].title}
        </H3>
        <ArrowExpander
          openTitle="Show population data"
          closeTitle="Hide population data"
        >
          <div>
            <ChartSelectArea
              availableAreas={availableAreas}
              chartAreaSelectedKey={SearchParams.PopulationAreaSelected}
            />
            <TabContainer
              id="pyramidChartAndTableView"
              items={[
                {
                  id: 'populationPyramidChart',
                  title: 'Population pyramid',
                  content: (
                    <PopulationPyramidChart
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

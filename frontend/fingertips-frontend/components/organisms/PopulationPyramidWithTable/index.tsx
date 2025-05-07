'use client';

import { HealthDataForArea } from '@/generated-sources/ft-api-client';
import { PopulationPyramid } from '@/components/organisms/PopulationPyramid';
import {
  createPyramidPopulationDataFrom,
  PopulationDataForArea,
} from '@/lib/chartHelpers/preparePopulationData';
import { TabContainer } from '@/components/layouts/tabContainer';
import { H3, H5 } from 'govuk-react';
import {
  determineHealthDataForArea,
  seriesDataWithoutGroup,
  sortHealthDataPointsByDescendingYear,
} from '@/lib/chartHelpers/chartHelpers';
import { SearchParams, SearchStateParams } from '@/lib/searchStateManager';
import { ArrowExpander } from '@/components/molecules/ArrowExpander';
import { PopulationPyramidChartTable } from '../PopulationPyramidChartTable';
import { ChartSelectArea } from '@/components/molecules/ChartSelectArea';
import { AreaWithoutAreaType } from '../Inequalities/inequalitiesHelpers';
import {
  allAreaTypes,
  HierarchyNameTypes,
} from '@/lib/areaFilterHelpers/areaType';
import { areaCodeForEngland } from '@/lib/chartHelpers/constants';

const determineHeaderTitle = (
  healthDataForAreaSelected?: HealthDataForArea,
  areaTypeSelected?: string
): string => {
  if (!healthDataForAreaSelected) return '';

  const hierarchyName = allAreaTypes.find(
    (areaType) => areaType.key === areaTypeSelected
  );

  const titleTypeText =
    hierarchyName?.hierarchyName === HierarchyNameTypes.NHS
      ? 'Registered'
      : 'Resident';

  const year = sortHealthDataPointsByDescendingYear(
    healthDataForAreaSelected.healthData
  )[0].year;

  return `${titleTypeText} population profile for ${healthDataForAreaSelected?.areaName} ${year}`;
};

export function determinePopulationDataForArea(
  populationDataForAllAreas: PopulationDataForArea[],
  areaToFind?: string
) {
  if (!areaToFind) return populationDataForAllAreas[0];

  return populationDataForAllAreas.find((data) => data.areaCode === areaToFind);
}

interface PyramidPopulationChartViewProps {
  healthDataForAreas: HealthDataForArea[];
  xAxisTitle: {male:string, female:string}
  yAxisTitle: string;
  searchState: SearchStateParams;
}
export const PopulationPyramidWithTable = ({
  healthDataForAreas,
  xAxisTitle,
  yAxisTitle,
  searchState,
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

  const title = determineHeaderTitle(
    healthDataForAreaSelected,
    areaTypeSelected
  );

  return (
    <div data-testid="populationPyramidWithTable-component">
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
          {populationDataForSelectedArea != undefined ? (
            <TabContainer
              id="pyramidChartAndTableView"
              items={[
                {
                  id: 'populationPyramidChart',
                  title: 'Population pyramid',
                  content: (
                    <>
                      <H5>{title}</H5>
                      <PopulationPyramid
                        dataForSelectedArea={populationDataForSelectedArea}
                        dataForGroup={groupToUse}
                        dataForBenchmark={benchmarkToUse}
                        xAxisTitle={xAxisTitle}
                        yAxisTitle={yAxisTitle}
                      />
                    </>
                  ),
                },
                {
                  id: 'populationPyramidTable',
                  title: 'Table',
                  content: (
                    <PopulationPyramidChartTable
                      healthDataForArea={populationDataForSelectedArea}
                      benchmarkData={benchmarkToUse}
                      groupData={groupToUse}
                    />
                  ),
                },
              ]}
            />
          ) : null}
        </div>
      </ArrowExpander>
    </div>
  );
};

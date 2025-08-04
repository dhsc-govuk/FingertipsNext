'use client';

import { HealthDataForArea } from '@/generated-sources/ft-api-client';
import { PopulationPyramidChart } from '@/components/charts/PopulationPyramid/PopulationPyramidChart/PopulationPyramidChart';
import {
  createPyramidPopulationData,
  PopulationDataForArea,
} from './helpers/preparePopulationData';
import { TabContainer } from '@/components/layouts/tabContainer';
import { H3, Paragraph } from 'govuk-react';
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
  const searchState = useSearchStateParams();
  if (!healthDataForAreas || healthDataForAreas.length === 0) return;
  const {
    [SearchParams.PopulationAreaSelected]: populationAreaSelected,
    [SearchParams.GroupSelected]: groupSelected,
    [SearchParams.AreaTypeSelected]: areaTypeSelected,
  } = searchState;

  const popualtionData = createPyramidPopulationData(
    healthDataForAreas,
    groupSelected
  );
  if (!popualtionData) return;
  const { pyramidDataForAreas, pyramidDataForEngland, pyramidDataForGroup } =
    popualtionData;

  const healthdataWithoutGroup = seriesDataWithoutGroup(
    healthDataForAreas,
    groupSelected,
    true
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
  if (pyramidDataForAreas) areasForPopulationData.push(...pyramidDataForAreas);
  if (pyramidDataForEngland) areasForPopulationData.push(pyramidDataForEngland);
  if (pyramidDataForGroup) areasForPopulationData.push(pyramidDataForGroup);

  const populationDataForSelectedArea = determinePopulationDataForArea(
    areasForPopulationData,
    availableAreas,
    populationAreaSelected
  );

  const populationDataForBenchmarkToUse =
    populationDataForSelectedArea?.areaCode !== areaCodeForEngland
      ? pyramidDataForEngland
      : undefined;

  const populationDataForGroupToUse =
    populationDataForSelectedArea?.areaCode !== areaCodeForEngland
      ? pyramidDataForGroup
      : undefined;

  if (
    !populationDataForSelectedArea &&
    !populationDataForGroupToUse &&
    populationDataForGroupToUse
  )
    return null;

  const healthDataForAreaSelected = determineHealthDataForArea(
    healthdataWithoutGroup,
    populationAreaSelected
  );
  // TODO: DHSCFT-1201 change to use Period
  // const period = determineYear(healthDataForAreaSelected?.healthData ?? []);
  const period =
    healthDataForAreaSelected?.indicatorSegments?.[0]?.healthData?.[0]?.year;

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
            {populationDataForSelectedArea ? (
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
                        dataForGroup={populationDataForGroupToUse}
                        dataForBenchmark={populationDataForBenchmarkToUse}
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
                        populationDataForArea={populationDataForSelectedArea}
                        populationDataForBenchmark={
                          populationDataForBenchmarkToUse
                        }
                        populationDataForGroup={populationDataForGroupToUse}
                        indicatorId={indicatorId}
                        indicatorName={indicatorName}
                        period={period ?? 2050}
                      />
                    ),
                  },
                ]}
              />
            ) : (
              <Paragraph>No population data for this area</Paragraph>
            )}
          </div>
        </ArrowExpander>
      </StyleChartWrapper>
    </div>
  );
};

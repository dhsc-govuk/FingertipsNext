'use client';

import { HealthDataForArea } from '@/generated-sources/ft-api-client';
import {
  SearchParams,
  SearchStateManager,
  SearchStateParams,
} from '@/lib/searchStateManager';
import { BarChart } from '@/components/organisms/BarChart';
import { PopulationPyramid } from '@/components/organisms/PopulationPyramid';
import { PopulationData } from '@/lib/chartHelpers/preparePopulationData';
import {
  isEnglandSoleSelectedArea,
  seriesDataWithoutEnglandOrGroup,
} from '@/lib/chartHelpers/chartHelpers';
import { ThematicMap } from '@/components/organisms/ThematicMap';
import { MapData } from '@/lib/thematicMapUtils/getMapData';
import { shouldDisplayInequalities } from '@/components/organisms/Inequalities/inequalitiesHelpers';
import { Inequalities } from '@/components/organisms/Inequalities';



type ChartProps = {
  healthIndicatorData: HealthDataForArea[][];
  mapData?: MapData;
  populationData?: PopulationData;
  searchState: SearchStateParams;
  measurementUnit?: string
};

export function Chart({
  healthIndicatorData,
  mapData,
  populationData,
  searchState,
  measurementUnit
}: Readonly<ChartProps>) {
  const stateManager = SearchStateManager.initialise(searchState);

  const {
    [SearchParams.IndicatorsSelected]: indicatorsSelected,
    [SearchParams.AreasSelected]: areasSelected,
    [SearchParams.GroupSelected]: selectedGroupCode,
  } = stateManager.getSearchState();

  const dataWithoutEngland = seriesDataWithoutEnglandOrGroup(
    healthIndicatorData[0],
    selectedGroupCode
  );



  return (
    <>
      {shouldDisplayInequalities(indicatorsSelected, areasSelected) && (
        <Inequalities
          healthIndicatorData={
            !isEnglandSoleSelectedArea(searchState[SearchParams.AreasSelected])
              ? dataWithoutEngland[0]
              : healthIndicatorData[0][0]
          }
          measurementUnit={measurementUnit}
        />
      )}
      <BarChart
        healthIndicatorData={healthIndicatorData[0]}
        yAxisTitle="Value"
        benchmarkLabel="England"
        benchmarkValue={800}
        accessibilityLabel="A bar chart showing healthcare data"
        measurementUnit={measurementUnit}
      />
      {populationData ? (
        <>
          <br />
          <PopulationPyramid
            healthIndicatorData={populationData}
            populationPyramidTitle="Population INDICATOR for SELECTED area"
            xAxisTitle="Age"
            yAxisTitle="Percentage of total population"
            accessibilityLabel="A pyramid chart showing population data for SELECTED AREA"
          />
        </>
      ) : null}
      {healthIndicatorData.length === 1 && mapData ? (
        <>
          <ThematicMap
            healthIndicatorData={healthIndicatorData[0]}
            mapData={mapData}
            mapTitle="Compare indicator data within the area group"
          />
          <br />
        </>
      ) : null}
    </>
  );
}

'use client';

import { HealthDataForArea } from '@/generated-sources/ft-api-client';
import {
  SearchParams,
  SearchStateManager,
  SearchStateParams,
} from '@/lib/searchStateManager';
import { PopulationPyramid } from '@/components/organisms/PopulationPyramid';
import { PopulationData } from '@/lib/chartHelpers/preparePopulationData';
import {
  isEnglandSoleSelectedArea,
  seriesDataWithoutEnglandOrGroup,
} from '@/lib/chartHelpers/chartHelpers';
import { shouldDisplayInequalities } from '@/components/organisms/Inequalities/inequalitiesHelpers';
import { Inequalities } from '@/components/organisms/Inequalities';

type ChartProps = {
  healthIndicatorData: HealthDataForArea[][];
  populationData?: PopulationData;
  searchState: SearchStateParams;
  measurementUnit?: string;
};

export function Chart({
  healthIndicatorData,
  populationData,
  searchState,
  measurementUnit,
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
          searchState={searchState}
          measurementUnit={measurementUnit}
        />
      )}
      {populationData ? (
        <>
          <br />
          <PopulationPyramid
            healthIndicatorData={populationData}
            populationPyramidTitle="Related population data"
            xAxisTitle="Age"
            yAxisTitle="Percentage of total population"
            accessibilityLabel="A pyramid chart showing population data for SELECTED AREA"
          />
        </>
      ) : null}
    </>
  );
}

import { HealthDataForArea } from '@/generated-sources/ft-api-client';
import {
  areaCodeForEngland,
  indicatorIdForPopulation,
} from '../chartHelpers/constants';
import { PopulationData } from '../chartHelpers/preparePopulationData';
import { connection } from 'next/server';
import { ApiClientFactory } from '../apiClient/apiClientFactory';
import {
  SearchParams,
  SearchStateManager,
  SearchStateParams,
} from '../searchStateManager';

export interface IViewProps {
  areaCodes: string[];
  indicatorsSelected: string[];
}

export interface ViewsSkeletonProps {
  areaCodes?: string[];
  indicatorsSelected: string[];
  searchState: SearchStateParams;
}

export type chartOptions =
  | 'lineChart'
  | 'barChart'
  | 'inequalities'
  | 'populationPyramid'
  | 'thematicMap'
  | 'spineChart'
  | 'heatMap'
  | 'basicTable';

export type chartViews =
  | 'oneAreaView'
  | 'twoAreasView'
  | 'threeOrMoreAreasView'
  | 'englandView';
// All areas in group pending DHSCFT-252

export function viewSelector(areaCodes: string[]): chartViews {
  if (areaCodes.length === 1) {
    if (areaCodes[0] === areaCodeForEngland) {
      return 'englandView';
    }
    return 'oneAreaView';
  } else if (areaCodes.length === 2) {
    return 'twoAreasView';
  }
  return 'threeOrMoreAreasView';
}

export function getChartListForView(
  indicatorsSelected: string[],
  viewSelected: chartViews
) {
  switch (viewSelected) {
    case 'oneAreaView':
      return getOneAreaViewChartList(indicatorsSelected);
    case 'twoAreasView':
      return getTwoAreaViewChartList(indicatorsSelected);
    case 'threeOrMoreAreasView':
      return getThreeOrMoreAreaViewChartList(indicatorsSelected);
    case 'englandView':
      return getEnglandViewChartList(indicatorsSelected);
    default:
      break;
  }
}

function getOneAreaViewChartList(indicatorsSelected: string[]): chartOptions[] {
  const chartList: chartOptions[] = ['populationPyramid'];
  if (indicatorsSelected.length === 1) {
    chartList.push('lineChart', 'barChart', 'inequalities');
  } else {
    chartList.push('spineChart');
  }
  return chartList;
}

function getTwoAreaViewChartList(indicatorsSelected: string[]): chartOptions[] {
  const chartList: chartOptions[] = ['populationPyramid'];

  if (indicatorsSelected.length === 1) {
    chartList.push('lineChart', 'barChart');
  } else {
    chartList.push('spineChart', 'heatMap');
  }
  return chartList;
}

function getThreeOrMoreAreaViewChartList(
  indicatorsSelected: string[]
): chartOptions[] {
  const chartList: chartOptions[] = ['populationPyramid'];

  if (indicatorsSelected.length === 1) {
    chartList.push('barChart');
  } else {
    chartList.push('heatMap');
  }
  return chartList;
}

function getEnglandViewChartList(indicatorsSelected: string[]): chartOptions[] {
  const chartList: chartOptions[] = ['populationPyramid'];

  if (indicatorsSelected.length === 1) {
    chartList.push('lineChart', 'inequalities');
  } else {
    chartList.push('basicTable');
  }
  return chartList;
}

interface IGetHealthDataForView {
  chartList: chartOptions[];
  searchState: SearchStateParams;
}

interface CominedHealthData {
  healthIndicatorDataForAreas?: HealthDataForArea[];
  healthIndicatorDataForEngland?: HealthDataForArea;
  healthIndicatorDataForGroup?: HealthDataForArea;
  populationDataForArea?: PopulationData;
}
export async function getHealthDataForView({
  chartList,
  searchState,
}: IGetHealthDataForView): Promise<void | CominedHealthData> {
  const stateManager = SearchStateManager.initialise(searchState);
  const {
    [SearchParams.IndicatorsSelected]: indicators,
    [SearchParams.AreasSelected]: areaCodes,
    [SearchParams.GroupSelected]: selectedGroupCode,
  } = stateManager.getSearchState();

  const areasSelected = areaCodes ?? [];
  const indicatorsSelected = indicators ?? [];

  await connection();
  const indicatorApi = ApiClientFactory.getIndicatorsApiClient();

  const areaCodesToRequest =
    selectedGroupCode && selectedGroupCode != areaCodeForEngland
      ? [...areasSelected, areaCodeForEngland, selectedGroupCode]
      : [...areasSelected, areaCodeForEngland];

  const indicatorsToRequest = chartList.includes('populationPyramid')
    ? [...indicatorsSelected, indicatorIdForPopulation]
    : indicatorsSelected;

  console.log('fetching data for: ', chartList.toString());
  console.log('for areas: ', areaCodesToRequest.toString());
  console.log('for indicators: ', indicatorsToRequest.toString());

  // build a promise array for what is to be fetched:
  // for each indicator
  // health data for areas (? with inequalities)
  // health data for England
  // health data for group
  // population data for area

  // await promise.all on that array

  // let healthDataPromises: Promise<HealthDataForArea[][]> = [];

  // try {
  //   const healthIndicatorData = await Promise.all(healthDataPromises);
  // } catch {}
}

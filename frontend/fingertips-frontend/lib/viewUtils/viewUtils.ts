import { areaCodeForEngland } from '../chartHelpers/constants';

export interface IViewProps {
  areaCodes: string[];
  indicatorsSelected: string[];
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

type chartViews =
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

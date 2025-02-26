import { areaCodeForEngland } from './chartHelpers/constants';

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

const chartViewsEncoder: Record<number, string> = {
  1: 'oneAreaView',
  2: 'twoAreasView',
  3: 'threeOrMoreAreasView',
  10: 'englandView',
  // All areas in group pending DHSCFT-252
};

export function selectChartView(areaCodes: string[]): string {
  if (areaCodes.length === 1 && areaCodes[0] === areaCodeForEngland) {
    return chartViewsEncoder[10];
  }
  return areaCodes.length > 2
    ? chartViewsEncoder[3]
    : chartViewsEncoder[areaCodes.length];
}

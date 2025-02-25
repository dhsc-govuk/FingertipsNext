const chartViewsEncoder: Record<number, string> = {
  1: 'oneAreaView',
  2: 'twoAreasView',
  3: 'threeOrMoreAreasView',
  // TODO: All areas in group
  // TODO: areaType England / default
};

export function selectChartView(areaCodes: string[]): string {
  return areaCodes.length > 2
    ? chartViewsEncoder[3]
    : chartViewsEncoder[areaCodes.length];
}

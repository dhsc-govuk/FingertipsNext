import { HealthDataPoint } from '@/generated-sources/ft-api-client';
import { GovukColours } from '../styleHelpers/colours';

export type ChartColours = GovukColours | UniqueChartColours;

export enum UniqueChartColours {
  ChartDarkBlue = '#12436D',
  OtherLightBlue = '#57AEF8',
}

// The ordering of this array determines the order in which the colours are
// used by Highcharts, so it should be preserved.
export const chartColours: ChartColours[] = [
  GovukColours.Orange,
  GovukColours.LightPurple,
  GovukColours.DarkPink,
  GovukColours.Green,
  GovukColours.Pink,
  GovukColours.Purple,
  GovukColours.Yellow,
  GovukColours.Red,
  GovukColours.Blue,
  GovukColours.LightPink,
  GovukColours.Brown,
  UniqueChartColours.ChartDarkBlue,
  GovukColours.LightBlue,
  GovukColours.OtherLightPurple,
];

export const getLatestYear = (
  points: HealthDataPoint[] | undefined
): number | undefined => {
  if (!points || points.length < 1) return undefined;

  const year = points.reduce((previous, point) => {
    return Math.max(previous, point.year);
  }, points[0].year);
  return year;
};

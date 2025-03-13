import { GovukColours } from '../styleHelpers/colours';

export type ChartColours = GovukColours | uniqueChartColours;

enum uniqueChartColours {
  ChartDarkBlue = '#12436D',
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
  GovukColours.LightBlue,
  uniqueChartColours.ChartDarkBlue,
  GovukColours.OtherLightPurple,
];

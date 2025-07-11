import { ChartTitlesEnum } from "./chartTitleEnums";

type ChartLinksKeyType = {
  key: string;
  href: string;
  title: ChartTitlesEnum;
}[]

export const chartLinks: ChartLinksKeyType = [
  { key: 'line-chart', href: '#line-chart', title: ChartTitlesEnum.LineChart },
  { key: 'bar-chart-embedded-table-chart', href: '#bar-chart-embedded-table-chart', title: ChartTitlesEnum.BarChartEmbeddedTable },
  { key: 'heatmap-chart', href: '#heatmap-chart', title: ChartTitlesEnum.Heatmap },
  { key: 'spine-chart', href: '#spine-chart', title: ChartTitlesEnum.SpineChart },
  { key: 'inequalities-bar-chart', href: '#inequalities-bar-chart', title: ChartTitlesEnum.InequalitiesBarChart },
  { key: 'inequalities-line-chart', href: '#inequalities-line-chart', title: ChartTitlesEnum.InequalitiesLineChart },
  { key: 'thematic-map-chart', href: '#thematic-map-chart', title: ChartTitlesEnum.ThematicMap },
  { key: 'population-pyramid-chart', href: '#population-pyramid-chart', title: ChartTitlesEnum.PopulationPyramid },
]
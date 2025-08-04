export enum ChartTitleKeysEnum {
  LineChart = 'line-chart',
  BarChartEmbeddedTable = 'bar-chart-embedded-table-chart',
  SingleIndicatorHeatmap = 'single-indicator-heatmap-chart',
  Heatmap = 'heatmap-chart',
  SingleIndicatorSpineChart = 'single-indicator-spine-chart',
  SpineChart = 'spine-chart',
  InequalitiesBarChart = 'inequalities-bar-chart',
  InequalitiesLineChart = 'inequalities-line-chart',
  InequalitiesCharts = 'inequalities-charts',
  ThematicMap = 'thematic-map-chart',
  PopulationPyramid = 'population-pyramid-chart',
  BasicTableChart = 'basic-table-chart',
}

export type ChartTitleConfigType = Record<
  ChartTitleKeysEnum,
  {
    title: string;
    subTitle?: string;
    href: string;
  }
>;

export const chartTitleConfig: ChartTitleConfigType = {
  [ChartTitleKeysEnum.LineChart]: {
    title: 'Indicator trends over time',
    href: '#line-chart',
  },
  [ChartTitleKeysEnum.BarChartEmbeddedTable]: {
    title: 'Compare areas for one time period',
    href: '#bar-chart-embedded-table-chart',
  },
  [ChartTitleKeysEnum.SingleIndicatorHeatmap]: {
    title: 'Indicator segmentations overview',
    subTitle: 'Segmentation overview of selected indicator',
    href: '#heatmap-chart',
  },
  [ChartTitleKeysEnum.Heatmap]: {
    title: 'Overview of indicators and areas',
    subTitle: 'Overview of selected indicators',
    href: '#heatmap-chart',
  },
  [ChartTitleKeysEnum.SingleIndicatorSpineChart]: {
    title: 'Indicator segmentations overview',
    href: '#spine-chart',
  },
  [ChartTitleKeysEnum.SpineChart]: {
    title: 'Area profile by indicators',
    href: '#spine-chart',
  },
  [ChartTitleKeysEnum.InequalitiesBarChart]: {
    title: 'Inequalities comparison for one time period',
    href: '#inequalities-bar-chart',
  },
  [ChartTitleKeysEnum.InequalitiesLineChart]: {
    title: 'Inequalities trends over time',
    href: '#inequalities-line-chart',
  },
  [ChartTitleKeysEnum.InequalitiesCharts] :{
    title: 'Related inequalities data',
    href: '#inequalities-component',
  },
  [ChartTitleKeysEnum.ThematicMap]: {
    title: 'Compare an indicator by areas',
    href: '#thematic-map-chart',
  },
  [ChartTitleKeysEnum.PopulationPyramid]: {
    title: 'Related population data',
    href: '#population-pyramid-chart',
  },
  [ChartTitleKeysEnum.BasicTableChart]: {
    title: 'Compare indicators for an area',
    href: '#basic-table',
    subTitle: 'Overview of selected indicators',
  },
};

export enum ChartTitlesEnum {
  LineChart = 'Indicator trends over time',
  BarChartEmbeddedTable = 'Compare areas for one time period',
  Heatmap = 'Overview of indicators and areas',
  SpineChart = 'Area profile by indicators',
  InequalitiesBarChart = 'Inequalities comparison for one time period',
  InequalitiesLineChart = 'Inequalities trends over time',
  ThematicMap = 'Compare an indicator by areas',
  PopulationPyramid = 'Related population data',
  BasicTableChart = 'Compare indicators for an area',
}

export enum ChartTitleKeysEnum {
  LineChart = 'line-chart',
  BarChartEmbeddedTable = 'bar-chart-embedded-table-chart',
  Heatmap = 'heatmap-chart',
  SpineChart = 'spine-chart',
  InequalitiesBarChart = 'inequalities-bar-chart',
  InequalitiesLineChart = 'inequalities-line-chart',
  ThematicMap = 'thematic-map-chart',
  PopulationPyramid = 'population-pyramid-chart',
  BasicTableChart = 'basic-table-chart',
}

export type ChartTitleConfigType = {
  [key in ChartTitleKeysEnum]: {
    title: string;
    href: string;
  };
}

export const chartTitleConfig: ChartTitleConfigType = {
  [ChartTitleKeysEnum.LineChart]: {
    title: 'Indicator trends over time',
    href: '#line-chart',
  },
  [ChartTitleKeysEnum.BarChartEmbeddedTable]: { title: 'Compare areas for one time period', href: '#bar-chart-embedded-table-chart' },
  [ChartTitleKeysEnum.Heatmap]: { title: 'Overview of indicators and areas', href: '#heatmap-chart' },
  [ChartTitleKeysEnum.SpineChart]: { title: 'Area profile by indicators', href: '#spine-chart' },
  [ChartTitleKeysEnum.InequalitiesBarChart]: { title: 'Inequalities comparison for one time period', href: '#inequalities-bar-chart' },
  [ChartTitleKeysEnum.InequalitiesLineChart]: { title: 'Inequalities trends over time', href: '#inequalities-line-chart' },
  [ChartTitleKeysEnum.ThematicMap]: { title: 'Compare an indicator by areas', href: '#thematic-map-chart' },
  [ChartTitleKeysEnum.PopulationPyramid]: { title: 'Related population data', href: '#population-pyramid-chart' },
  [ChartTitleKeysEnum.BasicTableChart]: { title: 'Compare indicators for an area', href: '#basic-table-chart' },
}
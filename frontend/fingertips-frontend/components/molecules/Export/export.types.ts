export enum ExportType {
  PNG = 'png',
  SVG = 'svg',
  CSV = 'csv',
}

export interface ExportDownload {
  canvas?: HTMLCanvasElement;
  svg?: string;
}

export enum CsvHeader {
  IndicatorId = 'Indicator Id',
  IndicatorName = 'Indicator name',
  Period = 'Period',
  Area = 'Area',
  AreaCode = 'Area code',
  Benchmark = 'Benchmark',
  BenchmarkComparison = 'Compared to benchmark',
  RecentTrend = 'Recent trend',
  Count = 'Count',
  ValueUnit = 'Value unit',
  Value = 'Value',
  LowerCI = 'Lower confidence limit X%',
  UpperCI = 'Upper confidence limit X%',
}

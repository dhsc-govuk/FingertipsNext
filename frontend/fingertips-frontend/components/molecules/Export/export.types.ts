export enum ExportType {
  PNG = 'png',
  SVG = 'svg',
  CSV = 'csv',
}

export interface ExportDownload {
  canvas?: HTMLCanvasElement;
  svg?: string;
}

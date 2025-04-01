// any required to allow customisation of Highcharts tooltips
/* eslint-disable @typescript-eslint/no-explicit-any */

import Highcharts from 'highcharts';

export enum SymbolNames {
  Circle = 'circle',
  Square = 'square',
  Diamond = 'diamond',
  Triangle = 'triangle',
  TriangleDown = 'triangle-down',
  PlotLine = 'plot-line',
  MultiplicationX = 'multiplicationX',
}

export enum SymbolsEnum {
  Circle = '\u25CF',
  Square = '\u25a0',
  Diamond = '\u25c6',
  Triangle = '\u25b2',
  TriangleDown = '\u25bC',
  PlotLine = '\ufe31',
  MultiplicationX = '\u2715',
}

const SymbolMapping: Record<string, string> = {
  [SymbolNames.Circle]: SymbolsEnum.Circle,
  [SymbolNames.Square]: SymbolsEnum.Square,
  [SymbolNames.Diamond]: SymbolsEnum.Diamond,
  [SymbolNames.Triangle]: SymbolsEnum.Triangle,
  [SymbolNames.TriangleDown]: SymbolsEnum.TriangleDown,
  [SymbolNames.PlotLine]: SymbolsEnum.PlotLine,
  [SymbolNames.MultiplicationX]: SymbolsEnum.MultiplicationX,
};

export const pointFormatterHelper = (
  point: Highcharts.Point,
  generateTooltipForPoint: (point: Highcharts.Point, symbol: string) => string[]
) => {
  const symbol =
    SymbolMapping[(point.graphic as any)?.symbolName] ?? SymbolsEnum.Circle;

  const tooltipPointString = generateTooltipForPoint(point, symbol).join('');

  return tooltipPointString;
};

// any required to allow customisation of Highcharts tooltips
/* eslint-disable @typescript-eslint/no-explicit-any */

export enum SymbolsEnum {
  Circle = '\u25CF',
  Square = '\u25a0',
  Diamond = '\u25c6',
  Triangle = '\u25b2',
  TriangleDown = '\u25bC',
}

export const symbolEncoder: Record<string, string> = {
  'circle': SymbolsEnum.Circle,
  'square': SymbolsEnum.Square,
  'diamond': SymbolsEnum.Diamond,
  'triangle': SymbolsEnum.Triangle,
  'triangle-down': SymbolsEnum.TriangleDown,
};

export const pointFormatterHelper = (
  point: any,
  generateTooltipList: (point: any, symbol?: string) => string[]
) => {
  const symbol = symbolEncoder[point.graphic.symbolName] ?? SymbolsEnum.Circle;

  const tooltipPointString = generateTooltipList(point, symbol).join('');

  return tooltipPointString;
};

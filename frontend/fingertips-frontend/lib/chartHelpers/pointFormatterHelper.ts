enum SymbolsEnum {
  Circle = '\u25CF',
  Square = '\u25a0',
  Diamond = '\u25c6',
  Triangle = '\u25b2',
  TriangleDown = '\u25bC',
}

const symbolEncoder: Record<string, string> = {
  'circle': SymbolsEnum.Circle,
  'square': SymbolsEnum.Square,
  'diamond': SymbolsEnum.Diamond,
  'triangle': SymbolsEnum.Triangle,
  'triangle-down': SymbolsEnum.TriangleDown,
};

// any required to allow customisation of Highcharts tooltips
// eslint-disable-next-line @typescript-eslint/no-explicit-any
export const pointFormatterHelper = (point: any) => {
  const symbol = symbolEncoder[point.graphic.symbolName] ?? SymbolsEnum.Circle;

  const tooltipPointString = [
    `<span style="color:${point.series.color}">${symbol}</span>`,
    `<span> Value ${Math.abs(point.y)}%<br/>${point.series.name}</span>`,
  ].join('');

  return tooltipPointString;
};

import {pointFormatterHelper, SymbolsEnum} from './pointFormatterHelper';
import Highcharts from "highcharts";

const mockPoint = {
  graphic: {
    symbolName: '',
    color: 'null',
  },
  y: 1,
  series: {
    name: '',
  },
};

const mockGenerateTooltipList = jest
  .fn()
  .mockImplementation((point: typeof mockPoint, symbol: string) => [
    symbol,
    point.series.name,
  ]);

describe('pointFormatterHelper', () => {
  it('should return a string with the default symbol code for circle when symbolName is empty string', () => {
    const actual = pointFormatterHelper(mockPoint as unknown as Highcharts.Point, mockGenerateTooltipList);
    expect(actual).toContain(SymbolsEnum.Circle);
    expect(mockGenerateTooltipList).toHaveBeenCalledWith(mockPoint, SymbolsEnum.Circle);
  });

  it.each([
    ['circle', SymbolsEnum.Circle],
    ['square', SymbolsEnum.Square],
    ['diamond', SymbolsEnum.Diamond],
    ['triangle', SymbolsEnum.Triangle],
    ['triangle-down', SymbolsEnum.TriangleDown],
  ])(
    'should return a string with the correct symbol code',
    (symbolName, symbolCode) => {
      mockPoint.graphic.symbolName = symbolName;
      const actual = pointFormatterHelper(mockPoint as unknown as Highcharts.Point, mockGenerateTooltipList);
      expect(actual).toContain(symbolCode);
      expect(mockGenerateTooltipList).toHaveBeenCalledWith(
        mockPoint,
        symbolCode
      );
    }
  );
});

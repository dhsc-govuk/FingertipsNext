import { generatePopPyramidTooltipStringList } from '@/components/organisms/PopulationPyramid';
import { pointFormatterHelper } from './pointFormatterHelper';

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

describe('pointFormatterHelper', () => {
  it('should return a string with the default symbol code for circle when symbolName is empty string', () => {
    const actual = pointFormatterHelper(
      mockPoint,
      generatePopPyramidTooltipStringList
    );
    expect(actual).toContain('\u25CF');
  });

  it.each([
    ['circle', '\u25CF'],
    ['square', '\u25a0'],
    ['diamond', '\u25c6'],
    ['triangle', '\u25b2'],
    ['triangle-down', '\u25bC'],
  ])(
    'should return a string with the correct symbol code',
    (symbolName, symbolCode) => {
      mockPoint.graphic.symbolName = symbolName;
      const actual = pointFormatterHelper(
        mockPoint,
        generatePopPyramidTooltipStringList
      );
      expect(actual).toContain(symbolCode);
    }
  );
});

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
    const actual = pointFormatterHelper(mockPoint);
    expect(actual).toContain('\u25CF');
  });

  it('should return a string with the correct symbol code', () => {
    const symbolNames = [
      'circle',
      'square',
      'diamond',
      'triangle',
      'triangle-down',
    ];

    const symbolCodes = ['\u25CF', '\u25a0', '\u25c6', '\u25b2', '\u25bC'];

    symbolNames.forEach((name, i) => {
      mockPoint.graphic.symbolName = name;
      const actual = pointFormatterHelper(mockPoint);
      expect(actual).toContain(symbolCodes[i]);
    });
  });
});

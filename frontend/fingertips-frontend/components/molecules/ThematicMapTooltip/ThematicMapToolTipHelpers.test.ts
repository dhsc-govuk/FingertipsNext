import {
  BenchmarkComparisonMethod,
  BenchmarkOutcome,
} from '@/generated-sources/ft-api-client';
import {
  getAreaTitle,
  getBenchmarkSymbol,
  getComparisonString,
  getValueString as getValueText,
  TooltipType,
} from './ThematicMapTooltipHelpers';
import { SymbolsEnum } from '@/lib/chartHelpers/pointFormatterHelper';

describe('getAreaTitle', () => {
  it.each([
    ['area', 'Test Area'],
    ['comparator', 'Group: Test Area'],
    ['comparator', 'England', 'England'],
    ['benchmark', 'Benchmark: Test Area'],
  ] as [TooltipType, string, string][])(
    'should return the correct area title for a given tooltip type',
    (tooltipType: TooltipType, expectedTitle, stubAreaName = 'Test Area') => {
      const result = getAreaTitle(stubAreaName, tooltipType);
      expect(result).toBe(expectedTitle);
    }
  );
});

describe('getComparisonString', () => {
  it('should return undefined for a benchmark', () => {
    const result = getComparisonString(
      'CIOverlappingReferenceValue95',
      'Best',
      'benchmark',
      'test area'
    );

    expect(result).toBeUndefined();
  });
  it.each([
    [
      BenchmarkOutcome.NotCompared,
      'Not compared',
      BenchmarkComparisonMethod.CIOverlappingReferenceValue95,
    ],
    [
      BenchmarkOutcome.Better,
      'than ',
      BenchmarkComparisonMethod.CIOverlappingReferenceValue99_8,
      '(99.8%)',
    ],
    [BenchmarkOutcome.Similar, 'to '],
    [BenchmarkOutcome.Worse, 'than '],
    [BenchmarkOutcome.Lower, 'than '],
    [BenchmarkOutcome.Higher, 'than '],
    [undefined, ''],
  ])(
    'should return the correct comparison string for RAG, with confidence limit',
    (
      stubBenchmarkOutcome: BenchmarkOutcome | undefined,
      expectedString: string,
      stubBenchmarkComparisonMethod: BenchmarkComparisonMethod = BenchmarkComparisonMethod.CIOverlappingReferenceValue95,
      expectedConfidenceLimit: string = '(95%)'
    ) => {
      const stubBenchmarkAreaName = 'Test Area';

      const result = getComparisonString(
        stubBenchmarkComparisonMethod,
        stubBenchmarkOutcome,
        'area',
        stubBenchmarkAreaName
      );
      if (
        stubBenchmarkOutcome &&
        stubBenchmarkOutcome !== BenchmarkOutcome.NotCompared
      ) {
        expect(result).toContain(stubBenchmarkAreaName);
        expect(result).toContain(expectedConfidenceLimit);
      }
      expect(result).toContain(expectedString);
    }
  );

  it.each([
    [
      BenchmarkOutcome.NotCompared,
      // SymbolsEnum.WhiteCircle
    ],
    [BenchmarkOutcome.Lowest],
    [BenchmarkOutcome.Low],
    [BenchmarkOutcome.Middle],
    [BenchmarkOutcome.High],
    [BenchmarkOutcome.Highest],
    [BenchmarkOutcome.Best],
    [BenchmarkOutcome.Worst],
  ])(
    'should return the correct comparison string for Quintiles',
    (stubBenchmarkOutcome: BenchmarkOutcome) => {
      const stubBenchmarkComparisonMethod = BenchmarkComparisonMethod.Quintiles;
      const stubBenchmarkAreaName = 'Test Area';

      const result = getComparisonString(
        stubBenchmarkComparisonMethod,
        stubBenchmarkOutcome,
        'area',
        stubBenchmarkAreaName
      );

      expect(result).toContain(' quintile');
    }
  );
});

describe('getValueText', () => {
  it.each([
    [10, '10.0 Mpa', 'Mpa'],
    [undefined, 'No data available', undefined],
    [10, '10.0', undefined],
    [BenchmarkOutcome.Better, 'Better', undefined],
    [BenchmarkOutcome.NotCompared, 'Not compared', undefined],
  ])(
    'should return the expected value string',
    (
      value: number | BenchmarkOutcome | undefined,
      expected: string,
      measurementUnit: string | undefined
    ) => {
      const result = getValueText(value, measurementUnit);

      expect(result).toEqual(expected);
    }
  );
});

describe('getBenchmarSymbol', () => {
  it.each([
    BenchmarkComparisonMethod.CIOverlappingReferenceValue95,
    BenchmarkComparisonMethod.CIOverlappingReferenceValue99_8,
  ])('should return a filled circle for rag', (stubMethod) => {
    const result = getBenchmarkSymbol('Best', stubMethod);
    expect(result).toBe(SymbolsEnum.Circle);
  });

  it('should return a filled diamond for quintiles', () => {
    const result = getBenchmarkSymbol('Best', 'Quintiles');
    expect(result).toBe(SymbolsEnum.Diamond);
  });

  it('should return X if benchmark outcome is undefined', () => {
    const result = getBenchmarkSymbol(
      undefined,
      'CIOverlappingReferenceValue95'
    );
    expect(result).toBe(SymbolsEnum.MultiplicationX);
  });

  it('should return a white circle if the comparison method is unknown', () => {
    const result = getBenchmarkSymbol('Best', 'Unknown');
    expect(result).toBe(SymbolsEnum.WhiteCircle);
  });

  it('should return a white circle if the outcome is not compared', () => {
    const result = getBenchmarkSymbol('Best', 'Unknown');
    expect(result).toBe(SymbolsEnum.WhiteCircle);
  });
});

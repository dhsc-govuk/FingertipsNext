import {
  BenchmarkComparisonMethod,
  BenchmarkOutcome,
} from '@/generated-sources/ft-api-client';
import { getAreaTitle, getComparisonString } from './ThematicMapTooltipHelpers';

describe('getAreaTitle', () => {
  it.each([
    ['area', 'Test Area'],
    ['group', 'Group: Test Area'],
    ['group', 'England', 'England'],
    ['benchmark', 'Benchmark: Test Area'],
  ])(
    'should return the correct area title for a given tooltip type',
    (tooltipType, expectedTitle, stubAreaName = 'Test Area') => {
      const result = getAreaTitle(
        stubAreaName,
        tooltipType as 'area' | 'group' | 'benchmark'
      );
      expect(result).toBe(expectedTitle);
    }
  );
});

describe('getComparisonString', () => {
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
    [undefined, 'No data available'],
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
    'should return the correct comparison string for Quntiles',
    (stubBenchmarkOutcome: BenchmarkOutcome) => {
      const stubBenchmarkComparisonMethod = BenchmarkComparisonMethod.Quintiles;
      const stubBenchmarkAreaName = 'Test Area';

      const result = getComparisonString(
        stubBenchmarkComparisonMethod,
        stubBenchmarkOutcome,
        stubBenchmarkAreaName
      );

      expect(result).toContain(' quintile');
    }
  );
});

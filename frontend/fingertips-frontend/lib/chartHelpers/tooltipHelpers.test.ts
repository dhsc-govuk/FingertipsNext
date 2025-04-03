import { generateThematicMapTooltipString } from '@/components/organisms/ThematicMap/thematicMapHelpers';
import {
  BenchmarkComparisonMethod,
  BenchmarkOutcome,
  HealthDataPoint,
  IndicatorPolarity,
} from '@/generated-sources/ft-api-client';
import { generateBenchmarkTooltipForArea } from './tooltipHelpers';
import { symbolEncoder } from './pointFormatterHelper';
import { getBenchmarkColour, getConfidenceLimitNumber } from './chartHelpers';

const mockThematicMapPointRAG = {
  areaName: 'mockarea',
  year: 2004,
  benchmarkComparisonOutcome: BenchmarkOutcome.Better,
  value: 10,
};

const mockUnits = 'Mpa';
const mockBenchmarkArea = 'England';

describe(generateBenchmarkTooltipForArea, () => {
  it.each([
    [
      BenchmarkOutcome.NotCompared,
      BenchmarkComparisonMethod.CIOverlappingReferenceValue95,
      symbolEncoder.multiplicationX,
      '',
    ],
    [
      BenchmarkOutcome.Better,
      BenchmarkComparisonMethod.CIOverlappingReferenceValue95,
      symbolEncoder.circle,
      `than ${mockBenchmarkArea}`,
    ],
    [
      BenchmarkOutcome.Similar,
      BenchmarkComparisonMethod.CIOverlappingReferenceValue95,
      symbolEncoder.circle,
      `to ${mockBenchmarkArea}`,
    ],
    [
      BenchmarkOutcome.Worse,
      BenchmarkComparisonMethod.CIOverlappingReferenceValue95,
      symbolEncoder.circle,
      `than ${mockBenchmarkArea}`,
    ],
    [
      BenchmarkOutcome.Lower,
      BenchmarkComparisonMethod.CIOverlappingReferenceValue95,
      symbolEncoder.circle,
      `than ${mockBenchmarkArea}`,
    ],
    [
      BenchmarkOutcome.Higher,
      BenchmarkComparisonMethod.CIOverlappingReferenceValue95,
      symbolEncoder.circle,
      `than ${mockBenchmarkArea}`,
    ],
  ])(
    'should return the expected RAG tooltip for an area',
    (
      testBenchmarkOutcome: BenchmarkOutcome,
      testBenchmarkComparisonMethod: BenchmarkComparisonMethod,
      expectedSymbol: string,
      expectedComparisonString: string
    ) => {
      const mockPoint = {
        ...mockThematicMapPointRAG,
        benchmarkComparisonOutcome: testBenchmarkOutcome,
      };

      const testPolarity: IndicatorPolarity = IndicatorPolarity.Unknown;

      const actual = generateThematicMapTooltipString(
        mockPoint,
        undefined,
        undefined,
        testBenchmarkComparisonMethod,
        testPolarity,
        mockUnits
      );

      console.log(actual);

      const expectedColour =
        getBenchmarkColour(
          testBenchmarkComparisonMethod,
          mockPoint.benchmarkComparisonOutcome,
          testPolarity
        ) ?? '';

      expect(actual).toEqual(expect.stringContaining(mockPoint.areaName));
      expect(actual).toEqual(
        expect.stringContaining(mockPoint.year.toString())
      );
      expect(actual).toEqual(expect.stringContaining(expectedColour));
      expect(actual).toEqual(expect.stringContaining(expectedSymbol));
      expect(actual).toEqual(
        expect.stringContaining(
          [mockPoint.value.toString(), mockUnits].join(' ')
        )
      );
      expect(actual).toEqual(
        expect.stringContaining(
          [testBenchmarkOutcome, expectedComparisonString].join(' ')
        )
      );
      expect(actual).toEqual(
        expect.stringContaining(
          getConfidenceLimitNumber(testBenchmarkComparisonMethod).toString()
        )
      );
    }
  );

  //   each([
  //     [BenchmarkOutcome.Lowest],
  //     [BenchmarkOutcome.Low],
  //     [BenchmarkOutcome.Middle],
  //     [BenchmarkOutcome.High],
  //     [BenchmarkOutcome.Highest],
  //     [BenchmarkOutcome.Best],
  //     [BenchmarkOutcome.Worst],
  // ]
  //   )
  it.todo(
    'should return the expected RAG tooltip for an area when outcome is similar'
  );
});

import { generateThematicMapTooltipString } from '@/components/organisms/ThematicMap/thematicMapHelpers';
import {
  BenchmarkComparisonMethod,
  BenchmarkOutcome,
  IndicatorPolarity,
} from '@/generated-sources/ft-api-client';
import { generateBenchmarkTooltipForArea } from './tooltipHelpers';
import { GovukColours } from '../styleHelpers/colours';
import { symbolEncoder } from './pointFormatterHelper';

const mockHcPointRAG = {
  areaName: 'area',
  year: 2004,
  benchmarkComparisonOutcome: BenchmarkOutcome.Better,
  value: 10,
};

const expectedAreaTooltip =
  `<br /><span style="font-weight: bold">${mockHcPointRAG.areaName}</span>` +
  `<br /><span>${mockHcPointRAG.year}</span>` +
  `<br /><span style="color: ${GovukColours.Green}; font-size: large;">${symbolEncoder.circle}</span>` +
  `<span>${mockHcPointRAG.value} mock units</span>` +
  `<br /><span>${mockHcPointRAG.benchmarkComparisonOutcome} than England</span><br /><span>(95%)</span>`;

describe(generateBenchmarkTooltipForArea, () => {
  it.each([
    [BenchmarkOutcome.NotCompared],
    [BenchmarkOutcome.Better],
    [BenchmarkOutcome.Similar],
    [BenchmarkOutcome.Worse],
    [BenchmarkOutcome.Lower],
    [BenchmarkOutcome.Higher],
  ])('should return the expected RAG tooltip for an area', (testOutcome) => {
    const actual = generateThematicMapTooltipString(
      mockHcPointRAG,
      undefined,
      undefined,
      BenchmarkComparisonMethod.CIOverlappingReferenceValue95,
      IndicatorPolarity.Unknown,
      'mock units'
    );
    expect(actual).toEqual(expectedAreaTooltip);
  });

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

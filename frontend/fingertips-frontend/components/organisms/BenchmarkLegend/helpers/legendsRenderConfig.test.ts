import { legendsRenderConfig } from './legendsRenderConfig';
import { BenchmarkComparisonMethod } from '@/generated-sources/ft-api-client';
import {
  bobOutcomes,
  ragOutcomes,
} from '@/components/organisms/BenchmarkLegend/benchmarkLegendHelpers';

describe('legendsRenderConfig', () => {
  it('returns correct config when all types are enabled', () => {
    const config = legendsRenderConfig({
      [BenchmarkComparisonMethod.CIOverlappingReferenceValue95]: {
        judgement: true,
        noJudgement: true,
      },
      [BenchmarkComparisonMethod.CIOverlappingReferenceValue99_8]: {
        judgement: true,
        noJudgement: false,
      },
      [BenchmarkComparisonMethod.Quintiles]: {
        judgement: true,
        noJudgement: true,
      },
    });

    const expectedOutcomes95 = [...new Set([...ragOutcomes, ...bobOutcomes])];
    const expectedOutcomes99 = [...new Set([...ragOutcomes])];

    expect(config.show95).toBe(true);
    expect(config.outcomes95).toEqual(expectedOutcomes95);
    expect(config.show99).toBe(true);
    expect(config.outcomes99).toEqual(expectedOutcomes99);
    expect(config.showQ).toBe(true);
    expect(config.showQnoJudgement).toBe(true);
    expect(config.hideDuplicateQuintileSubheading).toBe(true);
  });

  it('handles missing methods safely', () => {
    const config = legendsRenderConfig({}); // empty input

    expect(config.show95).toBe(false);
    expect(config.outcomes95).toEqual([]);
    expect(config.show99).toBe(false);
    expect(config.outcomes99).toEqual([]);
    expect(config.showQ).toBe(false);
    expect(config.showQnoJudgement).toBe(false);
    expect(config.hideDuplicateQuintileSubheading).toBe(false);
  });

  it('avoids duplicating rag outcomes in outcomes95', () => {
    const config = legendsRenderConfig({
      [BenchmarkComparisonMethod.CIOverlappingReferenceValue95]: {
        judgement: true,
        noJudgement: false,
      },
    });

    expect(config.outcomes95).toEqual([...new Set(ragOutcomes)]);
    expect(config.show95).toBe(true);
  });

  it('avoids duplicating bob outcomes in outcomes99', () => {
    const config = legendsRenderConfig({
      [BenchmarkComparisonMethod.CIOverlappingReferenceValue99_8]: {
        judgement: false,
        noJudgement: true,
      },
    });

    expect(config.outcomes99).toEqual([...new Set(bobOutcomes)]);
    expect(config.show99).toBe(true);
  });
});

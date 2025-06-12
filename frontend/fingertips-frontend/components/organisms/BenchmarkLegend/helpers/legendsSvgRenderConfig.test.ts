import { legendsSvgRenderConfig } from '@/components/organisms/BenchmarkLegend/helpers/legendsSvgRenderConfig';
import { BenchmarkComparisonMethod } from '@/generated-sources/ft-api-client';

describe('legendsSvgRenderConfig', () => {
  it('renders all legend types with correct spacing and cumulativeY', () => {
    const config = legendsSvgRenderConfig({
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

    expect(config.show95).toBe(true);
    expect(config.show99).toBe(true);
    expect(config.showQ).toBe(true);
    expect(config.showQnoJudgement).toBe(true);
    expect(config.hideDuplicateQuintileSubheading).toBe(true);

    // y positioning checks
    expect(config.yValues.y95).toBe(35);
    expect(config.yValues.y99).toBe(95); // 35 + 60
    expect(config.yValues.yQnoJudgement).toBe(155); // 95 + 60
    expect(config.yValues.yQJudgement).toBe(205); // 155 + 50 (reduced spacing)

    expect(config.cumulativeY).toBe(245); // last + 40
  });

  it('renders only 95 and quintile judgement with standard spacing', () => {
    const config = legendsSvgRenderConfig({
      [BenchmarkComparisonMethod.CIOverlappingReferenceValue95]: {
        judgement: true,
        noJudgement: false,
      },
      [BenchmarkComparisonMethod.Quintiles]: {
        judgement: true,
        noJudgement: false,
      },
    });

    expect(config.show95).toBe(true);
    expect(config.show99).toBe(false);
    expect(config.showQ).toBe(true);
    expect(config.showQnoJudgement).toBe(false);
    expect(config.hideDuplicateQuintileSubheading).toBe(false);

    expect(config.yValues.y95).toBe(35);
    expect(config.yValues.y99).toBe(0);
    expect(config.yValues.yQnoJudgement).toBe(0);
    expect(config.yValues.yQJudgement).toBe(95); // 35 + 60

    expect(config.cumulativeY).toBe(135);
  });

  it('returns zero y-values when no legends are shown', () => {
    const config = legendsSvgRenderConfig({});

    expect(config.show95).toBe(false);
    expect(config.show99).toBe(false);
    expect(config.showQ).toBe(false);
    expect(config.showQnoJudgement).toBe(false);
    expect(config.hideDuplicateQuintileSubheading).toBe(false);

    expect(config.yValues).toEqual({
      y95: 0,
      y99: 0,
      yQnoJudgement: 0,
      yQJudgement: 0,
    });

    expect(config.cumulativeY).toBe(35); // unchanged from initial
  });
});

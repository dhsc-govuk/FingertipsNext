import {
  GovukColours,
  QuintileColours,
  TagColours,
} from '@/lib/styleHelpers/colours';
import { BenchmarkLabelGroupConfig } from '@/components/organisms/BenchmarkLabel/BenchmarkLabelTypes';
import {
  BenchmarkComparisonMethod,
  BenchmarkOutcome,
  IndicatorPolarity,
} from '@/generated-sources/ft-api-client';

export const getBenchmarkTagStyle = (
  group: BenchmarkComparisonMethod,
  type: BenchmarkOutcome,
  polarity: IndicatorPolarity
) => {
  const groupConfig = benchmarkLabelGroupConfig[group];
  if (!groupConfig) return null;

  // special case Middle is used by Quintiles with and without judgement but has different colours
  if (
    polarity !== IndicatorPolarity.NoJudgement &&
    type === BenchmarkOutcome.Middle
  ) {
    return groupConfig['middleWithJudgement'];
  }

  return groupConfig[type] ?? groupConfig.default;
};

const similar = {
  backgroundColor: GovukColours.Yellow,
  color: GovukColours.Black,
};

const notCompared = {
  backgroundColor: 'transparent',
  color: GovukColours.Black,
  border: '1px solid #0B0C0C',
};

export const benchmarkLabelGroupConfig: BenchmarkLabelGroupConfig = {
  [BenchmarkComparisonMethod.CIOverlappingReferenceValue95]: {
    default: notCompared,
    [BenchmarkOutcome.Similar]: similar,
    // RAG
    [BenchmarkOutcome.Better]: {
      backgroundColor: GovukColours.Green,
      tint: 'SOLID',
    },
    [BenchmarkOutcome.Worse]: {
      backgroundColor: GovukColours.Red,
      tint: 'SOLID',
    },
    // BOB
    [BenchmarkOutcome.Lower]: {
      backgroundColor: GovukColours.LightBlue,
    },
    [BenchmarkOutcome.Higher]: {
      backgroundColor: GovukColours.DarkBlue,
      tint: 'SOLID',
    },
  },

  [BenchmarkComparisonMethod.CIOverlappingReferenceValue99_8]: {
    default: notCompared,
    [BenchmarkOutcome.Similar]: similar,
    // RAG
    [BenchmarkOutcome.Better]: {
      backgroundColor: GovukColours.LightGreen,
      color: GovukColours.Black,
    },

    [BenchmarkOutcome.Worse]: {
      backgroundColor: TagColours.DarkRed,
      tint: 'SOLID',
    },
    // BOB
    [BenchmarkOutcome.Lower]: {
      backgroundColor: TagColours.LightBlue,
      color: GovukColours.Black,
    },
    [BenchmarkOutcome.Higher]: {
      backgroundColor: GovukColours.Blue,
      tint: 'SOLID',
    },
  },

  [BenchmarkComparisonMethod.Quintiles]: {
    default: { backgroundColor: QuintileColours.Highest, tint: 'SOLID' },
    // no Judgement
    [BenchmarkOutcome.Lowest]: {
      backgroundColor: QuintileColours.Lowest,
      color: GovukColours.Black,
    },
    [BenchmarkOutcome.Low]: {
      backgroundColor: QuintileColours.Low,
      color: GovukColours.Black,
    },
    [BenchmarkOutcome.Middle]: {
      backgroundColor: QuintileColours.Middle,
      color: GovukColours.Black,
    },
    [BenchmarkOutcome.High]: {
      backgroundColor: QuintileColours.High,
      tint: 'SOLID',
    },
    // judgement
    [BenchmarkOutcome.Worst]: {
      backgroundColor: QuintileColours.Worst,
      color: GovukColours.Black,
    },
    [BenchmarkOutcome.Worse]: {
      backgroundColor: QuintileColours.Worse,
      color: GovukColours.Black,
    },
    middleWithJudgement: {
      backgroundColor: QuintileColours.MiddleWithValue,
      tint: 'SOLID',
    },
    [BenchmarkOutcome.Better]: {
      backgroundColor: QuintileColours.Better,
      tint: 'SOLID',
    },
    [BenchmarkOutcome.Best]: {
      backgroundColor: QuintileColours.Best,
      tint: 'SOLID',
    },
  },
};

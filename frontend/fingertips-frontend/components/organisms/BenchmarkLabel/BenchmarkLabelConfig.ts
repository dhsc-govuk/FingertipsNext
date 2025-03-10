import {
  GovukColours,
  QuintileColours,
  TagColours,
} from '@/lib/styleHelpers/colours';
import {
  BenchmarkLabelGroupConfig,
  BenchmarkLabelGroupType,
  BenchmarkLabelType,
} from '@/components/organisms/BenchmarkLabel/BenchmarkLabelTypes';

export const getBenchmarkTagStyle = (
  group: BenchmarkLabelGroupType,
  type: BenchmarkLabelType
) => {
  const groupConfig = benchmarkLabelGroupConfig[group];
  if (!groupConfig) return null;

  const typeConf = groupConfig[type];
  return typeConf ?? groupConfig.default;
};

export const benchmarkLabelGroupConfig: BenchmarkLabelGroupConfig = {
  [BenchmarkLabelGroupType.RAG]: {
    default: {
      backgroundColor: 'transparent',
      color: GovukColours.Black,
      border: '1px solid #0B0C0C',
    },
    [BenchmarkLabelType.BETTER]: {
      backgroundColor: GovukColours.Green,
      tint: 'SOLID',
    },
    [BenchmarkLabelType.SIMILAR]: {
      backgroundColor: GovukColours.Yellow,
      color: GovukColours.Black,
    },
    [BenchmarkLabelType.WORSE]: {
      backgroundColor: GovukColours.Red,
      tint: 'SOLID',
    },
    [BenchmarkLabelType.LOWER]: {
      backgroundColor: GovukColours.LightBlue,
    },
    [BenchmarkLabelType.HIGHER]: {
      backgroundColor: GovukColours.DarkBlue,
      tint: 'SOLID',
    },
  },
  [BenchmarkLabelGroupType.RAG_99]: {
    default: {
      backgroundColor: 'transparent',
      color: GovukColours.Black,
      border: '1px solid #0B0C0C',
    },
    [BenchmarkLabelType.BETTER]: {
      backgroundColor: GovukColours.LightGreen,
      color: GovukColours.Black,
    },
    [BenchmarkLabelType.SIMILAR]: {
      backgroundColor: GovukColours.Yellow,
      color: GovukColours.Black,
    },
    [BenchmarkLabelType.WORSE]: {
      backgroundColor: TagColours.DarkRed,
      tint: 'SOLID',
    },
    [BenchmarkLabelType.LOWER]: {
      backgroundColor: TagColours.LightBlue,
      color: GovukColours.Black,
    },
    [BenchmarkLabelType.HIGHER]: {
      backgroundColor: GovukColours.Blue,
      tint: 'SOLID',
    },
  },
  [BenchmarkLabelGroupType.QUINTILES]: {
    default: { backgroundColor: QuintileColours.Highest, tint: 'SOLID' },
    [BenchmarkLabelType.LOWEST]: {
      backgroundColor: QuintileColours.Lowest,
      color: GovukColours.Black,
    },
    [BenchmarkLabelType.LOW]: {
      backgroundColor: QuintileColours.Low,
      color: GovukColours.Black,
    },
    [BenchmarkLabelType.MIDDLE]: {
      backgroundColor: QuintileColours.Middle,
      color: GovukColours.Black,
    },
    [BenchmarkLabelType.HIGH]: {
      backgroundColor: QuintileColours.High,
      tint: 'SOLID',
    },
  },
  [BenchmarkLabelGroupType.QUINTILES_WITH_JUDGEMENT]: {
    default: { backgroundColor: QuintileColours.Best, tint: 'SOLID' },
    [BenchmarkLabelType.WORST]: {
      backgroundColor: QuintileColours.Worst,
      color: GovukColours.Black,
    },
    [BenchmarkLabelType.WORSE]: {
      backgroundColor: QuintileColours.Worse,
      color: GovukColours.Black,
    },
    [BenchmarkLabelType.MIDDLE]: {
      backgroundColor: QuintileColours.MiddleWithValue,
      tint: 'SOLID',
    },
    [BenchmarkLabelType.BETTER]: {
      backgroundColor: QuintileColours.Better,
      tint: 'SOLID',
    },
  },
};

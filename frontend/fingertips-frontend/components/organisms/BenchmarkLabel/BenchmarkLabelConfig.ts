import {
  GovukColours,
  GovukColourVars,
  QuintileColours,
  TagColours,
} from '@/lib/styleHelpers/colours';
import {
  BenchmarkLabelGroupType,
  BenchmarkLabelType,
  TBenchmarkLabelGroupConfig,
} from '@/components/organisms/BenchmarkLabel/BenchmarkLabelTypes';

export const getDefaultBenchmarkTagStyle = (
  group: BenchmarkLabelGroupType,
  type: BenchmarkLabelType
) => {
  const groupConfig = BenchmarkLabelGroupConfig[group];
  if (!groupConfig) return null;

  const typeConf = groupConfig[type];
  return typeConf ?? groupConfig.default;
};

export const BenchmarkLabelGroupConfig: TBenchmarkLabelGroupConfig = {
  [BenchmarkLabelGroupType.RAG]: {
    default: {
      backgroundColor: 'transparent',
      color: GovukColours.Black,
      border: '1px solid #0B0C0C',
    },
    [BenchmarkLabelType.BETTER]: {
      backgroundColor: GovukColourVars.GovOtherGreen,
      tint: 'SOLID',
    },
    [BenchmarkLabelType.SIMILAR]: {
      backgroundColor: GovukColourVars.GovOtherYellow,
      color: GovukColourVars.GovOtherBlack,
    },
    [BenchmarkLabelType.WORSE]: {
      backgroundColor: GovukColourVars.GovOtherRed,
      tint: 'SOLID',
    },
    [BenchmarkLabelType.LOWER]: {
      backgroundColor: GovukColourVars.GovOtherLightBlue,
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
      color: GovukColourVars.GovOtherBlack,
    },
    [BenchmarkLabelType.SIMILAR]: {
      backgroundColor: GovukColourVars.GovOtherYellow,
      color: GovukColourVars.GovOtherBlack,
    },
    [BenchmarkLabelType.WORSE]: {
      backgroundColor: TagColours.DarkRed,
      tint: 'SOLID',
    },
    [BenchmarkLabelType.LOWER]: {
      backgroundColor: TagColours.LightBlue,
      color: GovukColourVars.GovOtherBlack,
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
      color: GovukColourVars.GovOtherBlack,
    },
    [BenchmarkLabelType.LOW]: {
      backgroundColor: QuintileColours.Low,
      color: GovukColourVars.GovOtherBlack,
    },
    [BenchmarkLabelType.MIDDLE]: {
      backgroundColor: QuintileColours.Middle,
      color: GovukColourVars.GovOtherBlack,
    },
    [BenchmarkLabelType.HIGH]: {
      backgroundColor: QuintileColours.High,
      tint: 'SOLID',
    },
  },
  [BenchmarkLabelGroupType.QUINTILES_WITH_VALUE]: {
    default: { backgroundColor: QuintileColours.Best, tint: 'SOLID' },
    [BenchmarkLabelType.WORST]: {
      backgroundColor: QuintileColours.Worst,
      color: GovukColourVars.GovOtherBlack,
    },
    [BenchmarkLabelType.WORSE]: {
      backgroundColor: QuintileColours.Worse,
      color: GovukColourVars.GovOtherBlack,
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

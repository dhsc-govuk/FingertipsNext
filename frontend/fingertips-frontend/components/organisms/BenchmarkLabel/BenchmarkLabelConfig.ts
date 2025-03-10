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
  [BenchmarkLabelGroupType.RAG]: {
    default: notCompared,
    [BenchmarkLabelType.BETTER]: {
      backgroundColor: GovukColours.Green,
      tint: 'SOLID',
    },
    [BenchmarkLabelType.SIMILAR]: similar,
    [BenchmarkLabelType.WORSE]: {
      backgroundColor: GovukColours.Red,
      tint: 'SOLID',
    },
  },
  [BenchmarkLabelGroupType.BOB]: {
    default: notCompared,
    [BenchmarkLabelType.LOWER]: {
      backgroundColor: GovukColours.LightBlue,
    },
    [BenchmarkLabelType.HIGHER]: {
      backgroundColor: GovukColours.DarkBlue,
      tint: 'SOLID',
    },
    [BenchmarkLabelType.SIMILAR]: similar,
  },
  [BenchmarkLabelGroupType.RAG_99]: {
    default: notCompared,
    [BenchmarkLabelType.BETTER]: {
      backgroundColor: GovukColours.LightGreen,
      color: GovukColours.Black,
    },
    [BenchmarkLabelType.SIMILAR]: similar,
    [BenchmarkLabelType.WORSE]: {
      backgroundColor: TagColours.DarkRed,
      tint: 'SOLID',
    },
  },
  [BenchmarkLabelGroupType.BOB_99]: {
    default: notCompared,
    [BenchmarkLabelType.LOWER]: {
      backgroundColor: TagColours.LightBlue,
      color: GovukColours.Black,
    },
    [BenchmarkLabelType.SIMILAR]: similar,
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

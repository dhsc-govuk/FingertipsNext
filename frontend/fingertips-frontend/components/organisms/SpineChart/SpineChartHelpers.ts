import {
  IndicatorPolarity,
  QuartileData,
} from '@/generated-sources/ft-api-client';

type StatisticsExtremes = {
  best: number;
  bestQuartile: number;
  worstQuartile: number;
  worst: number;
};

export function orderStatistics(
  quartileData: QuartileData
): StatisticsExtremes {
  const q0Value = quartileData.q0Value ?? 0;
  const q1Value = quartileData.q1Value ?? 0;
  const q3Value = quartileData.q3Value ?? 0;
  const q4Value = quartileData.q4Value ?? 0;

  switch (quartileData.polarity) {
    case IndicatorPolarity.LowIsGood:
      return {
        best: q0Value,
        bestQuartile: q1Value,
        worstQuartile: q3Value,
        worst: q4Value,
      };
    case IndicatorPolarity.Unknown:
    case IndicatorPolarity.NoJudgement:
    case IndicatorPolarity.HighIsGood:
    default:
      return {
        best: q4Value,
        bestQuartile: q3Value,
        worstQuartile: q1Value,
        worst: q0Value,
      };
  }
}

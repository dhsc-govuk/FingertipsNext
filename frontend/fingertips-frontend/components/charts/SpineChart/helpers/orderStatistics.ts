import {
  IndicatorPolarity,
  QuartileData,
} from '@/generated-sources/ft-api-client';

type orderedQuartiles = {
  best?: number;
  bestQuartile?: number;
  worstQuartile?: number;
  worst?: number;
};

export function orderStatistics(quartileData: QuartileData): orderedQuartiles {
  const { q0Value, q1Value, q3Value, q4Value } = quartileData;
  if (
    q0Value === undefined ||
    q1Value === undefined ||
    q3Value === undefined ||
    q4Value === undefined
  ) {
    return {};
  }

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

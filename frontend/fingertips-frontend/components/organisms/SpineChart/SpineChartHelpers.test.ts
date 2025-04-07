import { IndicatorPolarity } from '@/generated-sources/ft-api-client';
import { orderStatistics } from './SpineChartHelpers';

describe('Spine chart helper', () => {
  it('empty stats should return zeros', () => {
    const emptyStats = {};

    const emptyResults = {
      best: 0,
      bestQuartile: 0,
      worstQuartile: 0,
      worst: 0,
    };

    expect(orderStatistics(emptyStats)).toEqual(emptyResults);
  });

  it('polarity undefined, should return sorted data', () => {
    const stats = {
      q0Value: 1,
      q1Value: 2,
      q3Value: 3,
      q4Value: 4,
    };

    const results = {
      best: 4,
      worst: 1,
      bestQuartile: 3,
      worstQuartile: 2,
    };

    expect(orderStatistics(stats)).toEqual(results);
  });

  it('polarity HighIsGood, should return sorted data', () => {
    const stats = {
      polarity: IndicatorPolarity.HighIsGood,
      q0Value: 1,
      q1Value: 2,
      q3Value: 3,
      q4Value: 4,
    };

    const results = {
      best: 4,
      worst: 1,
      bestQuartile: 3,
      worstQuartile: 2,
    };

    expect(orderStatistics(stats)).toEqual(results);
  });

  it('polarity NoJudgement should return sorted data', () => {
    const stats = {
      polarity: IndicatorPolarity.NoJudgement,
      q0Value: 1,
      q1Value: 2,
      q3Value: 3,
      q4Value: 4,
    };

    const results = {
      best: 4,
      worst: 1,
      bestQuartile: 3,
      worstQuartile: 2,
    };

    expect(orderStatistics(stats)).toEqual(results);
  });

  it('polarity Unknown should return sorted data', () => {
    const stats = {
      polarity: IndicatorPolarity.Unknown,
      q0Value: 1,
      q1Value: 2,
      q3Value: 3,
      q4Value: 4,
    };

    const results = {
      best: 4,
      worst: 1,
      bestQuartile: 3,
      worstQuartile: 2,
    };

    expect(orderStatistics(stats)).toEqual(results);
  });

  it('polarity LowIsGood should return sorted data', () => {
    const stats = {
      polarity: IndicatorPolarity.LowIsGood,
      q0Value: 1,
      q1Value: 2,
      q3Value: 3,
      q4Value: 4,
    };

    const results = {
      best: 1,
      worst: 4,
      bestQuartile: 2,
      worstQuartile: 3,
    };

    expect(orderStatistics(stats)).toEqual(results);
  });
});

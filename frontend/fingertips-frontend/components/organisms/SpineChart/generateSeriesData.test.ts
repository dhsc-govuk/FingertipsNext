import { generateSeriesData } from './generateSeriesData';
import {
  IndicatorPolarity,
  BenchmarkComparisonMethod,
  BenchmarkOutcome,
} from '@/generated-sources/ft-api-client';
import { GovukColours } from '@/lib/styleHelpers/colours';
import { SpineChartProps } from '.';

describe('generateSeriesData', () => {
  const mockProps: SpineChartProps = {
    name: 'Test Indicator',
    period: 2025,
    units: '%',
    benchmarkValue: 50,
    quartileData: {
      indicatorId: 1,
      q0Value: 20,
      q1Value: 30,
      q3Value: 70,
      q4Value: 80,
    },
    areaOneValue: 60,
    areaOneOutcome: BenchmarkOutcome.Better,
    areaTwoValue: 40,
    areaTwoOutcome: BenchmarkOutcome.Worse,
    areaNames: ['Area One', 'Area Two'],
    groupValue: 55,
    groupName: 'Test Group',
    groupOutcome: BenchmarkOutcome.Similar,
    benchmarkMethod: BenchmarkComparisonMethod.CIOverlappingReferenceValue95,
  };

  it('should generate series data correctly for valid props', () => {
    const result = generateSeriesData(mockProps);

    expect(result).toHaveLength(8); // 4 bars + 4 scatter points (group, areaOne, areaTwo, benchmark)

    // Check bar series
    const barSeries = result?.slice(0, 4);
    barSeries?.forEach((series) => {
      expect(series.type).toBe('bar');
      expect(series.color).toBeDefined();
      expect(series.data).toHaveLength(1);
    });

    // Check scatter series for group
    const groupScatter = result?.[4] as Highcharts.SeriesScatterOptions;
    expect(groupScatter?.type).toBe('scatter');
    expect(groupScatter?.name).toContain('Group: Test Group');
    expect(groupScatter?.marker?.symbol).toBe('diamond');
    expect(groupScatter?.marker?.fillColor).toBe(GovukColours.Yellow);

    // Check scatter series for areaOne
    const areaOneScatter = result?.[5] as Highcharts.SeriesScatterOptions;
    expect(areaOneScatter.type).toBe('scatter');
    expect(areaOneScatter.name).toContain('Area One');
    expect(areaOneScatter.marker?.symbol).toBe('circle');
    expect(areaOneScatter.marker?.fillColor).toBe(GovukColours.Green);

    // Check scatter series for areaTwo
    const areaTwoScatter = result?.[6] as Highcharts.SeriesScatterOptions;
    expect(areaTwoScatter?.type).toBe('scatter');
    expect(areaTwoScatter?.name).toContain('Area Two');
    expect(areaTwoScatter?.marker?.symbol).toBe('square');
    expect(areaTwoScatter?.marker?.fillColor).toBe(GovukColours.Red);

    // Check scatter series for benchmark
    const benchmarkScatter = result?.[7] as Highcharts.SeriesScatterOptions;
    expect(benchmarkScatter?.type).toBe('scatter');
    expect(benchmarkScatter?.name).toContain('Benchmark: England');
    expect(benchmarkScatter?.marker?.fillColor).toBe(GovukColours.Black);
  });

  it('should return null if quartile data is incomplete', () => {
    const invalidProps = {
      ...mockProps,
      quartileData: {
        best: undefined,
        bestQuartile: 70,
        worstQuartile: 30,
        worst: 20,
        polarity: IndicatorPolarity.HighIsGood,
      },
    };

    const result = generateSeriesData(invalidProps);
    expect(result).toBeNull();
  });

  it('should not return series data for group if not provided', () => {
    const propsWithoutGroup = { ...mockProps, groupValue: undefined };
    const result = generateSeriesData(propsWithoutGroup);

    expect(result).toHaveLength(7); // 4 bars + 3 scatter points (areaOne, areaTwo, benchmark)
    expect(
      result?.find((series) => series?.name?.includes('Group'))
    ).toBeUndefined();
  });

  it('should not return series data for areas if not provided', () => {
    const propsWithoutAreas = {
      ...mockProps,
      areaOneValue: undefined,
      areaTwoValue: undefined,
    };
    const result = generateSeriesData(propsWithoutAreas);

    expect(result).toHaveLength(6); // 4 bars + 2 scatter point (group, benchmark)
    expect(
      result?.find((series) => series?.name?.includes('Area One'))
    ).toBeUndefined();
    expect(
      result?.find((series) => series?.name?.includes('Area Two'))
    ).toBeUndefined();
  });
});

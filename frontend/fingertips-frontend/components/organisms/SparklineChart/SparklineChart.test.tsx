import { render, screen } from '@testing-library/react';
import {
  SparklineChart,
  sparklineTooltipContent,
} from '@/components/organisms/SparklineChart/index';
import { expect } from '@jest/globals';
import { SparklineLabelEnum } from '@/components/organisms/BarChartEmbeddedTable';
import {
  BenchmarkComparisonMethod,
  BenchmarkOutcome,
} from '@/generated-sources/ft-api-client';

describe('SparklineChart', () => {
  const mockValue = [48];
  const maxValue = 100;
  it('Should render the highcharts react component', async () => {
    render(
      <SparklineChart
        value={mockValue}
        maxValue={maxValue}
        confidenceIntervalValues={[5, 10]}
        showConfidenceIntervalsData={true}
        label={'mock'}
        area={'mockArea'}
        year={2000}
        measurementUnit={''}
      />
    );

    expect(
      await screen.findByTestId(
        'highcharts-react-component-barChartEmbeddedTable'
      )
    ).toBeInTheDocument();
  });

  describe('sparklineTooltipContent', () => {
    it('should return the category "Benchmark" prefix and an empty benchmark label when benchmark data is present', () => {
      const benchmarkOutcome = BenchmarkOutcome.Similar;
      const benchmarkComparisonMethod =
        BenchmarkComparisonMethod.CIOverlappingReferenceValue95;

      const result = sparklineTooltipContent(
        benchmarkOutcome,
        SparklineLabelEnum.Benchmark,
        benchmarkComparisonMethod
      );

      expect(result).toEqual({
        benchmarkLabel: '',
        category: 'Benchmark: ',
        comparisonLabel: '',
      });
    });

    it('should return the category "Group" prefix when group data is present', () => {
      const benchmarkOutcome = BenchmarkOutcome.NotCompared;
      const benchmarkComparisonMethod =
        BenchmarkComparisonMethod.CIOverlappingReferenceValue95;

      const result = sparklineTooltipContent(
        benchmarkOutcome,
        SparklineLabelEnum.Group,
        benchmarkComparisonMethod
      );

      expect(result).toEqual({
        benchmarkLabel: '',
        category: 'Group: ',
        comparisonLabel: '',
      });
    });

    it('should return "Similar to England" benchmark label when the benchmark outcome is Similar', () => {
      const benchmarkOutcome = BenchmarkOutcome.Similar;
      const benchmarkComparisonMethod =
        BenchmarkComparisonMethod.CIOverlappingReferenceValue95;

      const result = sparklineTooltipContent(
        benchmarkOutcome,
        SparklineLabelEnum.Area,
        benchmarkComparisonMethod
      );

      expect(result).toEqual({
        benchmarkLabel: 'Similar to England',
        category: '',
        comparisonLabel: '(95.0%)',
      });
    });

    it('should return comparison label of "95%" when benchmark comparison method is CIOverlappingReferenceValue95', () => {
      const benchmarkOutcome = BenchmarkOutcome.Similar;
      const benchmarkComparisonMethod =
        BenchmarkComparisonMethod.CIOverlappingReferenceValue95;

      const result = sparklineTooltipContent(
        benchmarkOutcome,
        SparklineLabelEnum.Area,
        benchmarkComparisonMethod
      );

      expect(result).toEqual({
        benchmarkLabel: 'Similar to England',
        category: '',
        comparisonLabel: '(95.0%)',
      });
    });

    it('should not return a comparison label or benchmark label when the benchmark outcome method of "Not compared" is passed in', () => {
      const benchmarkOutcome = BenchmarkOutcome.NotCompared;
      const benchmarkComparisonMethod = BenchmarkComparisonMethod.Unknown;

      const result = sparklineTooltipContent(
        benchmarkOutcome,
        SparklineLabelEnum.Benchmark,
        benchmarkComparisonMethod
      );

      expect(result).toEqual({
        benchmarkLabel: '',
        category: 'Benchmark: ',
        comparisonLabel: '',
      });
    });
  });
});

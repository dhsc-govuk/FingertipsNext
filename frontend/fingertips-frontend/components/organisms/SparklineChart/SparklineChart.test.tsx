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
import { act } from 'react';

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
    const measurementUnit = '%';
    it('should return the category "Benchmark" prefix and an empty benchmark label when benchmark data is present', async () => {
      const benchmarkOutcome = BenchmarkOutcome.Similar;
      const benchmarkComparisonMethod =
        BenchmarkComparisonMethod.CIOverlappingReferenceValue95;
      render(
        <SparklineChart
          value={mockValue}
          maxValue={maxValue}
          confidenceIntervalValues={[5, 10]}
          showConfidenceIntervalsData={true}
          label={SparklineLabelEnum.Benchmark}
          area={'mockArea'}
          year={2000}
          measurementUnit={''}
        />
      );

      const result = sparklineTooltipContent(
        benchmarkOutcome,
        SparklineLabelEnum.Benchmark,
        benchmarkComparisonMethod,
        measurementUnit
      );
      await act(async () => {
        render(
          <SparklineChart
            value={mockValue}
            maxValue={maxValue}
            confidenceIntervalValues={[5, 10]}
            showConfidenceIntervalsData={true}
            label={SparklineLabelEnum.Benchmark}
            area={'mockArea'}
            year={2000}
            measurementUnit={''}
          />
        );
      });
      expect(result).toEqual({
        benchmarkLabel: '',
        category: 'Benchmark: ',
        comparisonLabel: '',
      });
    });

    it('should return the category "Group" prefix when group data is present', async () => {
      const benchmarkOutcome = BenchmarkOutcome.NotCompared;
      const benchmarkComparisonMethod =
        BenchmarkComparisonMethod.CIOverlappingReferenceValue95;
      render(
        <SparklineChart
          value={mockValue}
          maxValue={maxValue}
          confidenceIntervalValues={[5, 10]}
          showConfidenceIntervalsData={true}
          label={SparklineLabelEnum.Group}
          area={'mockArea'}
          year={2000}
          measurementUnit={''}
        />
      );

      const result = sparklineTooltipContent(
        benchmarkOutcome,
        SparklineLabelEnum.Group,
        benchmarkComparisonMethod,
        measurementUnit
      );
      await act(async () => {
        render(
          <SparklineChart
            value={mockValue}
            maxValue={maxValue}
            confidenceIntervalValues={[5, 10]}
            showConfidenceIntervalsData={true}
            label={SparklineLabelEnum.Group}
            area={'mockArea'}
            year={2000}
            measurementUnit={''}
          />
        );
      });
      expect(result).toEqual({
        benchmarkLabel: '',
        category: 'Group: ',
        comparisonLabel: '',
        measurementUnit: '%',
      });
    });

    it('should return "Similar to England" benchmark label when the benchmark outcome is Similar', async () => {
      const benchmarkOutcome = BenchmarkOutcome.Similar;
      const benchmarkComparisonMethod =
        BenchmarkComparisonMethod.CIOverlappingReferenceValue95;
      render(
        <SparklineChart
          value={mockValue}
          maxValue={maxValue}
          confidenceIntervalValues={[5, 10]}
          showConfidenceIntervalsData={true}
          label={SparklineLabelEnum.Area}
          area={'mockArea'}
          year={2000}
          measurementUnit={''}
        />
      );

      const result = sparklineTooltipContent(
        benchmarkOutcome,
        SparklineLabelEnum.Area,
        benchmarkComparisonMethod,
        measurementUnit
      );
      await act(async () => {
        render(
          <SparklineChart
            value={mockValue}
            maxValue={maxValue}
            confidenceIntervalValues={[5, 10]}
            showConfidenceIntervalsData={true}
            label={SparklineLabelEnum.Area}
            area={'mockArea'}
            year={2000}
            measurementUnit={''}
          />
        );
      });
      expect(result).toEqual({
        benchmarkLabel: 'Similar to England',
        category: '',
        comparisonLabel: '(95%)',
        measurementUnit: '%',
      });
    });

    it('should return comparison label of "95%" when benchmark comparison method is CIOverlappingReferenceValue95', async () => {
      const benchmarkOutcome = BenchmarkOutcome.Similar;
      const benchmarkComparisonMethod =
        BenchmarkComparisonMethod.CIOverlappingReferenceValue95;
      render(
        <SparklineChart
          value={mockValue}
          maxValue={maxValue}
          confidenceIntervalValues={[5, 10]}
          showConfidenceIntervalsData={true}
          label={SparklineLabelEnum.Area}
          area={'mockArea'}
          year={2000}
          measurementUnit={''}
        />
      );

      const result = sparklineTooltipContent(
        benchmarkOutcome,
        SparklineLabelEnum.Area,
        benchmarkComparisonMethod,
        measurementUnit
      );
      await act(async () => {
        render(
          <SparklineChart
            value={mockValue}
            maxValue={maxValue}
            confidenceIntervalValues={[5, 10]}
            showConfidenceIntervalsData={true}
            label={SparklineLabelEnum.Area}
            area={'mockArea'}
            year={2000}
            measurementUnit={''}
          />
        );
      });
      expect(result).toEqual({
        benchmarkLabel: 'Similar to England',
        category: '',
        comparisonLabel: '(95%)',
        measurementUnit: '%',
      });
    });
  });
});

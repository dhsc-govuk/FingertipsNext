import { render, screen } from '@testing-library/react';
import {
  SparklineChart,
  sparklineTooltipContent,
} from '@/components/organisms/SparklineChart/index';
import { expect } from '@jest/globals';
import { SparklineLabelEnum } from '@/components/organisms/BarChartEmbeddedTable';
import { BenchmarkOutcome } from '@/generated-sources/ft-api-client';
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
    it('should return the category "Benchmark" prefix and an empty benchmark label when benchmark data is present', async () => {
      const benchmarkOutcome = BenchmarkOutcome.Similar;
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
        SparklineLabelEnum.Benchmark
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
      expect(result).toEqual({ benchmarkLabel: '', category: 'Benchmark: ' });
    });

    it('should return the category "Group" prefix when group data is present', async () => {
      const benchmarkOutcome = BenchmarkOutcome.NotCompared;
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
        SparklineLabelEnum.Group
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
      expect(result).toEqual({ benchmarkLabel: '', category: 'Group: ' });
    });

    it('should return "Similar to England" benchmark label when the benchmark outcome is Similar', async () => {
      const benchmarkOutcome = BenchmarkOutcome.Similar;

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
        SparklineLabelEnum.Area
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
      });
    });
  });
});

import { render, screen } from '@testing-library/react';
import { BenchmarkTooltip } from './BenchmarkTooltip';
import { mockHealthData } from '@/mock/data/healthdata';

describe('BenchmarkTooltip', () => {
  const testIndicatorData = mockHealthData['337'][1];
  it('should return tooltip content for an area', () => {
    render(
      <BenchmarkTooltip
        indicatorData={testIndicatorData}
        benchmarkComparisonMethod={'Unknown'}
        measurementUnit={undefined}
      />
    );
    expect(
      screen.getByText(RegExp(testIndicatorData.areaName))
    ).toBeInTheDocument();
    expect(screen.queryByText(/Group/)).not.toBeInTheDocument();
    expect(screen.queryByText(/Benchmark/)).not.toBeInTheDocument();
  });
  it('should return tooltip content for an area and group', () => {
    render(
      <BenchmarkTooltip
        indicatorData={testIndicatorData}
        benchmarkComparisonMethod={'Unknown'}
        measurementUnit={undefined}
        indicatorDataForGroup={testIndicatorData}
      />
    );
    expect(
      screen.getAllByText(RegExp(testIndicatorData.areaName))
    ).toHaveLength(2);
    expect(screen.queryByText(/Group/)).toBeInTheDocument();
    expect(screen.queryByText(/Benchmark/)).not.toBeInTheDocument();
  });
  it('should return tooltip content for an an area, group and benchmark', () => {
    render(
      <BenchmarkTooltip
        indicatorData={testIndicatorData}
        benchmarkComparisonMethod={'Unknown'}
        measurementUnit={undefined}
        indicatorDataForGroup={testIndicatorData}
        indicatorDataForBenchmark={testIndicatorData}
      />
    );
    expect(
      screen.getAllByText(RegExp(testIndicatorData.areaName))
    ).toHaveLength(3);
    expect(screen.queryByText(/Group/)).toBeInTheDocument();
    expect(screen.queryByText(/Benchmark/)).toBeInTheDocument();
  });
});

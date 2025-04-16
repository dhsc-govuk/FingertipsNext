import { render, screen } from '@testing-library/react';
import { BenchmarkTooltip } from './index';
import { mockHealthData } from '@/mock/data/healthdata';
import { IndicatorPolarity } from '@/generated-sources/ft-api-client';

describe('BenchmarkTooltip', () => {
  const testIndicatorData = mockHealthData['337'][1];
  it('should return tooltip content for an area', () => {
    render(
      <BenchmarkTooltip
        indicatorData={testIndicatorData}
        benchmarkComparisonMethod={'Unknown'}
        measurementUnit={undefined}
        polarity={IndicatorPolarity.Unknown}
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
        polarity={IndicatorPolarity.Unknown}
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
        polarity={IndicatorPolarity.Unknown}
      />
    );
    expect(
      screen.getAllByText(RegExp(testIndicatorData.areaName))
    ).toHaveLength(3);
    expect(screen.queryByText(/Group/)).toBeInTheDocument();
    expect(screen.queryByText(/Benchmark/)).toBeInTheDocument();
    expect(
      screen.getAllByTestId('benchmark-tooltip-area')[0]
    ).toHaveTextContent(`Benchmark: ${testIndicatorData.areaName}`);
    expect(
      screen.getAllByTestId('benchmark-tooltip-area')[1]
    ).toHaveTextContent(`Group: ${testIndicatorData.areaName}`);
    expect(
      screen.getAllByTestId('benchmark-tooltip-area')[2]
    ).toHaveTextContent(`${testIndicatorData.areaName}`);
  });
});

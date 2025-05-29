import { render } from '@testing-library/react';
import {
  HeatmapHoverBenchmarkPill,
  HeatmapHoverBenchmarkPillProps,
} from './heatmapHoverBenchmarkPill';
import {
  BenchmarkComparisonMethod,
  BenchmarkOutcome,
  BenchmarkReferenceType,
} from '@/generated-sources/ft-api-client';
import { formatNumber } from '@/lib/numberFormatter';
import { englandAreaString } from '@/lib/chartHelpers/constants';

describe('heatmap hover benchmark pill', () => {
  const defaultValue = 123;
  const defaultFormattedValue = formatNumber(defaultValue);
  const defaultProps: HeatmapHoverBenchmarkPillProps = {
    unitLabel: 'unit label',
    value: defaultValue,
    outcome: 'NotCompared',
    benchmarkMethod: 'Unknown',
    polarity: 'Unknown',
    benchmarkRefType: BenchmarkReferenceType.England,
    benchmarkAreaName: englandAreaString,
  };

  it('should display text if value is missing', () => {
    const screen = render(
      <HeatmapHoverBenchmarkPill
        unitLabel={defaultProps.unitLabel}
        outcome={defaultProps.outcome}
        benchmarkMethod={defaultProps.benchmarkMethod}
        polarity={defaultProps.polarity}
        benchmarkAreaName={defaultProps.benchmarkAreaName}
        benchmarkRefType={defaultProps.benchmarkRefType}
      />
    );

    expect(screen.getByText('No data available')).toBeInTheDocument();
  });

  it('should display value, and unit label if the benchmark is the baseline benchmark', () => {
    const screen = render(
      <HeatmapHoverBenchmarkPill
        unitLabel={defaultProps.unitLabel}
        value={defaultValue}
        outcome={'Baseline'}
        benchmarkMethod={defaultProps.benchmarkMethod}
        polarity={defaultProps.polarity}
        benchmarkAreaName={defaultProps.benchmarkAreaName}
        benchmarkRefType={defaultProps.benchmarkRefType}
      />
    );

    expect(
      screen.getByText(defaultFormattedValue, { exact: false })
    ).toBeInTheDocument();
    expect(
      screen.getByText(defaultProps.unitLabel, { exact: false })
    ).toBeInTheDocument();
  });

  it('should display value, and unit label, and text if the benchmark is not compared', () => {
    const screen = render(
      <HeatmapHoverBenchmarkPill
        unitLabel={defaultProps.unitLabel}
        value={defaultValue}
        outcome={BenchmarkOutcome.NotCompared}
        benchmarkMethod={defaultProps.benchmarkMethod}
        polarity={defaultProps.polarity}
        benchmarkAreaName={defaultProps.benchmarkAreaName}
        benchmarkRefType={defaultProps.benchmarkRefType}
      />
    );

    expect(
      screen.getByText(defaultFormattedValue, { exact: false })
    ).toBeInTheDocument();
    expect(
      screen.getByText(defaultProps.unitLabel, { exact: false })
    ).toBeInTheDocument();
    expect(screen.getByText('Not compared')).toBeInTheDocument();
  });

  it('should display value, unit label, confidence and outcome text', () => {
    const screen = render(
      <HeatmapHoverBenchmarkPill
        unitLabel={defaultProps.unitLabel}
        value={defaultValue}
        outcome={BenchmarkOutcome.Similar}
        benchmarkMethod={
          BenchmarkComparisonMethod.CIOverlappingReferenceValue95
        }
        polarity={defaultProps.polarity}
        benchmarkRefType={defaultProps.benchmarkRefType}
        benchmarkAreaName={defaultProps.benchmarkAreaName}
      />
    );

    expect(
      screen.getByText(defaultFormattedValue, { exact: false })
    ).toBeInTheDocument();
    expect(
      screen.getByText(defaultProps.unitLabel, { exact: false })
    ).toBeInTheDocument();
    expect(screen.getByText('Similar to England (95%)')).toBeInTheDocument();
  });

  it('should use the given area name in outcome text', () => {
    const testBenchmarkAreaName = 'West Foobar';

    const screen = render(
      <HeatmapHoverBenchmarkPill
        unitLabel={defaultProps.unitLabel}
        value={defaultValue}
        outcome={BenchmarkOutcome.Similar}
        benchmarkMethod={
          BenchmarkComparisonMethod.CIOverlappingReferenceValue95
        }
        polarity={defaultProps.polarity}
        benchmarkRefType={defaultProps.benchmarkRefType}
        benchmarkAreaName={'West Foobar'}
      />
    );

    expect(
      screen.getByText(`Similar to ${testBenchmarkAreaName} (95%)`)
    ).toBeInTheDocument();
  });
});

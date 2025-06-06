import { render } from '@testing-library/react';
import {
  HeatmapHoverBenchmarkPill,
  HeatmapHoverBenchmarkPillProps,
} from './HeatmapHoverBenchmarkPill';
import {
  BenchmarkComparisonMethod,
  BenchmarkOutcome,
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

  it('should use different grammar for nonsimilar outcomes', () => {
    const screen = render(
      <HeatmapHoverBenchmarkPill
        unitLabel={defaultProps.unitLabel}
        value={defaultValue}
        outcome={BenchmarkOutcome.Worse}
        benchmarkMethod={
          BenchmarkComparisonMethod.CIOverlappingReferenceValue95
        }
        polarity={defaultProps.polarity}
        benchmarkAreaName={defaultProps.benchmarkAreaName}
      />
    );

    expect(screen.getByText('Worse than England (95%)')).toBeInTheDocument();
  });

  it('should use the benchmark area name in outcome text', () => {
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
        benchmarkAreaName={testBenchmarkAreaName}
      />
    );

    expect(
      screen.getByText(`Similar to ${testBenchmarkAreaName} (95%)`)
    ).toBeInTheDocument();
  });

  it('should not use the benchmark area name in quintiles outcome text', () => {
    const screen = render(
      <HeatmapHoverBenchmarkPill
        unitLabel={defaultProps.unitLabel}
        value={defaultValue}
        outcome={BenchmarkOutcome.Lower}
        benchmarkMethod={BenchmarkComparisonMethod.Quintiles}
        polarity={defaultProps.polarity}
        benchmarkAreaName={defaultProps.benchmarkAreaName}
      />
    );

    expect(screen.getByText('Lower quintile')).toBeInTheDocument();
  });
});

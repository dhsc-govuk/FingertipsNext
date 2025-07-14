import {
  BenchmarkComparisonMethod,
  BenchmarkOutcome,
  IndicatorPolarity,
} from '@/generated-sources/ft-api-client';
import { BenchmarkPillIcon, BenchmarkPillIconProps } from './BenchmarkPillIcon';
import { render } from '@testing-library/react';
import { GovukColours } from '@/lib/styleHelpers/colours';
import { getBenchmarkColour } from '@/lib/chartHelpers/chartHelpers';

describe('heatmap hover pill icon', () => {
  const defaultValue = 123;
  const defaultOutcome = BenchmarkOutcome.Similar;
  const defaultProps: BenchmarkPillIconProps = {
    value: defaultValue,
    outcome: defaultOutcome,
    benchmarkMethod: BenchmarkComparisonMethod.CIOverlappingReferenceValue95,
    polarity: IndicatorPolarity.HighIsGood,
  };

  it('should return an ✕ if value not given', () => {
    const screen = render(
      <BenchmarkPillIcon
        value={undefined}
        outcome={defaultProps.outcome}
        benchmarkMethod={defaultProps.benchmarkMethod}
        polarity={defaultProps.polarity}
      />
    );

    expect(screen.getByText('✕')).toBeInTheDocument();
  });

  it('should return a white square with a solid black border if outcome is "Not Compared"', () => {
    const screen = render(
      <BenchmarkPillIcon
        value={defaultProps.value}
        outcome={BenchmarkOutcome.NotCompared}
        benchmarkMethod={defaultProps.benchmarkMethod}
        polarity={defaultProps.polarity}
      />
    );

    expect(screen.getByTestId('heatmap-benchmark-icon')).toHaveStyle({
      'background-color': GovukColours.White,
      'border-color': GovukColours.Black,
    });
  });

  it('should return a dark grey square if outcome is baseline', () => {
    const screen = render(
      <BenchmarkPillIcon
        value={defaultProps.value}
        outcome={'Baseline'}
        benchmarkMethod={defaultProps.benchmarkMethod}
        polarity={defaultProps.polarity}
      />
    );

    expect(screen.getByTestId('heatmap-benchmark-icon')).toHaveStyle({
      'background-color': GovukColours.DarkGrey,
    });
  });

  it('should return a square with the appropriate benchmark outcome colour', () => {
    const screen = render(
      <BenchmarkPillIcon
        value={defaultProps.value}
        outcome={defaultProps.outcome}
        benchmarkMethod={defaultProps.benchmarkMethod}
        polarity={defaultProps.polarity}
      />
    );

    const expectedColour = getBenchmarkColour(
      defaultProps.benchmarkMethod,
      defaultOutcome,
      defaultProps.polarity
    );

    expect(screen.getByTestId('heatmap-benchmark-icon')).toHaveStyle({
      'background-color': expectedColour,
    });
  });
});

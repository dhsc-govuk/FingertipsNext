import { render } from '@testing-library/react';
import { HeatmapHover, HeatmapHoverProps } from './heatmapHover';
import {
  BenchmarkComparisonMethod,
  BenchmarkOutcome,
  IndicatorPolarity,
} from '@/generated-sources/ft-api-client';

describe('heatmap hover', () => {
  const testValue = 123;
  const testHoverProps: HeatmapHoverProps = {
    areaName: '123',
    period: '344',
    indicatorName: '213',
    value: testValue,
    unitLabel: 'per foobar',
    benchmark: {
      outcome: BenchmarkOutcome.NotCompared,
      benchmarkMethod: BenchmarkComparisonMethod.Unknown,
      polarity: IndicatorPolarity.Unknown,
    },
  };

  it('should render nothing if passed undefined', () => {
    const screen = render(<HeatmapHover hoverProps={undefined} />);
    expect(screen.queryByTestId('heatmap-hover')).not.toBeInTheDocument();
  });

  it('should display area, period, and indicator name', () => {
    const screen = render(<HeatmapHover hoverProps={testHoverProps} />);

    expect(screen.getByText(testHoverProps.areaName)).toBeInTheDocument();
    expect(screen.getByText(testHoverProps.period)).toBeInTheDocument();
    expect(screen.getByText(testHoverProps.indicatorName)).toBeInTheDocument();
  });
});

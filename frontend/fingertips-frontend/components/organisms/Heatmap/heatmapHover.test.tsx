import { render } from '@testing-library/react';
import { HeatmapHover, HeatmapHoverProps } from './heatmapHover';
import {
  BenchmarkComparisonMethod,
  BenchmarkOutcome,
  IndicatorPolarity,
} from '@/generated-sources/ft-api-client';

const testValue = 123;
const testHoverProps: HeatmapHoverProps = {
  areaName: '123',
  period: '344',
  indicatorName: '213',
  value: testValue,
  unitLabel: 'per foobar',
  benchmark: {
    outcome: BenchmarkOutcome.Better,
    benchmarkMethod: BenchmarkComparisonMethod.CIOverlappingReferenceValue99_8,
    polarity: IndicatorPolarity.LowIsGood,
  },
};

describe('heatmap hover', () => {
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

describe('snapshot', () => {
  const container = render(<HeatmapHover hoverProps={testHoverProps} />);
  expect(container.asFragment()).toMatchSnapshot();
});

import { render } from '@testing-library/react';
import { HeatmapHover, HeatmapHoverProps } from './heatmapHover';
import {
  BenchmarkComparisonMethod,
  BenchmarkOutcome,
  IndicatorPolarity,
} from '@/generated-sources/ft-api-client';

const testValue = 67;
const testHoverProps: HeatmapHoverProps = {
  areaName: 'Sesame Street',
  period: 1966,
  indicatorName:
    'Cookies eaten by the cookie monster compared to total US production',
  value: testValue,
  unitLabel: '%',
  benchmark: {
    outcome: BenchmarkOutcome.Better,
    benchmarkMethod: BenchmarkComparisonMethod.CIOverlappingReferenceValue99_8,
    polarity: IndicatorPolarity.HighIsGood,
  },
};

describe('heatmap hover', () => {
  it('should display area, period, and indicator name', () => {
    // TODO why is this rendering twice?
    const screen = render(
      <HeatmapHover
        areaName={testHoverProps.areaName}
        period={testHoverProps.period}
        indicatorName={testHoverProps.indicatorName}
        unitLabel={testHoverProps.unitLabel}
        benchmark={testHoverProps.benchmark}
      />
    );

    expect(screen.getByText(testHoverProps.areaName)).toBeInTheDocument();
    expect(screen.getByText(testHoverProps.period)).toBeInTheDocument();
    expect(screen.getByText(testHoverProps.indicatorName)).toBeInTheDocument();
  });
});

describe('snapshot', () => {
  const container = render(
    <HeatmapHover
      areaName={testHoverProps.areaName}
      period={testHoverProps.period}
      indicatorName={testHoverProps.indicatorName}
      unitLabel={testHoverProps.unitLabel}
      benchmark={testHoverProps.benchmark}
    />
  );
  expect(container.asFragment()).toMatchSnapshot();
});

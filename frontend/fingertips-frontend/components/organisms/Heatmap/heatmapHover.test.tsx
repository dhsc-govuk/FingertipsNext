import { render } from '@testing-library/react';
import { HeatmapHover, HeatmapHoverProps } from './heatmapHover';
import {
  BenchmarkComparisonMethod,
  BenchmarkOutcome,
  IndicatorPolarity,
} from '@/generated-sources/ft-api-client';
import { englandAreaString } from '@/lib/chartHelpers/constants';

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
    benchmarkAreaName: englandAreaString,
  },
};

describe('heatmap hover', () => {
  it('should display area, period, and indicator name', () => {
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

  it('snapshot', () => {
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
});

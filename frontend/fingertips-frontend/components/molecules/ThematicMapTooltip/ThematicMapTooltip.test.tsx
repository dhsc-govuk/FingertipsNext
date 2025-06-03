import { render, screen } from '@testing-library/react';
import { ThematicMapTooltip } from './index';
import { mockHealthData } from '@/mock/data/healthdata';
import { IndicatorPolarity } from '@/generated-sources/ft-api-client';

describe('ThematicMapTooltip', () => {
  const stubIndicatorData = mockHealthData['337'][1];
  const stubGroupData = mockHealthData['337'][2];

  it('should return tooltip content for an area and group', () => {
    render(
      <ThematicMapTooltip
        indicatorData={stubIndicatorData}
        benchmarkComparisonMethod={'Unknown'}
        measurementUnit={undefined}
        indicatorDataForGroup={stubGroupData}
        polarity={IndicatorPolarity.Unknown}
      />
    );
    expect(screen.getAllByTestId('benchmark-tooltip-area')).toHaveLength(2);
    expect(screen.queryByText(/Group/)).toBeInTheDocument();
    expect(screen.queryByText(/Benchmark/)).not.toBeInTheDocument();
  });

  it('should return tooltip content for an an area, group and benchmark', () => {
    stubIndicatorData.healthData[0].benchmarkComparison = {
      benchmarkAreaName: 'benchmark area',
      benchmarkValue: 100,
      outcome: 'Better',
    };
    render(
      <ThematicMapTooltip
        indicatorData={stubIndicatorData}
        benchmarkComparisonMethod={'Unknown'}
        measurementUnit={undefined}
        indicatorDataForGroup={stubGroupData}
        polarity={IndicatorPolarity.Unknown}
      />
    );

    screen.debug();

    expect(screen.getAllByTestId('benchmark-tooltip-area')).toHaveLength(3);
    expect(screen.queryByText(/Group/)).toBeInTheDocument();
    expect(screen.queryByText(/Benchmark/)).toBeInTheDocument();
    expect(
      screen.getAllByTestId('benchmark-tooltip-area')[0]
    ).toHaveTextContent(
      `Benchmark: ${stubIndicatorData.healthData[0].benchmarkComparison?.benchmarkAreaName}`
    );
    expect(
      screen.getAllByTestId('benchmark-tooltip-area')[1]
    ).toHaveTextContent(`Group: ${stubGroupData.areaName}`);
    expect(
      screen.getAllByTestId('benchmark-tooltip-area')[2]
    ).toHaveTextContent(`${stubIndicatorData.areaName}`);
  });
});

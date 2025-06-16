import { render, screen } from '@testing-library/react';
import { BenchmarkLegendsSvg } from './BenchmarkLegendsSvg';
import { BenchmarkLegendsToShow } from '@/components/organisms/BenchmarkLegend/benchmarkLegend.types';
import { BenchmarkComparisonMethod } from '@/generated-sources/ft-api-client';

// Mocking BenchmarkLegendGroupSvg to focus only on render logic
jest.mock(
  '@/components/organisms/BenchmarkLegend/components/svg/BenchmarkLegendGroupSvg',
  () => ({
    BenchmarkLegendGroupSvg: jest.fn(({ y, benchmarkComparisonMethod }) => (
      <g data-testid={`legend-${benchmarkComparisonMethod}`} data-y={y}></g>
    )),
  })
);

describe('BenchmarkLegendsSvg', () => {
  it('renders correct SVG structure with all legend types shown', () => {
    const legendsToShow: BenchmarkLegendsToShow = {
      [BenchmarkComparisonMethod.CIOverlappingReferenceValue95]: {
        judgement: true,
        noJudgement: true,
      },
      [BenchmarkComparisonMethod.CIOverlappingReferenceValue99_8]: {
        judgement: true,
        noJudgement: false,
      },
      [BenchmarkComparisonMethod.Quintiles]: {
        judgement: true,
        noJudgement: true,
      },
    };

    render(
      <BenchmarkLegendsSvg legendsToShow={legendsToShow} title="Test Title" />
    );

    expect(
      screen.getByTestId('benchmarkLegend-component-svg')
    ).toBeInTheDocument();
    expect(screen.getByText('Test Title')).toBeInTheDocument();

    expect(
      screen.getByTestId(
        `legend-${BenchmarkComparisonMethod.CIOverlappingReferenceValue95}`
      )
    ).toBeInTheDocument();
    expect(
      screen.getByTestId(
        `legend-${BenchmarkComparisonMethod.CIOverlappingReferenceValue99_8}`
      )
    ).toBeInTheDocument();
    expect(
      screen.getAllByTestId(`legend-${BenchmarkComparisonMethod.Quintiles}`)
    ).toHaveLength(2); // one for noJudgement, one for judgement
  });

  it('renders only 95 legend when others are absent', () => {
    const legendsToShow: BenchmarkLegendsToShow = {
      [BenchmarkComparisonMethod.CIOverlappingReferenceValue95]: {
        judgement: true,
        noJudgement: false,
      },
    };

    render(<BenchmarkLegendsSvg legendsToShow={legendsToShow} />);

    expect(
      screen.getByTestId(
        `legend-${BenchmarkComparisonMethod.CIOverlappingReferenceValue95}`
      )
    ).toBeInTheDocument();
    expect(
      screen.queryByTestId(
        `legend-${BenchmarkComparisonMethod.CIOverlappingReferenceValue99_8}`
      )
    ).not.toBeInTheDocument();
    expect(
      screen.queryAllByTestId(`legend-${BenchmarkComparisonMethod.Quintiles}`)
    ).toHaveLength(0);
  });

  it('does not render any groups if no flags are set', () => {
    render(<BenchmarkLegendsSvg legendsToShow={{}} />);
    expect(screen.queryAllByTestId(/legend-/)).toHaveLength(0);
  });
});

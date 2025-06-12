import { render, screen } from '@testing-library/react';
import { BenchmarkLegend } from '.';
import '@testing-library/jest-dom';
import {
  BenchmarkComparisonMethod,
  IndicatorPolarity,
} from '@/generated-sources/ft-api-client';
import { BenchmarkLegendsToShow } from '@/components/organisms/BenchmarkLegend/benchmarkLegend.types';
import { BenchmarkLegends } from '@/components/organisms/BenchmarkLegend/BenchmarkLegends';

describe('Testing the benchmark component', () => {
  it('Snapshot testing of the UI RAG 95', () => {
    const container = render(
      <BenchmarkLegend
        benchmarkComparisonMethod={
          BenchmarkComparisonMethod.CIOverlappingReferenceValue95
        }
        polarity={IndicatorPolarity.HighIsGood}
        title={'high is good'}
      />
    );
    expect(container.asFragment()).toMatchSnapshot();
  });

  it('Snapshot testing of the UI BOB 95', () => {
    const container = render(
      <BenchmarkLegend
        benchmarkComparisonMethod={
          BenchmarkComparisonMethod.CIOverlappingReferenceValue95
        }
        polarity={IndicatorPolarity.NoJudgement}
        title={'no judgement'}
      />
    );
    expect(container.asFragment()).toMatchSnapshot();
  });

  it('Snapshot testing of the UI RAG 99.8', () => {
    const container = render(
      <BenchmarkLegend
        benchmarkComparisonMethod={
          BenchmarkComparisonMethod.CIOverlappingReferenceValue99_8
        }
        polarity={IndicatorPolarity.LowIsGood}
        title={'low is good'}
      />
    );
    expect(container.asFragment()).toMatchSnapshot();
  });

  it('Snapshot testing of the UI BOB 99.8', () => {
    const container = render(
      <BenchmarkLegend
        benchmarkComparisonMethod={
          BenchmarkComparisonMethod.CIOverlappingReferenceValue99_8
        }
        polarity={IndicatorPolarity.NoJudgement}
        title={'NoJudgement'}
      />
    );
    expect(container.asFragment()).toMatchSnapshot();
  });

  it('Snapshot testing of the UI RAG quintiles', () => {
    const container = render(
      <BenchmarkLegend
        benchmarkComparisonMethod={BenchmarkComparisonMethod.Quintiles}
        polarity={IndicatorPolarity.LowIsGood}
        title={'low is good'}
      />
    );
    expect(container.asFragment()).toMatchSnapshot();
  });

  it('Snapshot testing of the UI BOB quintiles', () => {
    const container = render(
      <BenchmarkLegend
        benchmarkComparisonMethod={BenchmarkComparisonMethod.Quintiles}
        polarity={IndicatorPolarity.NoJudgement}
        title={'NoJudgement'}
      />
    );
    expect(container.asFragment()).toMatchSnapshot();
  });

  it('Snapshot testing of the legend with all items shown', () => {
    const container = render(<BenchmarkLegend title={'All'} />);
    expect(container.asFragment()).toMatchSnapshot();
  });

  describe('BenchmarkLegends', () => {
    describe('CI 95%', () => {
      it.each([
        [
          BenchmarkComparisonMethod.CIOverlappingReferenceValue95,
          true,
          false,
          /^BetterSimilarWorseNot compared$/,
        ],
        [
          BenchmarkComparisonMethod.CIOverlappingReferenceValue95,
          false,
          true,
          /^LowerSimilarHigherNot compared$/,
        ],
        [
          BenchmarkComparisonMethod.CIOverlappingReferenceValue95,
          true,
          true,
          /^BetterSimilarWorseNot comparedLowerHigher$/,
        ],
        [
          BenchmarkComparisonMethod.CIOverlappingReferenceValue99_8,
          true,
          false,
          /^BetterSimilarWorseNot compared$/,
        ],
        [
          BenchmarkComparisonMethod.CIOverlappingReferenceValue99_8,
          false,
          true,
          /^LowerSimilarHigherNot compared$/,
        ],
        [
          BenchmarkComparisonMethod.CIOverlappingReferenceValue99_8,
          true,
          true,
          /^BetterSimilarWorseNot comparedLowerHigher$/,
        ],
        [
          BenchmarkComparisonMethod.Quintiles,
          true,
          false,
          /^WorstWorseMiddleBetterBest$/,
        ],
        [
          BenchmarkComparisonMethod.Quintiles,
          false,
          true,
          /^LowestLowMiddleHighHighest$/,
        ],
      ])(
        'method: %s, judgement: %s, noJudgement: %s',
        (method, judgement, noJudgement, reg) => {
          const legendsToShow: BenchmarkLegendsToShow = {
            [method]: {
              judgement,
              noJudgement,
            },
          };

          render(<BenchmarkLegends legendsToShow={legendsToShow} />);

          expect(screen.getAllByRole('group')).toHaveLength(1);
          expect(screen.getByRole('group')).toHaveTextContent(reg);
        }
      );

      it('should render both quintiles', () => {
        const legendsToShow = {
          [BenchmarkComparisonMethod.Quintiles]: {
            judgement: true,
            noJudgement: true,
          },
        };
        render(<BenchmarkLegends legendsToShow={legendsToShow} />);
        const groups = screen.getAllByRole('group');
        expect(groups).toHaveLength(2);
        expect(groups[0]).toHaveTextContent(/^LowestLowMiddleHighHighest$/);
        expect(groups[1]).toHaveTextContent(/^WorstWorseMiddleBetterBest$/);
      });

      it('should render with bottom margin', () => {
        const legendsToShow = {
          [BenchmarkComparisonMethod.Quintiles]: {
            judgement: true,
            noJudgement: true,
          },
        };
        render(<BenchmarkLegends legendsToShow={legendsToShow} />);
        const div = screen.getByTestId('benchmarkLegend-component');
        expect(div).toHaveStyle({ marginBottom: '2em' });
      });

      it('should render without bottom margin', () => {
        const legendsToShow = {
          [BenchmarkComparisonMethod.Quintiles]: {
            judgement: true,
            noJudgement: true,
          },
        };
        render(
          <BenchmarkLegends
            legendsToShow={legendsToShow}
            bottomMargin={false}
          />
        );
        const div = screen.getByTestId('benchmarkLegend-component');
        expect(div).not.toHaveStyle({ marginBottom: '2em' });
      });
    });
  });
});

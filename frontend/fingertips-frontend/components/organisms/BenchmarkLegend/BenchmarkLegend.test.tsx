import { render } from '@testing-library/react';
import { BenchmarkLegend } from '.';
import '@testing-library/jest-dom';
import {
  BenchmarkComparisonMethod,
  IndicatorPolarity,
} from '@/generated-sources/ft-api-client';

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
});

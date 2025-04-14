import { generateBenchmarkComparisonData, InequalitiesBarChart } from '.';
import { render, screen } from '@testing-library/react';
import { getTestData } from './mocks';
import { InequalitiesTypes } from '@/components/organisms/Inequalities/inequalitiesHelpers';
import {
  BenchmarkComparisonMethod,
  BenchmarkOutcome,
  IndicatorPolarity,
} from '@/generated-sources/ft-api-client';

describe('Inequalities LineChart suite', () => {
  it('should render the expected elements', async () => {
    const yAxisLabel = 'YAxis';
    render(
      <InequalitiesBarChart
        barChartData={getTestData()}
        yAxisLabel={yAxisLabel}
        type={InequalitiesTypes.Deprivation}
        measurementUnit={'$'}
        benchmarkComparisonMethod={
          BenchmarkComparisonMethod.CIOverlappingReferenceValue95
        }
        polarity={IndicatorPolarity.NoJudgement}
      />
    );

    const barChart = await screen.findByTestId(
      'highcharts-react-component-inequalitiesBarChart'
    );

    expect(
      screen.getByTestId('inequalitiesBarChart-component')
    ).toBeInTheDocument();
    expect(screen.getByRole('checkbox')).toBeInTheDocument();
    expect(screen.getByText(/Show confidence intervals/i)).toBeInTheDocument();
    expect(barChart).toBeInTheDocument();
    expect(barChart).toHaveTextContent('Inequality type: Deprivation deciles');
    expect(barChart).toHaveTextContent(yAxisLabel);
    expect(barChart).toHaveTextContent('$');
    expect(
      screen.getByText('Compared to South FooBar for 2008 time period')
    ).toBeInTheDocument();
    expect(screen.getByText('Lower')).toBeInTheDocument();
    expect(screen.getByText('Higher')).toBeInTheDocument();
    expect(screen.getByText('Similar')).toBeInTheDocument();
  });

  it('should render the sex inequality variant with the expected changes', async () => {
    render(
      <InequalitiesBarChart
        barChartData={getTestData()}
        yAxisLabel={'Y Axis'}
        type={InequalitiesTypes.Sex}
        measurementUnit={'$'}
      />
    );

    const barChart = await screen.findByTestId(
      'highcharts-react-component-inequalitiesBarChart'
    );
    expect(barChart).toHaveTextContent('Inequality type: Sex');
  });

  describe('generateBenchmarkComparisonData', () => {
    test.each([
      [
        BenchmarkOutcome.Better,
        BenchmarkComparisonMethod.CIOverlappingReferenceValue95,
        95,
        'Better than England'
      ],
      [
        BenchmarkOutcome.Similar,
        BenchmarkComparisonMethod.CIOverlappingReferenceValue95,
        95,
        'Similar to England'
      ],
      [
        BenchmarkOutcome.NotCompared,
        BenchmarkComparisonMethod.CIOverlappingReferenceValue95,
        95,
        'Not compared'
      ],
      [
        BenchmarkOutcome.Worse,
        BenchmarkComparisonMethod.CIOverlappingReferenceValue99_8,
        99.8,
        'Worse than England'
      ],
      [
        BenchmarkOutcome.Similar,
        BenchmarkComparisonMethod.Unknown,
        0,
        'Similar to England'
      ]
    ])('returns a syntactically outcome label string and comparison method', (
      testOutcome,
      testBenchmarkComparisonMethod,
      expectedConfidenceLimitNumber,
      expectedOutcomeString
    ) => {
      const { mappedBenchmarkComparisonMethod, benchmarkOutcomeLabel } = generateBenchmarkComparisonData(
        testBenchmarkComparisonMethod,
        testOutcome
      );

      expect(mappedBenchmarkComparisonMethod).toBe(expectedConfidenceLimitNumber);
      expect(benchmarkOutcomeLabel).toBe(expectedOutcomeString);
    });
  });
});

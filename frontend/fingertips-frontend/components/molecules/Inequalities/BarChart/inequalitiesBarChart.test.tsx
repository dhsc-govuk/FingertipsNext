import { generateBenchmarkComparisonData, InequalitiesBarChart } from '.';
import { render, screen } from '@testing-library/react';
import { getTestData } from './mocks';
import { InequalitiesTypes } from '@/components/organisms/Inequalities/inequalitiesHelpers';
import {
  BenchmarkComparisonMethod,
  BenchmarkOutcome,
  IndicatorPolarity,
} from '@/generated-sources/ft-api-client';

describe('Inequalities BarChart suite', () => {
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
      screen.getByText('Compared to South FooBar persons for 2008 time period')
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
    const areaName = 'England';
    test.each([
      [
        BenchmarkOutcome.Better,
        areaName,
        BenchmarkComparisonMethod.CIOverlappingReferenceValue95,
        95,
        `Better than ${areaName}`,
      ],
      [
        BenchmarkOutcome.Similar,
        areaName,
        BenchmarkComparisonMethod.CIOverlappingReferenceValue95,
        95,
        `Similar to ${areaName}`,
      ],
      [
        BenchmarkOutcome.NotCompared,
        areaName,
        BenchmarkComparisonMethod.CIOverlappingReferenceValue95,
        95,
        'Not compared',
      ],
      [
        BenchmarkOutcome.Worse,
        areaName,
        BenchmarkComparisonMethod.CIOverlappingReferenceValue99_8,
        99.8,
        `Worse than ${areaName}`,
      ],
      [
        BenchmarkOutcome.Similar,
        areaName,
        BenchmarkComparisonMethod.Unknown,
        0,
        `Similar to ${areaName}`,
      ],
    ])(
      'returns a syntactically outcome label string and comparison method',
      (
        testOutcome,
        areaName,
        testBenchmarkComparisonMethod,
        expectedConfidenceLimitNumber,
        expectedOutcomeString
      ) => {
        const { mappedBenchmarkComparisonMethod, benchmarkOutcomeLabel } =
          generateBenchmarkComparisonData(
            testBenchmarkComparisonMethod,
            areaName,
            testOutcome
          );

        expect(mappedBenchmarkComparisonMethod).toBe(
          expectedConfidenceLimitNumber
        );
        expect(benchmarkOutcomeLabel).toBe(expectedOutcomeString);
      }
    );
  });
});

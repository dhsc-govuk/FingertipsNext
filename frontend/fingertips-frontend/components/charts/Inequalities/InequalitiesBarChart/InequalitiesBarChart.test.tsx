import { InequalitiesBarChart } from './InequalitiesBarChart';
import { render, screen, within } from '@testing-library/react';
import { getTestData } from './mocks';
import { InequalitiesTypes } from '@/components/charts/Inequalities/helpers/inequalitiesHelpers';
import {
  BenchmarkComparisonMethod,
  IndicatorPolarity,
} from '@/generated-sources/ft-api-client';

describe('Inequalities InequalitiesBarChart suite', () => {
  it('should render the expected elements', async () => {
    const yAxisLabel = 'YAxis';
    render(
      <InequalitiesBarChart
        title="inequalities for South FooBar, 2008"
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
      screen.getByText('inequalities for South FooBar, 2008')
    ).toBeInTheDocument();

    const benchmarkLegend = screen.getByTestId('benchmarkLegend-component');
    expect(within(benchmarkLegend).getByText('Lower')).toBeInTheDocument();
    expect(within(benchmarkLegend).getByText('Higher')).toBeInTheDocument();
    expect(within(benchmarkLegend).getByText('Similar')).toBeInTheDocument();

    expect(screen.getByRole('button')).toHaveTextContent('Export options');
  });

  it('should render the sex inequality variant with the expected changes', async () => {
    render(
      <InequalitiesBarChart
        title={'inequalities for South FooBar, 2008'}
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

  it('should render the data labels with value and benchmarkOutcome', async () => {
    render(
      <InequalitiesBarChart
        title={'inequalities for South FooBar, 2008'}
        barChartData={getTestData()}
        yAxisLabel={'Y Axis'}
        type={InequalitiesTypes.Sex}
        measurementUnit={'$'}
      />
    );

    const barChart = await screen.findByTestId(
      'highcharts-react-component-inequalitiesBarChart'
    );
    expect(barChart).toHaveTextContent('890.328253 - NotCompared');
  });
});

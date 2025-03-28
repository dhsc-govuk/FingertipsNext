import { InequalitiesBarChart } from '.';
import { render, screen } from '@testing-library/react';
import { getTestData } from './mocks';
import { InequalitiesTypes } from '@/components/organisms/Inequalities/inequalitiesHelpers';
import {
  BenchmarkComparisonMethod,
  IndicatorPolarity,
} from '@/generated-sources/ft-api-client';

describe('Inequalities LineChart suite', () => {
  it('should render the expected elements', async () => {
    const yAxisLabel = 'YAxis';
    render(
      <InequalitiesBarChart
        barChartData={getTestData()}
        yAxisLabel={yAxisLabel}
        type={InequalitiesTypes.Sex}
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
    expect(barChart).toHaveTextContent(`Inequality type: Sex`);
    expect(barChart).toHaveTextContent(yAxisLabel);
    expect(barChart).toHaveTextContent('$');
    expect(
      screen.getByText('Compared to South FooBar persons')
    ).toBeInTheDocument();
    expect(screen.getByText('Lower')).toBeInTheDocument();
    expect(screen.getByText('Higher')).toBeInTheDocument();
    expect(screen.getByText('Similar')).toBeInTheDocument();
  });
});

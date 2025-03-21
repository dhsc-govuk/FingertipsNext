import { InequalitiesBarChart } from '.';
import { render, screen } from '@testing-library/react';
import { expect } from '@jest/globals';
import { getTestData } from './mocks';
import { InequalitiesTypes } from '@/components/organisms/Inequalities/inequalitiesHelpers';

describe('Inequalities LineChart suite', () => {
  it('should render the expected elements', () => {
    const yAxisLabel = 'YAxis';
    render(
      <InequalitiesBarChart
        barChartData={getTestData()}
        yAxisLabel={yAxisLabel}
        type={InequalitiesTypes.Sex}
      />
    );

    const barChart = screen.getByTestId(
      'highcharts-react-component-inequalitiesBarChart'
    );

    expect(
      screen.getByTestId('inequalitiesBarChart-component')
    ).toBeInTheDocument();
    expect(barChart).toBeInTheDocument();
    expect(barChart).toHaveTextContent(`Inequality type: Sex`);
    expect(barChart).toHaveTextContent(yAxisLabel);
  });
});

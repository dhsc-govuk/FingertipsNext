import { InequalitiesLineChart } from '.';
import { render, screen } from '@testing-library/react';
import { expect } from '@jest/globals';
import { tableData } from './mocks';

describe('Inequalities LineChart suite', () => {
  it('should render the expected elements', () => {
    render(
      <InequalitiesLineChart
        lineChartData={tableData}
        dynamicKeys={['Persons', 'Male', 'Female']}
        areasSelected={['A1']}
      />
    );

    expect(
      screen.getByTestId('inequalitiesLineChart-component')
    ).toBeInTheDocument();
    expect(
      screen.getByTestId('highcharts-react-component-inequalitiesLineChart')
    ).toBeInTheDocument();
  });
});

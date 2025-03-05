import { InequalitiesLineChart } from '.';
import { render, screen } from '@testing-library/react';
import { expect } from '@jest/globals';
import { tableData } from './mocks';
import { GROUPED_YEAR_DATA } from '@/lib/tableHelpers/mocks';

describe('Inequalities LineChart suite', () => {
  it('should render the expected elements', () => {
    render(
      <InequalitiesLineChart
        lineChartData={tableData}
        yearlyHealthDataGroupedByInequalities={GROUPED_YEAR_DATA}
        areasSelected={['A1']}
      />
    );

    expect(
      screen.getByTestId('inequalitiesLineChart-component')
    ).toBeInTheDocument();
    expect(
      screen.getByTestId(
        'highcharts-react-component-inequalitiesLineChartTable'
      )
    ).toBeInTheDocument();
  });
});

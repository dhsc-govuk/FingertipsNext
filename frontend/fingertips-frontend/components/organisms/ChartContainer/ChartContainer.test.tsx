import { render, screen } from '@testing-library/react';
import { ChartContainer } from '.';
describe('ChartContainer', () => {
  jest.mock('@/components/organisms/LineChart/', () => {
    return {
      LineChart: function LineChart() {
        return <div data-testid="lineChart-component"></div>;
      },
    };
  });

  jest.mock('@/components/organisms/LineChartTable/', () => {
    return {
      LineChartTable: function LineChartTable() {
        return <div data-testid="lineChartTable-component"></div>;
      },
    };
  });

  it('must default to having the line chart tab selected', () => {
    render(<ChartContainer healthIndicatorData={[]} />);

    expect(screen.getByRole('button', { name: 'Line Chart' })).toHaveProperty(
      'selected'
    );
  });

  it('must show line chart and hide table when line chart tab is selected', () => {
    render(<ChartContainer healthIndicatorData={[]} />);
  });
});

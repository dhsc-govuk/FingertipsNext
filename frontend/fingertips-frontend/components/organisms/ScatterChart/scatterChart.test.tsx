import { ScatterChart } from '@/components/organisms/ScatterChart/index';
import { render, screen } from '@testing-library/react';
import { mockHealthData } from '@/mock/data/healthdata';
import { expect } from '@jest/globals';

it('should render the Highcharts react component with the passed axis and subtitle parameters', () => {
  const yAxisPropsTitle = 'DifferentYTitle';
  const xAxisPropsTitle = 'DifferentXTitle';
  const yAxisSubtitle = 'DifferentXSubtitle';
  const xAxisSubtitle = 'DifferentXSubtitle';

  render(
    <ScatterChart
      data={[mockHealthData[1]]}
      yAxisTitle={yAxisPropsTitle}
      xAxisTitle={xAxisPropsTitle}
      yAxisSubtitle={yAxisSubtitle}
      xAxisSubtitle={xAxisSubtitle}
    />
  );

  const highcharts = screen.getByTestId('highcharts-react-component');

  expect(highcharts).toBeInTheDocument();
  expect(highcharts).toHaveTextContent(yAxisPropsTitle);
});

it('should render the ScatterChart title', () => {
  render(
    <ScatterChart
      data={[mockHealthData[1]]}
      ScatterChartTitle="Compare indicators within the area group"
    />
  );

  const title = screen.getByRole('heading', { level: 3 });

  expect(title).toHaveTextContent('Compare indicators within the area group');
});

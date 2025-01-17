import { render, screen } from '@testing-library/react';
import { expect } from '@jest/globals';
import { mockHealthData } from '@/mock/data/healthdata';
import { BarChart } from '@/components/organisms/BarChart/index';

it('should render the Highcharts react component with passed parameters within the BarChart component', async () => {
  const yAxisPropsTitle = 'DifferentYTitle';
  const benchmarkPropsLabel = 'PassedBenchmarkLabel';
  const benchmarkPropsValue = 1831;

  render(
    <BarChart
      data={mockHealthData}
      yAxisTitle={yAxisPropsTitle}
      benchmarkLabel={benchmarkPropsLabel}
      benchmarkValue={benchmarkPropsValue}
    />
  );

  const highcharts = screen.getByTestId('highcharts-react-component');

  expect(highcharts).toBeInTheDocument();
  expect(highcharts).toHaveTextContent(yAxisPropsTitle);
  // await waitFor(() => {
  //   expect(highcharts).toHaveTextContent(benchmarkPropsLabel);
  // });
  // expect(highcharts).toHaveTextContent(benchmarkPropsValue.toString());
});

it('should render the BarChart title', () => {
  render(<BarChart data={mockHealthData} />);

  const title = screen.getByRole('heading', { level: 3 });

  expect(title).toHaveTextContent(
    'See how inequalities vary for a single period in time'
  );
});

import { render, screen } from '@testing-library/react';
import { expect } from '@jest/globals';
import { mockHealthData } from '@/mock/data/healthdata';
import { BarChart } from '@/components/organisms/BarChart/index';

it('should render the Highcharts react component with passed yAxisPropsTitle parameter', () => {
  const yAxisPropsTitle = 'DifferentYTitle';

  render(<BarChart data={mockHealthData[1]} yAxisTitle={yAxisPropsTitle} />);

  const highcharts = screen.getByTestId('highcharts-react-component-barChart');

  expect(highcharts).toBeInTheDocument();
  expect(highcharts).toHaveTextContent(yAxisPropsTitle);
});

it('should render the BarChart title', () => {
  render(<BarChart data={mockHealthData[1]} />);

  const title = screen.getByRole('heading', { level: 3 });

  expect(title).toHaveTextContent(
    'See how inequalities vary for a single period in time'
  );
});

import { render, screen } from '@testing-library/react';
import { LineChart } from '@/components/organisms/LineChart/index';
import { expect } from '@jest/globals';
import { mockHealthData } from '@/mock/data/healthdata';

it('should render the Highcharts react component with passed parameters within the LineChart component', () => {
  const xAxisPropsTitle = 'DifferentXTitle';
  render(
    <LineChart data={mockHealthData[1]} xAxisTitle={`${xAxisPropsTitle}`} />
  );

  const highcharts = screen.getByTestId('highcharts-react-component');

  expect(highcharts).toBeInTheDocument();
  expect(highcharts).toHaveTextContent(xAxisPropsTitle);
});

it('should render the LineChart title', () => {
  render(<LineChart data={mockHealthData[1]} />);

  const title = screen.getByRole('heading', { level: 3 });

  expect(title).toHaveTextContent(
    'See how the indicator has changed over time for the area'
  );
});

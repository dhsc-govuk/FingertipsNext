import { render, screen } from '@testing-library/react';
import { LineChart } from '@/components/organisms/LineChart/index';
import { expect } from '@jest/globals';
import { mockHealthData } from '@/mock/data/healthdata';

it('should render the Highcharts react component within the LineChart component', () => {
  render(<LineChart data={mockHealthData[1]} />);
  const highcharts = screen.getByTestId('highcharts-react-component');
  expect(highcharts).toBeInTheDocument();
});

it('should render the LineChart title', () => {
  render(<LineChart data={mockHealthData[1]} />);
  const title = screen.getByRole('heading', { level: 3 });
  expect(title).toHaveTextContent(
    'See how the indicator has changed over time for the area'
  );
});

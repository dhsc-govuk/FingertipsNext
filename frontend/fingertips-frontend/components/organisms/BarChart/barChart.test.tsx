import { render, screen } from '@testing-library/react';
import { expect } from '@jest/globals';
import { mockHealthData } from '@/mock/data/healthdata';
import { BarChart } from '@/components/organisms/BarChart/index';

it('should render the Highcharts react component within the BarChart component ', () => {
  render(<BarChart data={mockHealthData} />);
  const highcharts = screen.getByTestId('highcharts-react-component');
  expect(highcharts).toBeInTheDocument();
});

it('should render the BarChart title', () => {
  render(<BarChart data={mockHealthData} />);
  const title = screen.getByRole('heading', { level: 3 });
  expect(title).toHaveTextContent(
    'See how inequalities vary for a single period in time'
  );
});

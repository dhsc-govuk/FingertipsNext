import { render, screen } from '@testing-library/react';
import { expect } from '@jest/globals';
import { mockHealthData } from '@/mock/data/healthdata';
import { Bar } from '@/components/pages/barChart/index';

test('should render the BarChart component', () => {
  render(<Bar data={mockHealthData} />);
  const barChart = screen.getByTestId('barChart-component');
  expect(barChart).toBeInTheDocument();
});

test('should render the BarChart component title', () => {
  render(<Bar data={mockHealthData} />);
  const HTag = screen.getByRole('heading', { level: 3 });
  expect(HTag).toHaveTextContent(
    'See how inequalities vary for a single period in time for the area'
  );
});

test('should render the BarChartTable component', () => {
  render(<Bar data={mockHealthData} />);

  const table = screen.getByRole('table');
  expect(table).toBeInTheDocument();
});

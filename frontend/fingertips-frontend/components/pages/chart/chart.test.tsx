import { render, screen } from '@testing-library/react';
import { Chart } from '@/components/pages/chart/index';
import { expect } from '@jest/globals';
import { mockHealthData } from '@/mock/data/healthdata';

it('should render the backLink', () => {
  render(
    <Chart
      data={mockHealthData}
      indicator="test"
      indicatorsSelected={['1', '2']}
    />
  );

  expect(screen.getByRole('link', { name: /back/i })).toBeInTheDocument();
  expect(screen.getByRole('link', { name: /back/i }).getAttribute('href')).toBe(
    '/search/results?indicator=test&indicatorsSelected=1%2C2'
  );
});

it('should render the LineChart component', () => {
  render(<Chart data={mockHealthData} />);
  const lineChart = screen.getByTestId('lineChart-component');
  expect(lineChart).toBeInTheDocument();
});

it('should render the Chart component title', () => {
  render(<Chart data={mockHealthData} />);

  const HTag = screen.getByRole('heading', { level: 3 });
  expect(HTag).toHaveTextContent(
    'See how the indicator has changed over time for the area'
  );
});

it('should render the LineChartTable component', () => {
  render(<Chart data={mockHealthData} />);

  const table = screen.getByRole('table');
  expect(table).toBeInTheDocument();
});

it('should render the BarChart component', () => {
  render(<Chart data={mockHealthData} />);
  const barChart = screen.getByTestId('barChart-component');
  expect(barChart).toBeInTheDocument();
});

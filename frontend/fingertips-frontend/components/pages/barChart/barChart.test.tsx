import { render, screen } from '@testing-library/react';
import { expect } from '@jest/globals';
import { registryWrapper } from '@/lib/testutils';
import { mockHealthData } from '@/mock/data/healthdata';
import { Bar } from '@/components/pages/barChart/index';

test('should render the BarChart component', () => {
  render(registryWrapper(<Bar data={mockHealthData} />));
  const barChart = screen.getByTestId('barChart-component');
  expect(barChart).toBeInTheDocument();
});

test('should render the BarChart component title', () => {
  render(registryWrapper(<Bar data={mockHealthData} />));
  const HTag = screen.getByRole('heading', { level: 1 });
  expect(HTag).toHaveTextContent('Bar Chart');
});

test('should render the BarChartTable component', () => {
  render(registryWrapper(<Bar data={mockHealthData} />));

  const table = screen.getByRole('table');
  expect(table).toBeInTheDocument();
});

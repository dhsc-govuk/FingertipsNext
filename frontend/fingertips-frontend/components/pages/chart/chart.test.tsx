import { render, screen } from '@testing-library/react';
import { Chart } from '@/components/pages/chart/index';
import { expect } from '@jest/globals';
import { registryWrapper } from '@/lib/testutils';
import { mockHealthData } from '@/mock/data/healthdata';

test('should render the LineChart component', () => {
  render(registryWrapper(<Chart data={mockHealthData} />));
  const lineChart = screen.getByTestId('lineChart-component');
  expect(lineChart).toBeInTheDocument();
});

test('should render the LineChart component title', () => {
  render(registryWrapper(<Chart data={mockHealthData} />));

  const lineChartTitle = screen.getByText('Line Chart');
  expect(lineChartTitle).toBeInTheDocument();
});

test('should render the LineChartTable component', () => {
  render(registryWrapper(<Chart data={mockHealthData} />));

  const table = screen.getByRole('table');
  expect(table).toBeInTheDocument();
});

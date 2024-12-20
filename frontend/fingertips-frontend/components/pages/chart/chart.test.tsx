import { render, screen } from '@testing-library/react';
import { Chart } from '@/components/pages/chart/index';
import { expect } from '@jest/globals';
import { WeatherForecast } from '@/generated-sources/api-client';
import { registryWrapper } from '@/lib/testutils';

const mockData: WeatherForecast[] = [
  {
    date: new Date('2024-11-01T00:00:00.000Z'),
    temperatureC: -30,
    temperatureF: -21,
    summary: 'Freezing',
  },
  {
    date: new Date('2024-11-01T00:00:00.000Z'),
    temperatureC: 0,
    temperatureF: 32,
    summary: 'Bracing',
  },
];

test('should render the LineChart component', () => {
  render(registryWrapper(<Chart data={mockData} />));
  const lineChart = screen.getByTestId('lineChart-component');
  expect(lineChart).toBeInTheDocument();
});

test('should render the LineChart component title', () => {
  render(registryWrapper(<Chart data={mockData} />));

  const lineChartTitle = screen.getByText('Line Chart');
  expect(lineChartTitle).toBeInTheDocument();
});

test('should render the LineChartTable component', () => {
  render(registryWrapper(<Chart data={mockData} />));

  const table = screen.getByRole('table');
  expect(table).toBeInTheDocument();
});

import { render, screen } from '@testing-library/react';
import { Chart } from '@/components/pages/chart/index';
import { expect } from '@jest/globals';
import { WeatherForecast } from '@/generated-sources/api-client';

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

it('should render the backLink', () => {
  render(
    <Chart data={mockData} indicator="test" indicatorsSelected={['1', '2']} />
  );

  expect(screen.getByRole('link', { name: /back/i })).toBeInTheDocument();
  expect(screen.getByRole('link', { name: /back/i }).getAttribute('href')).toBe(
    '/search/results?indicator=test&indicatorsSelected=1%2C2'
  );
});

it('should render the LineChart component', () => {
  render(<Chart data={mockData} />);
  const lineChart = screen.getByTestId('lineChart-component');
  expect(lineChart).toBeInTheDocument();
});

it('should render the LineChart component title', () => {
  render(<Chart data={mockData} />);

  const lineChartTitle = screen.getByText('Line Chart');
  expect(lineChartTitle).toBeInTheDocument();
});

it('should render the LineChartTable component', () => {
  render(<Chart data={mockData} />);

  const table = screen.getByRole('table');
  expect(table).toBeInTheDocument();
});

import { render, screen } from '@testing-library/react';
import { Chart } from '@/components/pages/chart/index';
import { expect } from '@jest/globals';
import {WeatherForecast} from "@/generated-sources/api-client";

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

test('snapshot test - should render the chart', () => {
  const container = render(<Chart data={mockData} />);

  expect(container.asFragment()).toMatchSnapshot();
});

test('should render the LineChart component with the correct props', () => {
  render(<Chart data={mockData} />);
  
  const lineChartTitle = screen.getByText('Line Chart');
  expect(lineChartTitle).toBeInTheDocument();
});

test('should render the PlainTable component', () => {
  render(<Chart data={mockData} />);
  
  const table = screen.getByRole('table');
  expect(table).toBeInTheDocument();
});

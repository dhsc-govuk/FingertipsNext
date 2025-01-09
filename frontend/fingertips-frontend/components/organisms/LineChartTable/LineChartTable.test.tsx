import { render, screen } from '@testing-library/react';

import { expect } from '@jest/globals';
import { WeatherForecast } from '@/generated-sources/api-client';
import { LineChartTable } from '@/components/organisms/LineChartTable';

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

const mockHeadings = ['Date', 'TemperatureC', 'TemperatureF', 'Summary'];

it('snapshot test - should match snapshot', () => {
  const container = render(
    <LineChartTable data={mockData} headings={mockHeadings} />
  );
  expect(container.asFragment()).toMatchSnapshot();
});

test('should render the LineChartTable component', () => {
  render(<LineChartTable data={mockData} headings={mockHeadings} />);
  const lineChart = screen.getByTestId('lineChartTable-component');
  expect(lineChart).toBeInTheDocument();
});

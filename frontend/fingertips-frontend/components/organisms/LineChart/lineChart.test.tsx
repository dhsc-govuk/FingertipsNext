import { render, screen } from '@testing-library/react';
import { LineChart } from '@/components/organisms/LineChart/index';
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

test('should render the Highcharts react component', () => {
  render(<LineChart data={mockData} />);
  const highcharts = screen.getByTestId('highcharts-react-component');
  expect(highcharts).toBeInTheDocument();
});

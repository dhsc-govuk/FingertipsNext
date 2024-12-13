import { render, screen } from '@testing-library/react';
import { LineChart } from '@/components/pages/chart/index';
import { expect } from '@jest/globals';

const mockData = [
  {
    date: '2024-11-01',
    temperatureC: -30,
    temperatureF: -21,
    summary: 'Freezing',
  },
  {
    date: '2024-11-01',
    temperatureC: 0,
    temperatureF: 32,
    summary: 'Bracing',
  },
];

test('snapshot test - should render the chart', () => {
  const container = render(<LineChart data={mockData} />);

  expect(container.asFragment()).toMatchSnapshot();
});

test('should render the HighchartsReact component', () => {
  render(<LineChart data={mockData} />);

  expect(screen.getByTestId('highcharts-react-component')).toBeInTheDocument();
});

test('should pass the options to highcharts', () => {
  render(<LineChart data={mockData} />);

  const chart = screen.getByTestId('highcharts-react-component');
  expect(chart).toHaveTextContent('Weather Forecast');
  expect(chart).toHaveTextContent('Temperature (°C)');
});

test('should fallback to noscript table when JavaScript is disabled', () => {
  render(<LineChart data={mockData} />);

  expect(screen.getByTestId('noscript-table')).toBeInTheDocument();
});

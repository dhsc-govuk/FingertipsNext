import { render, screen } from '@testing-library/react';
import { LineChart } from '@/components/organisms/LineChart/index';
import { expect } from '@jest/globals';
import { registryWrapper } from '@/lib/testutils';
import { mockHealthData } from '@/mock/data/healthdata';

test('should render the Highcharts react component', () => {
  render(registryWrapper(<LineChart data={mockHealthData} />));
  const highcharts = screen.getByTestId('highcharts-react-component');
  expect(highcharts).toBeInTheDocument();
});

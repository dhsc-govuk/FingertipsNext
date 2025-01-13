import { render, screen } from '@testing-library/react';
import { expect } from '@jest/globals';
import { registryWrapper } from '@/lib/testutils';
import { mockHealthData } from '@/mock/data/healthdata';
import { BarChart } from '@/components/organisms/BarChart/index';

test('should render the Highcharts react component within the BarChart component ', () => {
  render(registryWrapper(<BarChart data={mockHealthData} />));
  const highcharts = screen.getByTestId('highcharts-react-component');
  expect(highcharts).toBeInTheDocument();
});

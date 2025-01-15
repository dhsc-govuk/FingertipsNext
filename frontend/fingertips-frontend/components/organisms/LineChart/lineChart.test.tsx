import { render, screen } from '@testing-library/react';
import { LineChart } from '@/components/organisms/LineChart/index';
import { expect } from '@jest/globals';
import { mockHealthData } from '@/mock/data/healthdata';

test('should render the Highcharts react component within the LineChart component', () => {
  render(<LineChart data={mockHealthData} />);
  const highcharts = screen.getByTestId('highcharts-react-component');
  expect(highcharts).toBeInTheDocument();
});

it('should render the line chart title', () => {
  render(
    <LineChart
      LineChartTitle={'VALID line chart title'}
      data={mockHealthData}
    />
  );
  const HTag = screen.getByRole('heading', { level: 4 });
  expect(HTag).toHaveTextContent('VALID line chart title');
});

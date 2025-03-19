import { render, screen, waitFor } from '@testing-library/react';
import { LineChart } from '@/components/organisms/LineChart/index';
import { expect } from '@jest/globals';
import { lineChartDefaultOptions } from './lineChartHelpers';

it('should render the Highcharts react component with passed parameters within the LineChart component', async () => {
  render(
    <LineChart
      lineChartOptions={lineChartDefaultOptions}
      confidenceIntervalSelected={false}
      setConfidenceIntervalSelected={jest.fn()}
    />
  );

  const highcharts = await screen.findByTestId(
    'highcharts-react-component-lineChart'
  );

  await waitFor(() => {
    expect(highcharts).toBeInTheDocument();
  });
});

it('should validate the checkbox is checked when passed the correct parameter of lineChart', async () => {
  render(
    <LineChart
      lineChartOptions={lineChartDefaultOptions}
      confidenceIntervalSelected={true}
      setConfidenceIntervalSelected={jest.fn()}
    />
  );

  expect(await screen.findByRole('checkbox')).toBeChecked();
});

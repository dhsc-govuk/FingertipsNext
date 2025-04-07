import { render, screen, waitFor } from '@testing-library/react';
import { LineChart } from '@/components/organisms/LineChart/index';
import { expect } from '@jest/globals';
import { lineChartDefaultOptions, LineChartVariant } from './lineChartHelpers';

it('should render the Highcharts react component with passed parameters within the LineChart component', async () => {
  render(
    <LineChart
      lineChartOptions={lineChartDefaultOptions}
      showConfidenceIntervalsData={false}
      setShowConfidenceIntervalsData={jest.fn()}
      variant={LineChartVariant.Standard}
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
      showConfidenceIntervalsData={true}
      setShowConfidenceIntervalsData={jest.fn()}
      variant={LineChartVariant.Standard}
    />
  );

  expect(await screen.findByRole('checkbox')).toBeChecked();
});

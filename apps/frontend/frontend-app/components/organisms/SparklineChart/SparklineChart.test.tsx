import { render, screen } from '@testing-library/react';
import { SparklineChart } from '@/components/organisms/SparklineChart/index';
import { expect } from '@jest/globals';

describe('SparklineChart', () => {
  const mockValue = [48];
  const maxValue = 100;
  it('Should render the highcharts react component', async () => {
    render(
      <SparklineChart
        value={mockValue}
        maxValue={maxValue}
        confidenceIntervalValues={[5, 10]}
        showConfidenceIntervalsData={true}
        label={'mock'}
        area={'mockArea'}
        year={2000}
        measurementUnit={''}
      />
    );

    expect(
      await screen.findByTestId(
        'highcharts-react-component-barChartEmbeddedTable'
      )
    ).toBeInTheDocument();
  });
});

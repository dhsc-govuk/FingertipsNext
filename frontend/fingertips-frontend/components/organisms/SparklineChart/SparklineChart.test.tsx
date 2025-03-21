import { render, screen } from '@testing-library/react';
import { SparklineChart } from '@/components/organisms/SparklineChart/index';
import { expect } from '@jest/globals';

describe('SparklineChart', () => {
  it('Should render the highcharts react component', async () => {
    const mockValue = [48];
    const maxValue = 100;
    render(
      <SparklineChart
        value={mockValue}
        maxValue={maxValue}
        errorBarValues={[5, 10]}
        showConfidenceIntervalsData={false}
      />
    );

    expect(
      await screen.findByTestId(
        'highcharts-react-component-barChartEmbeddedTable'
      )
    ).toBeInTheDocument();
  });
});

import { render, screen } from '@testing-library/react';
import { SparklineChart } from '@/components/organisms/SparklineChart/index';
import { expect } from '@jest/globals';

describe('SparklineChart', () => {
  it('Should render the highcharts react component', () => {
    const mockValue = 48;
    const maxValue = 100;
    render(<SparklineChart value={mockValue} maxValue={maxValue} />);

    expect(
      screen.getByTestId('highcharts-react-component-barChartEmbeddedTable')
    ).toBeInTheDocument();
  });
});

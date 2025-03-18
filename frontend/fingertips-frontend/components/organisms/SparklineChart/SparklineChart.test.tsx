import { render, screen } from '@testing-library/react';
import { SparklineChart } from '@/components/organisms/SparklineChart/index';
import { expect } from '@jest/globals';

describe('SparklineChart', () => {
  it('Should render the highcharts react component', () => {
    const mockValue = 48;
    render(<SparklineChart value={mockValue} />);

    expect(
      screen.getByTestId('highcharts-react-component-barChartEmbeddedTable')
    ).toBeInTheDocument();
  });
});

import {
  IndicatorPolarity,
  QuartileData,
} from '@/generated-sources/ft-api-client';
import { SpineChart } from '.';
import { render, screen } from '@testing-library/react';
import { expect } from '@jest/globals';

describe('Spine chart', () => {
  const mockValue = 690.305692;
  const mockQuartileData: QuartileData = {
    polarity: IndicatorPolarity.HighIsGood,
    q0Value: 1666,
    q1Value: 1000,
    q3Value: 969,
    q4Value: 959,
  };

  it('should render the SpineChart component', () => {
    render(<SpineChart value={mockValue} quartileData={mockQuartileData} />);

    const spineChartComponent = screen.getByTestId('spineChart-component');
    expect(spineChartComponent).toBeInTheDocument();

    const highChartChartComponent = screen.getByTestId(
      'highcharts-react-component-spineChart'
    );
    expect(highChartChartComponent).toBeInTheDocument();
  });
});

import { render, screen } from '@testing-library/react';
import {
  benchmarkTextForBar,
  SparklineChart,
} from '@/components/organisms/SparklineChart/index';

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

  describe('benchmarkTextForBar', () => {
    it('should return an empty string when the area is England', () => {
      const result = benchmarkTextForBar(
        'England',
        'NotCompared',
        'CIOverlappingReferenceValue95'
      );
      expect(result).toBe('');
    });

    it('should return quintile text for quintiles', () => {
      const result = benchmarkTextForBar('Area1', 'Middle', 'Quintiles');
      expect(result).toBe('Middle quintile');
    });

    it('should return benchmark label text for other methods', () => {
      const result = benchmarkTextForBar(
        'Area1',
        'Better',
        'CIOverlappingReferenceValue95'
      );
      expect(result).toBe('Better');
    });
  });
});

import { render, screen } from '@testing-library/react';
import { expect } from '@jest/globals';
import { SpineChartTableRow } from './SpineChartTableRow';
import { GovukColours } from '@/lib/styleHelpers/colours';

describe('Spine chart table suite', () => {
  const mockRowData = {
    indicatorId: 1,
    indicator: 'indicator',
    unit: '%',
    period: 2025,
    count: 123,
    value: 456,
    groupValue: 789,
    benchmarkValue: 987,
    benchmarkWorst: 345,
    benchmarkBest: 999,
  };

  describe('Spine chart table row', () => {
    it('should have grey cell color for benchmark column', () => {
      render(
        <table>
          <tbody>
            <SpineChartTableRow
              indicatorId={mockRowData.indicatorId}
              indicator={mockRowData.indicator}
              unit={mockRowData.unit}
              period={mockRowData.period}
              count={mockRowData.count}
              value={mockRowData.value}
              groupValue={mockRowData.groupValue}
              benchmarkValue={mockRowData.benchmarkValue}
              benchmarkWorst={mockRowData.benchmarkWorst}
              benchmarkBest={mockRowData.benchmarkBest}
            />
          </tbody>
        </table>
      );

      expect(screen.getByTestId('benchmark-value-cell')).toHaveStyle(
        `background-color: ${GovukColours.MidGrey}`
      );
      expect(screen.getByTestId('benchmark-worst-cell')).toHaveStyle(
        `background-color: ${GovukColours.MidGrey}`
      );
      expect(screen.getByTestId('benchmark-best-cell')).toHaveStyle(
        `background-color: ${GovukColours.MidGrey}`
      );
    });

    it('should have light grey cell color for benchmark column', () => {
      render(
        <SpineChartTableRow
          indicatorId={mockRowData.indicatorId}
          indicator={mockRowData.indicator}
          unit={mockRowData.unit}
          period={mockRowData.period}
          count={mockRowData.count}
          value={mockRowData.value}
          groupValue={mockRowData.groupValue}
          benchmarkValue={mockRowData.benchmarkValue}
          benchmarkWorst={mockRowData.benchmarkWorst}
          benchmarkBest={mockRowData.benchmarkBest}
        />
      );

      expect(screen.getByTestId('group-value-cell')).toHaveStyle(
        `background-color: ${GovukColours.LightGrey}`
      );
    });

    it('should have X for missing data', () => {
      render(
        <SpineChartTableRow
          indicatorId={mockRowData.indicatorId}
          indicator={mockRowData.indicator}
          unit={mockRowData.unit}
          period={mockRowData.period}
          count={undefined}
          value={undefined}
          groupValue={undefined}
          benchmarkValue={undefined}
          benchmarkWorst={mockRowData.benchmarkWorst}
          benchmarkBest={mockRowData.benchmarkBest}
        />
      );

      expect(screen.getByTestId('count-cell')).toHaveTextContent(`X`);

      expect(screen.getByTestId('value-cell')).toHaveTextContent(`X`);

      expect(screen.getByTestId('group-value-cell')).toHaveTextContent(`X`);

      expect(screen.getByTestId('benchmark-value-cell')).toHaveTextContent(`X`);
    });
  });
});

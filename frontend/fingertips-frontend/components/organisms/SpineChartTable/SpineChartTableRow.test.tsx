import { render, screen } from '@testing-library/react';
import { expect } from '@jest/globals';
import { SpineChartTableRow } from './SpineChartTableRow';
import { GovukColours } from '@/lib/styleHelpers/colours';
import {
  HealthDataPointTrendEnum,
  IndicatorPolarity,
} from '@/generated-sources/ft-api-client';

describe('Spine chart table row', () => {
  const mockRowData = {
    indicatorId: 1,
    indicator: 'indicator',
    unit: '%',
    period: 2025,
    trend: HealthDataPointTrendEnum.Decreasing,
    areaOneCount: 123,
    areaTwoCount: 456,
    areaOneValue: 12.3,
    areaTwoValue: 45.6,
    groupValue: 789,
    benchmarkValue: 987,
    benchmarkStatistics: {
      polarity: IndicatorPolarity.HighIsGood,
      q0Value: 999,
      q1Value: 760,
      q3Value: 500,
      q4Value: 345,
    },
  };

  it('should have dark grey cell color for benchmark column', () => {
    render(
      <table>
        <tbody>
          <SpineChartTableRow
            indicatorId={mockRowData.indicatorId}
            indicator={mockRowData.indicator}
            unit={mockRowData.unit}
            period={mockRowData.period}
            trend={mockRowData.trend}
            areaOneCount={mockRowData.areaOneCount}
            areaOneValue={mockRowData.areaOneValue}
            groupValue={mockRowData.groupValue}
            benchmarkValue={mockRowData.benchmarkValue}
            benchmarkStatistics={mockRowData.benchmarkStatistics}
            twoAreasRequested={false}
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

  it('should have mid grey cell color for benchmark column', () => {
    render(
      <table>
        <tbody>
          <SpineChartTableRow
            indicatorId={mockRowData.indicatorId}
            indicator={mockRowData.indicator}
            unit={mockRowData.unit}
            period={mockRowData.period}
            trend={mockRowData.trend}
            areaOneCount={mockRowData.areaOneCount}
            areaOneValue={mockRowData.areaOneValue}
            groupValue={mockRowData.groupValue}
            benchmarkValue={mockRowData.benchmarkValue}
            benchmarkStatistics={mockRowData.benchmarkStatistics}
            twoAreasRequested={false}
          />
        </tbody>
      </table>
    );

    expect(screen.getByTestId('group-value-cell')).toHaveStyle(
      `background-color: ${GovukColours.LightGrey}`
    );
  });

  it('should have X for missing data', () => {
    render(
      <table>
        <tbody>
          <SpineChartTableRow
            indicatorId={mockRowData.indicatorId}
            indicator={mockRowData.indicator}
            unit={mockRowData.unit}
            period={mockRowData.period}
            trend={mockRowData.trend}
            areaOneCount={undefined}
            areaOneValue={undefined}
            groupValue={undefined}
            benchmarkValue={undefined}
            benchmarkStatistics={mockRowData.benchmarkStatistics}
            twoAreasRequested={false}
          />
        </tbody>
      </table>
    );

    expect(screen.getByTestId('count-cell')).toHaveTextContent(`X`);

    expect(screen.getByTestId('value-cell')).toHaveTextContent(`X`);

    expect(screen.getByTestId('group-value-cell')).toHaveTextContent(`X`);

    expect(screen.getByTestId('benchmark-value-cell')).toHaveTextContent(`X`);
  });

  it('should have an additional count and value section when an 2 areas are requested', () => {
    render(
      <table>
        <tbody>
          <SpineChartTableRow
            indicatorId={mockRowData.indicatorId}
            indicator={mockRowData.indicator}
            unit={mockRowData.unit}
            period={mockRowData.period}
            trend={mockRowData.trend}
            areaOneCount={mockRowData.areaOneCount}
            areaOneValue={mockRowData.areaOneValue}
            areaTwoCount={mockRowData.areaTwoCount}
            areaTwoValue={mockRowData.areaTwoValue}
            groupValue={mockRowData.groupValue}
            benchmarkValue={mockRowData.benchmarkValue}
            benchmarkStatistics={mockRowData.benchmarkStatistics}
            twoAreasRequested={true}
          />
        </tbody>
      </table>
    );

    expect(screen.getByTestId('area-1-count-cell')).toHaveTextContent('123');
    expect(screen.getByTestId('area-1-value-cell')).toHaveTextContent('12.3');
    expect(screen.getByTestId('area-2-count-cell')).toHaveTextContent('456');
    expect(screen.getByTestId('area-2-value-cell')).toHaveTextContent('45.6');

    // Trend cell should not be displayed when 2 areas selected
    expect(screen.queryByTestId('trend-cell')).not.toBeInTheDocument();
  });
});

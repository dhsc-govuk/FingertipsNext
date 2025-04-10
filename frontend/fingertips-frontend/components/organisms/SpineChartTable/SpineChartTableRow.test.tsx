import { render, screen } from '@testing-library/react';
import { expect } from '@jest/globals';
import { SpineChartTableRow } from './SpineChartTableRow';
import { GovukColours } from '@/lib/styleHelpers/colours';
import {
  BenchmarkComparisonMethod,
  BenchmarkOutcome,
  HealthDataPointTrendEnum,
  IndicatorPolarity,
} from '@/generated-sources/ft-api-client';
import { SpineChartIndicatorData } from './spineChartTableHelpers';
import { allAgesAge, noDeprivation, personsSex } from '@/lib/mocks';

describe('Spine chart table row', () => {
  const mockIndicatorData: SpineChartIndicatorData = {
    indicatorId: '1',
    indicatorName: 'indicator',
    latestDataPeriod: 2025,
    valueUnit: '%',
    benchmarkComparisonMethod:
      BenchmarkComparisonMethod.CIOverlappingReferenceValue95,
    areasHealthData: [
      {
        areaCode: 'A1425',
        areaName: 'Greater Manchester ICB - 00T',
        healthData: [
          {
            year: 2025,
            count: 222,
            value: 690.305692,
            lowerCi: 341.69151,
            upperCi: 478.32766,
            ageBand: allAgesAge,
            sex: personsSex,
            trend: HealthDataPointTrendEnum.CannotBeCalculated,
            deprivation: noDeprivation,
            benchmarkComparison: {
              method: BenchmarkComparisonMethod.CIOverlappingReferenceValue95,
              outcome: BenchmarkOutcome.Similar,
            },
          },
        ],
      },
    ],
    groupData: {
      areaCode: '90210',
      areaName: 'Manchester',
      healthData: [
        {
          year: 2025,
          count: 3333,
          value: 890.305692,
          lowerCi: 341.69151,
          upperCi: 478.32766,
          ageBand: allAgesAge,
          sex: personsSex,
          trend: HealthDataPointTrendEnum.NotYetCalculated,
          deprivation: noDeprivation,
        },
      ],
    },
    quartileData: {
      polarity: IndicatorPolarity.HighIsGood,
      q0Value: 999,
      q1Value: 760,
      q3Value: 500,
      q4Value: 345,
      areaValue: 550,
    },
  };

  it('should have dark grey cell color for benchmark column', () => {
    render(
      <table>
        <tbody>
          <SpineChartTableRow indicatorData={mockIndicatorData} />
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
          <SpineChartTableRow indicatorData={mockIndicatorData} />
        </tbody>
      </table>
    );

    expect(screen.getByTestId('group-value-cell')).toHaveStyle(
      `background-color: ${GovukColours.LightGrey}`
    );
  });

  it('should have X for missing data', () => {
    const indicatorWithMissingData = {
      ...mockIndicatorData,
      groupData: {
        ...mockIndicatorData.groupData,
        healthData: [],
      },
      areasHealthData: [
        {
          ...mockIndicatorData.areasHealthData[0],
          healthData: [],
        },
      ],
      quartileData: {
        ...mockIndicatorData.quartileData,
        areaValue: undefined,
      },
    };

    render(
      <table>
        <tbody>
          <SpineChartTableRow indicatorData={indicatorWithMissingData} />
        </tbody>
      </table>
    );

    expect(screen.getByTestId('count-cell')).toHaveTextContent(`X`);

    expect(screen.getByTestId('value-cell')).toHaveTextContent(`X`);

    expect(screen.getByTestId('group-value-cell')).toHaveTextContent(`X`);

    expect(screen.getByTestId('benchmark-value-cell')).toHaveTextContent(`X`);
  });

  it('should have an additional count and value section when an 2 areas are requested', () => {
    const indicatorDataWithTwoAreas = {
      ...mockIndicatorData,
      areasHealthData: [
        mockIndicatorData.areasHealthData[0],
        {
          areaCode: 'A1426',
          areaName: 'Greater Manchester ICB - 01T',
          healthData: [
            {
              year: 2025,
              count: 333,
              value: 800.305692,
              lowerCi: 341.69151,
              upperCi: 478.32766,
              ageBand: allAgesAge,
              sex: personsSex,
              trend: HealthDataPointTrendEnum.CannotBeCalculated,
              deprivation: noDeprivation,
            },
          ],
        },
      ],
    };
    render(
      <table>
        <tbody>
          <SpineChartTableRow indicatorData={indicatorDataWithTwoAreas} />
        </tbody>
      </table>
    );

    expect(screen.getByTestId('area-1-count-cell')).toHaveTextContent('222');
    expect(screen.getByTestId('area-1-value-cell')).toHaveTextContent('690.3');
    expect(screen.getByTestId('area-2-count-cell')).toHaveTextContent('333');
    expect(screen.getByTestId('area-2-value-cell')).toHaveTextContent('800.3');

    // Trend cell should not be displayed when 2 areas selected
    expect(screen.queryByTestId('trend-cell')).not.toBeInTheDocument();
  });

  it('should not render a cell for group if the group is England', () => {
    const indicatorDataGroupEngland = {
      ...mockIndicatorData,
      groupData: {
        areaCode: 'E92000001',
        areaName: 'England',
        healthData: [
          {
            year: 2025,
            count: 3333,
            value: 890.305692,
            lowerCi: 341.69151,
            upperCi: 478.32766,
            ageBand: allAgesAge,
            sex: personsSex,
            trend: HealthDataPointTrendEnum.NotYetCalculated,
            deprivation: noDeprivation,
          },
        ],
      },
    };

    render(
      <table>
        <tbody>
          <SpineChartTableRow indicatorData={indicatorDataGroupEngland} />
        </tbody>
      </table>
    );

    expect(screen.queryByTestId('group-value-cell')).not.toBeInTheDocument();
  });
});

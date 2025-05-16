/* eslint-disable @typescript-eslint/no-explicit-any */
import { HealthDataForArea } from '@/generated-sources/ft-api-client';
import { areaCodeForEngland } from '@/lib/chartHelpers/constants';
import { allAgesAge, personsSex, noDeprivation } from '@/lib/mocks';
import { generateStandardLineChartOptions } from './generateStandardLineChartOptions';
import { mockIndicatorData, mockBenchmarkData, mockParentData } from '../mocks';
import { GovukColours } from '@/lib/styleHelpers/colours';
import { SymbolKeyValue } from 'highcharts';

const symbols: SymbolKeyValue[] = ['arc', 'circle', 'diamond'];

const chartColours: GovukColours[] = [
  GovukColours.Orange,
  GovukColours.LightPurple,
  GovukColours.DarkPink,
];

describe('generateStandardLineChartOptions', () => {
  it('should generate standard line chart options', () => {
    const generatedOptions = generateStandardLineChartOptions(
      [mockIndicatorData[0]],
      false,
      areaCodeForEngland,
      {
        englandData: undefined,
        groupIndicatorData: undefined,
        yAxisTitle: 'yAxis',
        xAxisTitle: 'xAxis',
        measurementUnit: '%',
        accessibilityLabel: 'accessibility',
        colours: chartColours,
        symbols,
      }
    );

    expect((generatedOptions.yAxis as any)!.title.text).toBe('yAxis');
    expect((generatedOptions.xAxis as any)!.title.text).toBe('xAxis');
    expect(generatedOptions.accessibility!.description).toBe('accessibility');
    expect(generatedOptions).toMatchSnapshot();
  });

  it('should generate standard line chart options with benchmark and group data', () => {
    const generatedOptions = generateStandardLineChartOptions(
      [mockIndicatorData[0]],
      false,
      areaCodeForEngland,
      {
        englandData: mockBenchmarkData,
        groupIndicatorData: mockParentData,
        yAxisTitle: 'yAxis',
        xAxisTitle: 'xAxis',
        measurementUnit: '%',
        accessibilityLabel: 'accessibility',
        colours: chartColours,
        symbols,
      }
    );
    expect(generatedOptions).toMatchSnapshot();
  });

  it('should not include benchmark or group years before or after the areas have data', () => {
    const mockBenchmarkAreaWithEarlyYear: HealthDataForArea = {
      ...mockBenchmarkData,
      healthData: [
        ...mockBenchmarkData.healthData,
        {
          year: 1999,
          ageBand: allAgesAge,
          sex: personsSex,
          trend: 'Not yet calculated',
          deprivation: noDeprivation,
        },
      ],
    };
    const mockGroupAreaWithLateYear: HealthDataForArea = {
      ...mockParentData,
      healthData: [
        ...mockParentData.healthData,
        {
          year: 2036,
          ageBand: allAgesAge,
          sex: personsSex,
          trend: 'Not yet calculated',
          deprivation: noDeprivation,
        },
      ],
    };

    const generatedOptions = generateStandardLineChartOptions(
      [mockIndicatorData[0]],
      false,
      areaCodeForEngland,
      {
        englandData: mockBenchmarkAreaWithEarlyYear,
        groupIndicatorData: mockGroupAreaWithLateYear,
        yAxisTitle: 'yAxis',
        xAxisTitle: 'xAxis',
        measurementUnit: '%',
        accessibilityLabel: 'accessibility',
        colours: chartColours,
        symbols,
      }
    );
    expect((generatedOptions.series?.[0] as any).data).toHaveLength(2);
    expect((generatedOptions.series?.[1] as any).data).toHaveLength(2);
    expect(generatedOptions).toMatchSnapshot();
  });
});

/* eslint-disable @typescript-eslint/no-explicit-any */
import { HealthDataForArea } from '@/generated-sources/ft-api-client';
import { areaCodeForEngland } from '@/lib/chartHelpers/constants';
import { allAgesAge, personsSex, noDeprivation } from '@/lib/mocks';
import { generateStandardLineChartOptions } from './generateStandardLineChartOptions';
import { mockIndicatorData, mockEnglandData, mockParentData } from '../mocks';

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
        indicatorName: 'Hospital admissions',
        englandData: mockEnglandData,
        groupIndicatorData: mockParentData,
        yAxisTitle: 'yAxis',
        xAxisTitle: 'xAxis',
        measurementUnit: '%',
        accessibilityLabel: 'accessibility',
      }
    );
    expect(generatedOptions).toMatchSnapshot();
  });

  it('should not include benchmark or group years before or after the areas have data', () => {
    const mockBenchmarkAreaWithEarlyYear: HealthDataForArea = {
      ...mockEnglandData,
      healthData: [
        ...mockEnglandData.healthData,
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
        indicatorName: 'Hospital admissions',
        englandData: mockBenchmarkAreaWithEarlyYear,
        groupIndicatorData: mockGroupAreaWithLateYear,
        yAxisTitle: 'yAxis',
        xAxisTitle: 'xAxis',
        measurementUnit: '%',
        accessibilityLabel: 'accessibility',
      }
    );
    expect((generatedOptions.series?.[0] as any).data).toHaveLength(2);
    expect((generatedOptions.series?.[1] as any).data).toHaveLength(2);
    expect(generatedOptions).toMatchSnapshot();
  });

  it('should include from and to in the title when only england data is supplied', () => {
    const generatedOptions = generateStandardLineChartOptions(
      [],
      false,
      areaCodeForEngland,
      {
        indicatorName: 'Hospital admissions',
        englandData: mockEnglandData,
        groupIndicatorData: undefined,
        yAxisTitle: 'yAxis',
        xAxisTitle: 'xAxis',
        measurementUnit: '%',
        accessibilityLabel: 'accessibility',
      }
    );

    expect(generatedOptions.title).toHaveProperty(
      'text',
      'Hospital admissions from 2004 to 2006'
    );
  });
});

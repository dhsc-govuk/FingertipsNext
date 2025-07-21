/* eslint-disable @typescript-eslint/no-explicit-any */
import {
  Frequency,
  HealthDataForArea,
  PeriodType,
} from '@/generated-sources/ft-api-client';
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
      PeriodType.Calendar,
      Frequency.Annually,
      {
        englandData: mockEnglandData,
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
      PeriodType.Calendar,
      Frequency.Annually,
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

  it('should not include england years before or after the areas have data', () => {
    const mockBenchmarkAreaWithEarlyYear: HealthDataForArea = {
      ...mockEnglandData,
      healthData: [
        ...mockEnglandData.healthData,
        {
          year: 1999,
          datePeriod: {
            type: PeriodType.Calendar,
            from: new Date('1999-01-01'),
            to: new Date('1999-12-31'),
          },
          ageBand: allAgesAge,
          sex: personsSex,
          trend: 'Not yet calculated',
          deprivation: noDeprivation,
        },
      ],
    };
    const mockGroupAreaWithMissingYear = mockParentData;

    const generatedOptions = generateStandardLineChartOptions(
      [mockIndicatorData[0]],
      false,
      areaCodeForEngland,
      PeriodType.Calendar,
      Frequency.Annually,
      {
        indicatorName: 'Hospital admissions',
        englandData: mockBenchmarkAreaWithEarlyYear,
        groupIndicatorData: mockGroupAreaWithMissingYear,
        yAxisTitle: 'yAxis',
        xAxisTitle: 'xAxis',
        measurementUnit: '%',
        accessibilityLabel: 'accessibility',
      }
    );
    expect((generatedOptions.series?.[0] as any).data).toHaveLength(2);
    expect(generatedOptions).toMatchSnapshot();
  });

  it('should include from and to in the title when only england data is supplied', () => {
    const generatedOptions = generateStandardLineChartOptions(
      [],
      false,
      areaCodeForEngland,
      PeriodType.Calendar,
      Frequency.Annually,
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

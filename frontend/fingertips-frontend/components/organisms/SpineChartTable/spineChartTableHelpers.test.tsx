import {
  HealthDataForArea,
  HealthDataPointTrendEnum,
} from '@/generated-sources/ft-api-client';
import { getHealthDataForArea } from './spineChartTableHelpers';
import { allAgesAge, noDeprivation, personsSex } from '@/lib/mocks';

describe('spineChartTableHelpers tests', () => {
  const mockAreaHealthData: HealthDataForArea[] = [
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
        },
      ],
    },
  ];

  describe('getHealthDataForArea', () => {
    test('throws an error if undefined provided as the area health data param', () => {
      expect(() => getHealthDataForArea(undefined, 'A12345')).toThrow(
        'Indicator contains no area health data'
      );
    });

    // Expectation is that the function is used in the context of both existing when gathering the data
    test('throws an error if the areaHealthData does not contain an item for the requested area code', () => {
      expect(() => getHealthDataForArea(mockAreaHealthData, 'A1234')).toThrow(
        'No health data found for the requested area code'
      );
    });

    test('gets the relevant health data item based on the requested area code', () => {
      expect(getHealthDataForArea(mockAreaHealthData, 'A1425')).toBe(
        mockAreaHealthData[0]
      );
    });
  });
});

import { HealthDataForArea } from '@/generated-sources/ft-api-client';
import {
  buildSpineChartIndicatorData,
  getHealthDataForArea,
} from './spineChartTableHelpers';
import {
  mockSpineHealthDataForArea,
  mockSpineIndicatorData,
  mockSpineIndicatorDocument,
  mockSpineIndicatorWithHealthData,
  mockSpineIndicatorWithHealthDataWithGroup,
  mockSpineIndicatorWithNoHealthData,
  mockSpineQuartileData,
} from '@/components/organisms/SpineChartTable/spineChartMockTestData';

describe('spineChartTableHelpers tests', () => {
  const mockAreaHealthData: HealthDataForArea[] = [mockSpineHealthDataForArea];

  describe('getHealthDataForArea', () => {
    test('returns null if undefined provided as the area health data param', () => {
      expect(getHealthDataForArea(undefined, 'A12345')).toBeNull();
    });

    // Expectation is that the function is used in the context of both existing when gathering the data
    test('returns null if the areaHealthData does not contain an item for the requested area code', () => {
      expect(getHealthDataForArea(mockAreaHealthData, 'A1234')).toBeNull();
    });

    test('gets the relevant health data item based on the requested area code', () => {
      expect(getHealthDataForArea(mockAreaHealthData, 'A1425')).toBe(
        mockAreaHealthData[0]
      );
    });
  });

  describe('buildSpineChartIndicatorData', () => {
    it('should return empty array when no data supplied', () => {
      const result = buildSpineChartIndicatorData([], [], [], [], '');
      expect(result).toEqual([]);
    });

    it('should return spine chart row data', () => {
      const areasSelected: string[] = ['A1425'];
      const selectedGroupCode: string = '90210';
      const result = buildSpineChartIndicatorData(
        [mockSpineIndicatorWithHealthDataWithGroup],
        [mockSpineIndicatorDocument],
        [mockSpineQuartileData],
        areasSelected,
        selectedGroupCode
      );
      expect(result).toEqual([mockSpineIndicatorData]);
    });

    it('should return spine chart row data when group is missing', () => {
      const areasSelected: string[] = ['A1425'];
      const selectedGroupCode: string = '90210';
      const result = buildSpineChartIndicatorData(
        [mockSpineIndicatorWithHealthData],
        [mockSpineIndicatorDocument],
        [mockSpineQuartileData],
        areasSelected,
        selectedGroupCode
      );
      const expected = { ...mockSpineIndicatorData, groupData: null };
      expect(result).toEqual([expected]);
    });

    it('should return spine chart row data when indicator meta is missing', () => {
      const areasSelected: string[] = ['A1425'];
      const selectedGroupCode: string = '90210';
      const result = buildSpineChartIndicatorData(
        [mockSpineIndicatorWithHealthDataWithGroup],
        [],
        [mockSpineQuartileData],
        areasSelected,
        selectedGroupCode
      );

      // value unit is the only thing we lose is indicator meta is missing
      const expected = { ...mockSpineIndicatorData, valueUnit: '' };
      expect(result).toEqual([expected]);
    });

    it('should return [] if indicators are missing', () => {
      const areasSelected: string[] = ['A1425'];
      const selectedGroupCode: string = '90210';
      const result = buildSpineChartIndicatorData(
        [],
        [mockSpineIndicatorDocument],
        [mockSpineQuartileData],
        areasSelected,
        selectedGroupCode
      );
      expect(result).toEqual([]);
    });

    it('should return [] if areas do not match', () => {
      const areasSelected: string[] = ['A142xxx'];
      const selectedGroupCode: string = '90210';
      const result = buildSpineChartIndicatorData(
        [mockSpineIndicatorWithHealthDataWithGroup],
        [mockSpineIndicatorDocument],
        [mockSpineQuartileData],
        areasSelected,
        selectedGroupCode
      );
      expect(result[0]).toHaveProperty('areasHealthData', []);
    });

    it('should return [] if quartiles are missing', () => {
      const areasSelected: string[] = ['A1425'];
      const selectedGroupCode: string = '90210';
      const result = buildSpineChartIndicatorData(
        [mockSpineIndicatorWithHealthDataWithGroup],
        [mockSpineIndicatorDocument],
        [],
        areasSelected,
        selectedGroupCode
      );
      expect(result).toEqual([]);
    });

    it('should return [] if area health data is missing', () => {
      const areasSelected: string[] = ['A1425'];
      const selectedGroupCode: string = '90210';
      const result = buildSpineChartIndicatorData(
        [mockSpineIndicatorWithNoHealthData],
        [mockSpineIndicatorDocument],
        [mockSpineQuartileData],
        areasSelected,
        selectedGroupCode
      );
      expect(result[0]).toHaveProperty('areasHealthData', []);
    });

    it('should return [] if indicatorData is missing id', () => {
      const areasSelected: string[] = ['A1425'];
      const selectedGroupCode: string = '90210';
      const indicatorWithMissingId = {
        ...mockSpineIndicatorWithHealthDataWithGroup,
        indicatorId: undefined,
      };
      const result = buildSpineChartIndicatorData(
        [indicatorWithMissingId],
        [mockSpineIndicatorDocument],
        [mockSpineQuartileData],
        areasSelected,
        selectedGroupCode
      );
      expect(result).toEqual([]);
    });
  });
});

import { buildSpineChartIndicatorData } from './buildSpineChartIndicatorData';
import {
  mockSpineIndicatorDocument,
  mockSpineIndicatorWithHealthDataWithGroup,
  mockSpineQuartileData,
} from '@/components/charts/SpineChart/SpineChartTable/spineChartMockTestData';
import { mockIndicatorWithHealthDataForArea } from '@/mock/data/mockIndicatorWithHealthDataForArea';
import {
  mockHealthDataForArea,
  mockHealthDataForArea_England,
  mockHealthDataForArea_Group,
} from '@/mock/data/mockHealthDataForArea';
import { mockIndicatorDocument } from '@/mock/data/mockIndicatorDocument';
import { mockQuartileData } from '@/mock/data/mockQuartileData';

const testArea = mockHealthDataForArea({ healthData: [] });
const testGroup = mockHealthDataForArea_Group({ healthData: [] });
const testEngland = mockHealthDataForArea_England({ healthData: [] });
const testDataWithGroup = mockIndicatorWithHealthDataForArea({
  areaHealthData: [testArea, testGroup, testEngland],
});

const testDataWithoutGroup = mockIndicatorWithHealthDataForArea({
  areaHealthData: [testArea, testEngland],
});

const testMeta = mockIndicatorDocument();
const testQuartile = mockQuartileData();

const areasSelected: string[] = [testArea.areaCode];
const selectedGroupCode: string = testGroup.areaCode;

describe('spineChartTableHelpers tests', () => {
  describe('buildSpineChartIndicatorData', () => {
    it('should return empty array when no data supplied', () => {
      const result = buildSpineChartIndicatorData([], [], [], [], '');
      expect(result).toEqual([]);
    });

    it('should return spine chart row data', () => {
      const result = buildSpineChartIndicatorData(
        [testDataWithGroup],
        [testMeta],
        [testQuartile],
        areasSelected,
        selectedGroupCode
      );

      const [row1] = result;
      expect(row1).toHaveProperty(
        'rowId',
        `${testDataWithGroup.indicatorId}?sex=persons&age=all+ages`
      );
      expect(row1).toHaveProperty('indicatorId', testDataWithGroup.indicatorId);
      expect(row1).toHaveProperty(
        'indicatorName',
        `${testDataWithGroup.name} (Persons, All ages)`
      );
      expect(row1).toHaveProperty('latestDataPeriod', testQuartile.year);
      expect(row1).toHaveProperty('valueUnit', '%');
      expect(row1).toHaveProperty('benchmarkComparisonMethod');
      expect(row1).toHaveProperty('quartileData', testQuartile);
      expect(row1).toHaveProperty('groupData', {
        ...testGroup,
        healthData: testGroup.indicatorSegments?.at(0)?.healthData,
        indicatorSegments: undefined,
      });
      expect(row1).toHaveProperty('englandData', {
        ...testEngland,
        healthData: testEngland.indicatorSegments?.at(0)?.healthData,
        indicatorSegments: undefined,
      });
      expect(row1).toHaveProperty('areasHealthData', [
        {
          ...testArea,
          healthData: testArea.indicatorSegments?.at(0)?.healthData,
          indicatorSegments: undefined,
        },
      ]);
    });

    it('should return spine chart row data when group is missing', () => {
      const result = buildSpineChartIndicatorData(
        [testDataWithoutGroup],
        [testMeta],
        [testQuartile],
        areasSelected,
        selectedGroupCode
      );
      const [row1] = result;
      expect(row1.groupData).toBeUndefined();
    });

    it('should return spine chart row data when indicator meta is missing', () => {
      const result = buildSpineChartIndicatorData(
        [testDataWithoutGroup],
        [],
        [testQuartile],
        areasSelected,
        selectedGroupCode
      );

      const [row1] = result;
      expect(row1.valueUnit).toEqual('');
    });

    it('should return [] if indicators are missing', () => {
      const result = buildSpineChartIndicatorData(
        [],
        [testMeta],
        [testQuartile],
        areasSelected,
        selectedGroupCode
      );
      expect(result).toEqual([]);
    });

    it('should return [] if areas do not match', () => {
      const result = buildSpineChartIndicatorData(
        [mockSpineIndicatorWithHealthDataWithGroup],
        [mockSpineIndicatorDocument],
        [mockSpineQuartileData],
        ['abc'],
        selectedGroupCode
      );
      expect(result).toEqual([]);
    });

    it('should return [] if quartiles are missing', () => {
      const result = buildSpineChartIndicatorData(
        [testDataWithoutGroup],
        [testMeta],
        [],
        areasSelected,
        selectedGroupCode
      );
      expect(result).toEqual([]);
    });

    it('should return [] if area health data is missing', () => {
      const result = buildSpineChartIndicatorData(
        [{ ...testDataWithGroup, areaHealthData: [] }],
        [testMeta],
        [testQuartile],
        areasSelected,
        selectedGroupCode
      );
      expect(result).toEqual([]);
    });

    it('should return [] if indicatorData is missing id', () => {
      const result = buildSpineChartIndicatorData(
        [{ ...testDataWithGroup, indicatorId: undefined }],
        [testMeta],
        [testQuartile],
        areasSelected,
        selectedGroupCode
      );
      expect(result).toEqual([]);
    });
  });
});

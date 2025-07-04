import { mockIndicatorSegment } from '@/mock/data/mockIndicatorSegment';
import { mockSexData } from '@/mock/data/mockSexData';
import { mockHealthDataPoints } from '@/mock/data/mockHealthDataPoint';
import { mockIndicatorWithHealthDataForArea } from '@/mock/data/mockIndicatorWithHealthDataForArea';
import {
  mockHealthDataForArea,
  mockHealthDataForArea_England,
  mockHealthDataForArea_Group,
} from '@/mock/data/mockHealthDataForArea';
import { flattenSegment } from '@/lib/healthDataHelpers/flattenSegment';
import { SearchParams } from '@/lib/searchStateManager';

const personsHealthData = mockHealthDataPoints([
  { value: 1 },
  { value: 2 },
  { value: 3 },
]);
const testSegmentPersons = mockIndicatorSegment({
  sex: mockSexData({ isAggregate: true, value: 'Persons' }),
  healthData: personsHealthData,
});

const maleHealthData = mockHealthDataPoints([
  { value: 4 },
  { value: 5 },
  { value: 6 },
]);
const testSegmentMale = mockIndicatorSegment({
  sex: mockSexData({ isAggregate: false, value: 'Male' }),
  healthData: maleHealthData,
});

const femaleHealthData = mockHealthDataPoints([
  { value: 7 },
  { value: 8 },
  { value: 9 },
]);
const testSegmentFemale = mockIndicatorSegment({
  sex: mockSexData({ isAggregate: false, value: 'Female' }),
  healthData: femaleHealthData,
});

const testSegments = [testSegmentPersons, testSegmentFemale, testSegmentMale];

const testData = mockIndicatorWithHealthDataForArea({
  areaHealthData: [
    mockHealthDataForArea({ indicatorSegments: testSegments }),
    mockHealthDataForArea_England({ indicatorSegments: testSegments }),
    mockHealthDataForArea_Group({ indicatorSegments: testSegments }),
  ],
});

describe('flattenSegment', () => {
  it("should loop through the areaHealthData and set the healthData prop to the aggregate segment's healthData", () => {
    const result = flattenSegment(testData, {});

    expect(result.areaHealthData).toHaveLength(3);
    expect(result.areaHealthData?.at(0)?.healthData).toEqual(personsHealthData);
    expect(result.areaHealthData?.at(1)?.healthData).toEqual(personsHealthData);
    expect(result.areaHealthData?.at(2)?.healthData).toEqual(personsHealthData);
  });

  it("should loop through the areaHealthData and set the healthData prop to the chosen segment's healthData", () => {
    const result = flattenSegment(testData, {
      [SearchParams.SegmentationSex]: 'female',
    });

    expect(result.areaHealthData).toHaveLength(3);
    expect(result.areaHealthData?.at(0)?.healthData).toEqual(femaleHealthData);
    expect(result.areaHealthData?.at(1)?.healthData).toEqual(femaleHealthData);
    expect(result.areaHealthData?.at(2)?.healthData).toEqual(femaleHealthData);
  });

  it('should remove the indicatorSegments from the resulting data', () => {
    const result = flattenSegment(testData, {});

    expect(result.areaHealthData).toHaveLength(3);
    expect(result.areaHealthData?.at(0)?.indicatorSegments).toBeUndefined();
    expect(result.areaHealthData?.at(1)?.indicatorSegments).toBeUndefined();
    expect(result.areaHealthData?.at(2)?.indicatorSegments).toBeUndefined();
  });
});

import { mockIndicatorSegment } from '@/mock/data/mockIndicatorSegment';
import { mockSexData } from '@/mock/data/mockSexData';
import { mockHealthDataPoint } from '@/mock/data/mockHealthDataPoint';
import { findHealthPointsBySegmentation } from '@/lib/healthDataHelpers/findHealthPointsBySegmentation';
import { SearchParams } from '@/lib/searchStateManager';

const testSegmentPersons = mockIndicatorSegment({
  sex: mockSexData({ isAggregate: true, value: 'Persons' }),
  healthData: [mockHealthDataPoint({ value: 123 })],
});

const testSegmentMale = mockIndicatorSegment({
  sex: mockSexData({ isAggregate: false, value: 'Male' }),
  healthData: [mockHealthDataPoint({ value: 456 })],
});

const testSegmentFemale = mockIndicatorSegment({
  sex: mockSexData({ isAggregate: false, value: 'Female' }),
  healthData: [mockHealthDataPoint({ value: 789 })],
});

const testData = [testSegmentPersons, testSegmentMale, testSegmentFemale];

describe('findHealthPointsBySegmentation', () => {
  it('should return empty array when no matching segment is found', () => {
    expect(
      findHealthPointsBySegmentation(testData, {
        [SearchParams.SegmentationSex]: 'ABC',
      })
    ).toEqual([]);
  });

  it('should return the aggregate segment when no search criteria', () => {
    expect(findHealthPointsBySegmentation(testData, {})).toEqual(
      testSegmentPersons.healthData
    );
  });

  it('should return the aggregate segment when search param for sex is persons', () => {
    expect(
      findHealthPointsBySegmentation(testData, {
        [SearchParams.SegmentationSex]: 'persons',
      })
    ).toEqual(testSegmentPersons.healthData);
  });

  it('should return the male segment when search param for sex is male', () => {
    expect(
      findHealthPointsBySegmentation(testData, {
        [SearchParams.SegmentationSex]: 'MALE',
      })
    ).toEqual(testSegmentMale.healthData);
  });

  it('should return the male segment when search param for sex is female', () => {
    expect(
      findHealthPointsBySegmentation(testData, {
        [SearchParams.SegmentationSex]: 'female',
      })
    ).toEqual(testSegmentFemale.healthData);
  });
});

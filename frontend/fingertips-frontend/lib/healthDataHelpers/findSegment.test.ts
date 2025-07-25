import { mockIndicatorSegment } from '@/mock/data/mockIndicatorSegment';
import { mockSexData } from '@/mock/data/mockSexData';
import { mockHealthDataPoint } from '@/mock/data/mockHealthDataPoint';
import { findSegment } from '@/lib/healthDataHelpers/findSegment';
import { mockAgeData } from '@/mock/data/mockAgeData';

const testSegmentPersons = mockIndicatorSegment({
  sex: mockSexData({ isAggregate: true, value: 'Persons' }),
  age: mockAgeData({ isAggregate: true, value: 'Ages' }),
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
  it('should return undefined when no matching segment is found', () => {
    expect(
      findSegment(testData, {
        sex: 'ABC',
        age: '',
        frequency: '',
      })
    ).toBeUndefined();
  });

  it('should return the aggregate segment when no search criteria', () => {
    expect(
      findSegment(testData, {
        sex: '',
        age: '',
        frequency: '',
      })
    ).toEqual(testSegmentPersons);
  });

  it('should return the aggregate segment when search param for sex is persons', () => {
    expect(
      findSegment(testData, {
        sex: 'persons',
        age: '',
        frequency: '',
      })
    ).toEqual(testSegmentPersons);
  });

  it('should return the male segment when search param for sex is male', () => {
    expect(
      findSegment(testData, {
        sex: 'MALE',
        age: '',
        frequency: '',
      })
    ).toEqual(testSegmentMale);
  });

  it('should return the female segment when search param for sex is female', () => {
    expect(
      findSegment(testData, {
        sex: 'female',
        age: '',
        frequency: '',
      })
    ).toEqual(testSegmentFemale);
  });
});

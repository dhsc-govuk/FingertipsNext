import { mockIndicatorSegment } from '@/mock/data/mockIndicatorSegment';
import { mockSexData } from '@/mock/data/mockSexData';
import { mockHealthDataPoint } from '@/mock/data/mockHealthDataPoint';
import { findSegment } from '@/lib/healthDataHelpers/findSegment';
import { mockAgeData } from '@/mock/data/mockAgeData';

const testSegmentPersons = mockIndicatorSegment({
  sex: mockSexData({ isAggregate: true, value: 'Persons' }),
  age: mockAgeData({ isAggregate: true, value: 'All ages' }),
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
        reportingPeriod: '',
      })
    ).toBeUndefined();
  });

  it('should return the aggregate segment when no search criteria', () => {
    expect(
      findSegment(testData, {
        sex: '',
        age: '',
        reportingPeriod: '',
      })
    ).toEqual(testSegmentPersons);
  });

  it('should return the aggregate segment when search param for sex is persons', () => {
    expect(
      findSegment(testData, {
        sex: 'persons',
        age: '',
        reportingPeriod: '',
      })
    ).toEqual(testSegmentPersons);
  });

  it('should return the male segment when search param for sex is male', () => {
    expect(
      findSegment(testData, {
        sex: 'MALE',
        age: '',
        reportingPeriod: '',
      })
    ).toEqual(testSegmentMale);
  });

  it('should return the female segment when search param for sex is female', () => {
    expect(
      findSegment(testData, {
        sex: 'female',
        age: '',
        reportingPeriod: '',
      })
    ).toEqual(testSegmentFemale);
  });

  it('should default to the first segment option when there is no aggregate to default to', () => {
    const nonAggregateTestData = [
      mockIndicatorSegment({
        age: mockAgeData({ value: 'less than 10', isAggregate: false }),
      }),
      mockIndicatorSegment({
        age: mockAgeData({ value: '10 - 12', isAggregate: false }),
      }),
      mockIndicatorSegment({
        age: mockAgeData({ value: '12 - 18', isAggregate: false }),
      }),
      mockIndicatorSegment({
        age: mockAgeData({ value: '18 - 30', isAggregate: false }),
      }),
      mockIndicatorSegment({
        age: mockAgeData({ value: '30 - 60', isAggregate: false }),
      }),
      mockIndicatorSegment({
        age: mockAgeData({ value: 'another value', isAggregate: false }),
      }),
    ];
    expect(
      findSegment(nonAggregateTestData, {
        sex: '',
        age: '',
        frequency: '',
      })
    ).toEqual(nonAggregateTestData[1]); // 10-12 because alphabetically it would be first
  });
});

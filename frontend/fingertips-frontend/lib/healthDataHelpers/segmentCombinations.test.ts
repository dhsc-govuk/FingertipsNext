import { segmentCombinations } from '@/lib/healthDataHelpers/segmentCombinations';
import { SegmentationId } from '@/lib/common-types';

describe('segmentCombinations', () => {
  it('should return empty array when there are no input options', () => {
    const input = {
      [SegmentationId.Sex]: [],
      [SegmentationId.Age]: [],
      [SegmentationId.ReportingPeriod]: [],
    };

    const result = segmentCombinations(input);

    expect(result).toEqual([]);
  });

  it('should return empty string for sex when sex has no options but still populate other values', () => {
    const input = {
      [SegmentationId.Sex]: [],
      [SegmentationId.Age]: ['Child', 'Adult'],
      [SegmentationId.ReportingPeriod]: ['Daily', 'Annual'],
    };

    const result = segmentCombinations(input);

    expect(result).toEqual([
      { sex: '', age: 'Child', reportingPeriod: 'Daily' },
      { sex: '', age: 'Child', reportingPeriod: 'Annual' },
      { sex: '', age: 'Adult', reportingPeriod: 'Daily' },
      { sex: '', age: 'Adult', reportingPeriod: 'Annual' },
    ]);
  });

  it('should return empty string for age when age has no options but still populate other values', () => {
    const input = {
      [SegmentationId.Sex]: ['Persons', 'Male'],
      [SegmentationId.Age]: [],
      [SegmentationId.ReportingPeriod]: ['Daily', 'Annual'],
    };

    const result = segmentCombinations(input);

    expect(result).toEqual([
      { sex: 'Persons', age: '', reportingPeriod: 'Daily' },
      { sex: 'Persons', age: '', reportingPeriod: 'Annual' },
      { sex: 'Male', age: '', reportingPeriod: 'Daily' },
      { sex: 'Male', age: '', reportingPeriod: 'Annual' },
    ]);
  });

  it('should return empty string for reportingPeriod when reportingPeriod has no options but still populate other values', () => {
    const input = {
      [SegmentationId.Sex]: ['Persons', 'Male'],
      [SegmentationId.Age]: ['Child', 'Adult'],
      [SegmentationId.ReportingPeriod]: [],
    };

    const result = segmentCombinations(input);

    expect(result).toEqual([
      { sex: 'Persons', age: 'Child', reportingPeriod: '' },
      { sex: 'Persons', age: 'Adult', reportingPeriod: '' },
      { sex: 'Male', age: 'Child', reportingPeriod: '' },
      { sex: 'Male', age: 'Adult', reportingPeriod: '' },
    ]);
  });

  it('should return all combinations', () => {
    const input = {
      [SegmentationId.Sex]: ['Persons', 'Male', 'Female'],
      [SegmentationId.Age]: ['Infant', 'Child', 'Adult', 'Senior'],
      [SegmentationId.ReportingPeriod]: ['Daily', 'Monthly', 'Annual'],
    };

    const result = segmentCombinations(input);

    expect(result).toEqual([
      { sex: 'Persons', age: 'Infant', reportingPeriod: 'Daily' },
      { sex: 'Persons', age: 'Infant', reportingPeriod: 'Monthly' },
      { sex: 'Persons', age: 'Infant', reportingPeriod: 'Annual' },
      { sex: 'Persons', age: 'Child', reportingPeriod: 'Daily' },
      { sex: 'Persons', age: 'Child', reportingPeriod: 'Monthly' },
      { sex: 'Persons', age: 'Child', reportingPeriod: 'Annual' },
      { sex: 'Persons', age: 'Adult', reportingPeriod: 'Daily' },
      { sex: 'Persons', age: 'Adult', reportingPeriod: 'Monthly' },
      { sex: 'Persons', age: 'Adult', reportingPeriod: 'Annual' },
      { sex: 'Persons', age: 'Senior', reportingPeriod: 'Daily' },
      { sex: 'Persons', age: 'Senior', reportingPeriod: 'Monthly' },
      { sex: 'Persons', age: 'Senior', reportingPeriod: 'Annual' },
      //
      { sex: 'Male', age: 'Infant', reportingPeriod: 'Daily' },
      { sex: 'Male', age: 'Infant', reportingPeriod: 'Monthly' },
      { sex: 'Male', age: 'Infant', reportingPeriod: 'Annual' },
      { sex: 'Male', age: 'Child', reportingPeriod: 'Daily' },
      { sex: 'Male', age: 'Child', reportingPeriod: 'Monthly' },
      { sex: 'Male', age: 'Child', reportingPeriod: 'Annual' },
      { sex: 'Male', age: 'Adult', reportingPeriod: 'Daily' },
      { sex: 'Male', age: 'Adult', reportingPeriod: 'Monthly' },
      { sex: 'Male', age: 'Adult', reportingPeriod: 'Annual' },
      { sex: 'Male', age: 'Senior', reportingPeriod: 'Daily' },
      { sex: 'Male', age: 'Senior', reportingPeriod: 'Monthly' },
      { sex: 'Male', age: 'Senior', reportingPeriod: 'Annual' },
      //
      { sex: 'Female', age: 'Infant', reportingPeriod: 'Daily' },
      { sex: 'Female', age: 'Infant', reportingPeriod: 'Monthly' },
      { sex: 'Female', age: 'Infant', reportingPeriod: 'Annual' },
      { sex: 'Female', age: 'Child', reportingPeriod: 'Daily' },
      { sex: 'Female', age: 'Child', reportingPeriod: 'Monthly' },
      { sex: 'Female', age: 'Child', reportingPeriod: 'Annual' },
      { sex: 'Female', age: 'Adult', reportingPeriod: 'Daily' },
      { sex: 'Female', age: 'Adult', reportingPeriod: 'Monthly' },
      { sex: 'Female', age: 'Adult', reportingPeriod: 'Annual' },
      { sex: 'Female', age: 'Senior', reportingPeriod: 'Daily' },
      { sex: 'Female', age: 'Senior', reportingPeriod: 'Monthly' },
      { sex: 'Female', age: 'Senior', reportingPeriod: 'Annual' },
    ]);
  });
});

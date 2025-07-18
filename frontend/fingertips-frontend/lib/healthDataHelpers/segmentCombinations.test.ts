import { segmentCombinations } from '@/lib/healthDataHelpers/segmentCombinations';
import { SegmentationId } from '@/lib/common-types';

describe('segmentCombinations', () => {
  it('should return empty array when there are no input options', () => {
    const input = {
      [SegmentationId.Sex]: [],
      [SegmentationId.Age]: [],
      [SegmentationId.Frequency]: [],
    };

    const result = segmentCombinations(input);

    expect(result).toEqual([]);
  });

  it('should return empty string for sex when sex has no options but still populate other values', () => {
    const input = {
      [SegmentationId.Sex]: [],
      [SegmentationId.Age]: ['Child', 'Adult'],
      [SegmentationId.Frequency]: ['Daily', 'Annual'],
    };

    const result = segmentCombinations(input);

    expect(result).toEqual([
      { sex: '', age: 'Child', frequency: 'Daily' },
      { sex: '', age: 'Child', frequency: 'Annual' },
      { sex: '', age: 'Adult', frequency: 'Daily' },
      { sex: '', age: 'Adult', frequency: 'Annual' },
    ]);
  });

  it('should return empty string for age when age has no options but still populate other values', () => {
    const input = {
      [SegmentationId.Sex]: ['Persons', 'Male'],
      [SegmentationId.Age]: [],
      [SegmentationId.Frequency]: ['Daily', 'Annual'],
    };

    const result = segmentCombinations(input);

    expect(result).toEqual([
      { sex: 'Persons', age: '', frequency: 'Daily' },
      { sex: 'Persons', age: '', frequency: 'Annual' },
      { sex: 'Male', age: '', frequency: 'Daily' },
      { sex: 'Male', age: '', frequency: 'Annual' },
    ]);
  });

  it('should return empty string for frequency when frequency has no options but still populate other values', () => {
    const input = {
      [SegmentationId.Sex]: ['Persons', 'Male'],
      [SegmentationId.Age]: ['Child', 'Adult'],
      [SegmentationId.Frequency]: [],
    };

    const result = segmentCombinations(input);

    expect(result).toEqual([
      { sex: 'Persons', age: 'Child', frequency: '' },
      { sex: 'Persons', age: 'Adult', frequency: '' },
      { sex: 'Male', age: 'Child', frequency: '' },
      { sex: 'Male', age: 'Adult', frequency: '' },
    ]);
  });

  it('should return all combinations', () => {
    const input = {
      [SegmentationId.Sex]: ['Persons', 'Male', 'Female'],
      [SegmentationId.Age]: ['Infant', 'Child', 'Adult', 'Senior'],
      [SegmentationId.Frequency]: ['Daily', 'Monthly', 'Annual'],
    };

    const result = segmentCombinations(input);

    expect(result).toEqual([
      { sex: 'Persons', age: 'Infant', frequency: 'Daily' },
      { sex: 'Persons', age: 'Infant', frequency: 'Monthly' },
      { sex: 'Persons', age: 'Infant', frequency: 'Annual' },
      { sex: 'Persons', age: 'Child', frequency: 'Daily' },
      { sex: 'Persons', age: 'Child', frequency: 'Monthly' },
      { sex: 'Persons', age: 'Child', frequency: 'Annual' },
      { sex: 'Persons', age: 'Adult', frequency: 'Daily' },
      { sex: 'Persons', age: 'Adult', frequency: 'Monthly' },
      { sex: 'Persons', age: 'Adult', frequency: 'Annual' },
      { sex: 'Persons', age: 'Senior', frequency: 'Daily' },
      { sex: 'Persons', age: 'Senior', frequency: 'Monthly' },
      { sex: 'Persons', age: 'Senior', frequency: 'Annual' },
      //
      { sex: 'Male', age: 'Infant', frequency: 'Daily' },
      { sex: 'Male', age: 'Infant', frequency: 'Monthly' },
      { sex: 'Male', age: 'Infant', frequency: 'Annual' },
      { sex: 'Male', age: 'Child', frequency: 'Daily' },
      { sex: 'Male', age: 'Child', frequency: 'Monthly' },
      { sex: 'Male', age: 'Child', frequency: 'Annual' },
      { sex: 'Male', age: 'Adult', frequency: 'Daily' },
      { sex: 'Male', age: 'Adult', frequency: 'Monthly' },
      { sex: 'Male', age: 'Adult', frequency: 'Annual' },
      { sex: 'Male', age: 'Senior', frequency: 'Daily' },
      { sex: 'Male', age: 'Senior', frequency: 'Monthly' },
      { sex: 'Male', age: 'Senior', frequency: 'Annual' },
      //
      { sex: 'Female', age: 'Infant', frequency: 'Daily' },
      { sex: 'Female', age: 'Infant', frequency: 'Monthly' },
      { sex: 'Female', age: 'Infant', frequency: 'Annual' },
      { sex: 'Female', age: 'Child', frequency: 'Daily' },
      { sex: 'Female', age: 'Child', frequency: 'Monthly' },
      { sex: 'Female', age: 'Child', frequency: 'Annual' },
      { sex: 'Female', age: 'Adult', frequency: 'Daily' },
      { sex: 'Female', age: 'Adult', frequency: 'Monthly' },
      { sex: 'Female', age: 'Adult', frequency: 'Annual' },
      { sex: 'Female', age: 'Senior', frequency: 'Daily' },
      { sex: 'Female', age: 'Senior', frequency: 'Monthly' },
      { sex: 'Female', age: 'Senior', frequency: 'Annual' },
    ]);
  });
});

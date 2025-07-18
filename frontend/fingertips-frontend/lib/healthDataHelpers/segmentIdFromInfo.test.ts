import { describe, it, expect } from 'vitest';
import { segmentIdFromInfo } from '@/lib/healthDataHelpers/segmentIdFromInfo';
import { SegmentInfo } from '@/lib/common-types';

describe('segmentIdFromInfo', () => {
  it('returns single key-value pair string when one field is present', () => {
    const input: SegmentInfo = { sex: 'male', age: '', frequency: '' };
    const result = segmentIdFromInfo(input);
    expect(result).toBe('sex:male');
  });

  it('returns joined key-value pairs for all defined fields', () => {
    const input: SegmentInfo = {
      sex: 'female',
      age: '30-40',
      frequency: 'weekly',
    };
    const result = segmentIdFromInfo(input);
    expect(result).toBe('sex:female_age:30-40_frequency:weekly');
  });

  it('ignores undefined fields', () => {
    const input: SegmentInfo = {
      sex: 'Male',
      age: '',
      frequency: 'Monthly',
    };
    const result = segmentIdFromInfo(input);
    expect(result).toBe('sex:male_frequency:monthly');
  });

  it('ignores empty string values', () => {
    const input: SegmentInfo = { sex: '', age: '20-25', frequency: '' };
    const result = segmentIdFromInfo(input);
    expect(result).toBe('age:20-25');
  });

  it('returns empty string for completely undefined or empty values', () => {
    const input: SegmentInfo = { sex: '', age: '', frequency: '' };
    const result = segmentIdFromInfo(input);
    expect(result).toBe('');
  });
});

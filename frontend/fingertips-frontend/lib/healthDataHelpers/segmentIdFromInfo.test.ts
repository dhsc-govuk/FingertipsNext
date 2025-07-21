import { describe, it, expect } from 'vitest';
import { segmentIdFromInfo } from '@/lib/healthDataHelpers/segmentIdFromInfo';
import { SegmentInfo } from '@/lib/common-types';

describe('segmentIdFromInfo', () => {
  it('returns single key-value pair string when one field is present', () => {
    const input: SegmentInfo = { sex: 'male', age: '', frequency: '' };
    const result = segmentIdFromInfo(1, input);
    expect(result).toBe('1?sex=male');
  });

  it('returns joined key-value pairs for all defined fields', () => {
    const input: SegmentInfo = {
      sex: 'female',
      age: '30-40',
      frequency: 'weekly',
    };
    const result = segmentIdFromInfo(2, input);
    expect(result).toBe('2?sex=female&age=30-40&frequency=weekly');
  });

  it('ignores undefined fields', () => {
    const input: SegmentInfo = {
      sex: 'Male',
      age: '',
      frequency: 'Monthly',
    };
    const result = segmentIdFromInfo(3, input);
    expect(result).toBe('3?sex=male&frequency=monthly');
  });

  it('ignores empty string values', () => {
    const input: SegmentInfo = { sex: '', age: '20-25', frequency: '' };
    const result = segmentIdFromInfo(4, input);
    expect(result).toBe('4?age=20-25');
  });

  it('returns empty string for completely undefined or empty values', () => {
    const input: SegmentInfo = { sex: '', age: '', frequency: '' };
    const result = segmentIdFromInfo(5, input);
    expect(result).toBe('5');
  });
});

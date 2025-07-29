import { describe, it, expect } from 'vitest';
import { segmentNameFromInfo } from './segmentNameFromInfo';

import { SegmentInfo } from '@/lib/common-types';

describe('segmentNameFromInfo', () => {
  it('returns full string when all fields are present', () => {
    const input = { sex: 'Female', age: '20-29', reportingPeriod: 'Monthly' };
    expect(segmentNameFromInfo(input)).toBe('Female, 20-29, Monthly');
  });

  it('omits missing fields', () => {
    const input = { sex: 'Male', age: '', reportingPeriod: 'Weekly' };
    expect(segmentNameFromInfo(input)).toBe('Male, Weekly');
  });

  it('returns single value if only one is provided', () => {
    const input = { sex: '', age: '', reportingPeriod: 'Daily' };
    expect(segmentNameFromInfo(input)).toBe('Daily');
  });

  it('returns empty string if all values are missing', () => {
    const input = { sex: '', age: '', reportingPeriod: '' };
    expect(segmentNameFromInfo(input)).toBe('');
  });

  it('handles missing keys gracefully', () => {
    const input = {} as SegmentInfo;
    expect(segmentNameFromInfo(input)).toBe('');
  });
});

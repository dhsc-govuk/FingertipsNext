import { filterDefined } from '@/lib/chartHelpers/filterDefined';

describe('filterDefined', () => {
  it('should remove all undefined items from array', () => {
    expect(['a', 'b', undefined, 'd'].filter(filterDefined)).toEqual([
      'a',
      'b',
      'd',
    ]);
  });
});

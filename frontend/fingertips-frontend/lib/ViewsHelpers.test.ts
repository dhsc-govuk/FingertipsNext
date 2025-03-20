import { chunkArray } from './ViewsHelpers';

describe('chunkArray', () => {
  it('should chunk an array into the correct sized sub arrays', () => {
    const testArray1: string[] = new Array(10).fill('a', 0, 10);
    const testArray2: string[] = new Array(5).fill('b', 0, 5);

    expect(chunkArray(testArray1, 2)).toHaveLength(5);
    expect(chunkArray(testArray2, 2)).toEqual([['b', 'b'], ['b', 'b'], ['b']]);
  });
});

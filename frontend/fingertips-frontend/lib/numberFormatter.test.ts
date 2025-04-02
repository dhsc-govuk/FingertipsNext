import { formatNumber, formatWholeNumber } from '@/lib/numberFormatter';

describe('formatNumber and formatWholeNumber', () => {
  it.each([
    [1, '1'],
    [13, '13'],
    [318, '318'],
    [1867, '1,867'],
    [21867, '21,867'],
    [321867, '321,867'],
    [4321867, '4,321,867'],
    [54321867, '54,321,867'],
    [654321867, '654,321,867'],
    [7654321867, '7,654,321,867'],
    [318.743, '318.7'],
    [1867.743, '1,867.7'],
    [318.763, '318.8'],
    [1867.763, '1,867.8'],
    [318.5, '318.5'],
    [1867.5, '1,867.5'],
    [318.75, '318.8'],
    [1867.75, '1,867.8'],
  ])('formatNumber: %d ==> %d', (value: number, expected: string) => {
    expect(formatNumber(value)).toBe(expected);
  });

  it.each([
    [318.443, '318'],
    [1867.443, '1,867'],
    [318.763, '319'],
    [1867.763, '1,868'],
    [318.5, '319'],
    [1867.5, '1,868'],
    [318.75, '319'],
    [1867.75, '1,868'],
  ])('formatWholeNumber: %d ==> %d', (value: number, expected: string) => {
    expect(formatWholeNumber(value)).toBe(expected);
  });
});

import { asArray } from './pageHelper';

describe('asArray', () => {
  it('should return an empty array if no value is provided', () => {
    const newValue = asArray();

    expect(newValue).toEqual([]);
  });

  it('should return the string provided in value wrapped in an array', () => {
    const newValue = asArray('1');

    expect(newValue).toEqual(['1']);
  });

  it('should return the value as is if already an array of strings', () => {
    const newValue = asArray(['1', '2', '3']);

    expect(newValue).toEqual(['1', '2', '3']);
  });
});

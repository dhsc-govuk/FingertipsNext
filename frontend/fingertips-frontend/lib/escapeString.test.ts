import { escapeString } from './escapeString';

describe('escapeString', () => {
  it('should escape special characters correctly', () => {
    const input = '+-&|!(){}[]^"~*?:\\/';
    const expected =
      '\\+\\-\\&\\|\\!\\(\\)\\{\\}\\[\\]\\^\\\"\\~\\*\\?\\:\\\\\\/';
    expect(escapeString(input)).toBe(expected);
  });

  it('should return an empty string if input is empty', () => {
    expect(escapeString('')).toBe('');
  });

  it('should return the same string if no special characters are present', () => {
    expect(escapeString('Hello world')).toBe('Hello world');
  });

  it('should escape special character any where within the string correctly', () => {
    const input = 'When + there is faith!, (there) is hope';
    const expected = 'When \\+ there is faith\\!, \\(there\\) is hope';
    expect(escapeString(input)).toBe(expected);
  });

  it('should escape a single special character correctly', () => {
    expect(escapeString('+')).toBe('\\+');
    expect(escapeString('-')).toBe('\\-');
    expect(escapeString('&')).toBe('\\&');
  });

  it('should escape multiple occurrences of the same special character', () => {
    const input = '+&+&+';
    const expected = '\\+\\&\\+\\&\\+';
    expect(escapeString(input)).toBe(expected);
  });

  it('should escape html domain schema address', () => {
    const expected = 'https\\:\\/\\/\\*';
    const text = 'https://*';
    const actual = escapeString(text);
    expect(actual).toBe(expected);
  });
});

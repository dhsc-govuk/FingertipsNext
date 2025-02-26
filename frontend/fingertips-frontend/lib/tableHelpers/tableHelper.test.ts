import {
  convertToPercentage,
  getDisplayedValue,
  getNonAvailablePlaceHolder,
} from '.';

describe('table helpers suite', () => {
  describe('convertToPercentage', () => {
    it('should convert to percentage', () => {
      expect(convertToPercentage(379.65616)).toBe(`3.8%`);
    });

    it('should fail to convert to percentage', () => {
      const value = undefined;
      expect(convertToPercentage(value)).toHaveProperty(
        'props',
        expect.objectContaining({
          'aria-label': 'Not available',
          'data-testid': 'not-available',
        })
      );
    });
  });

  describe('getNonAvailablePlaceHolder', () => {
    it('should return expected not available X', () => {
      expect(getNonAvailablePlaceHolder()).toHaveProperty(
        'props',
        expect.objectContaining({
          'aria-label': 'Not available',
          'data-testid': 'not-available',
        })
      );
    });
  });

  describe('getDisplayedValue', () => {
    it('should display value when available', () => {
      const value = 5;
      expect(getDisplayedValue(value)).toBe(value);
    });

    it('should return X when value not available', () => {
      const value = undefined;
      expect(getDisplayedValue(value)).toHaveProperty(
        'props',
        expect.objectContaining({
          'aria-label': 'Not available',
          'data-testid': 'not-available',
        })
      );
    });
  });
});

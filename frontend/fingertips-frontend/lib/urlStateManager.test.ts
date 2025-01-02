import { generatePath } from './urlStateManager';

describe('generatePath', () => {
  it('should just return the path provided when no pathOptions are provided', () => {
    const generatedPath = generatePath('/some-path');

    expect(generatedPath).toBe('/some-path');
  });

  it('should return the indicator pathOption to the generatedPath', () => {
    const generatedPath = generatePath('/some-path', { intidicator: 'bang' });

    expect(generatedPath).toBe('/some-path?indicator=bang');
  });

  it('should return the selectedIndicator to the generatedPath', () => {
    const generatedPath = generatePath('/some-path', {
      intidicator: 'bang',
      selectedIndicators: ['1'],
    });

    expect(generatedPath).toBe('/some-path?indicator=bang&selectedIndicator=1');
  });

  it('should return all the selectedIndicators to the generatedPath', () => {
    const generatedPath = generatePath('/some-path', {
      selectedIndicators: ['1', '2'],
    });

    expect(generatedPath).toBe('/some-path?selectedIndicator=1%2C2');
  });
});

import { SearchStateManager } from './searchStateManager';

describe('SearchStateManager', () => {
  describe('generatePath', () => {
    it('should just return the path provided when no pathOptions are provided', () => {
      const stateManager = new SearchStateManager();
      const generatedPath = stateManager.generatePath('/some-path');

      expect(generatedPath).toBe('/some-path');
    });

    it('should return the indicator pathOption to the generatedPath', () => {
      const stateManager = new SearchStateManager('bang');
      const generatedPath = stateManager.generatePath('/some-path');

      expect(generatedPath).toBe('/some-path?indicator=bang');
    });

    it('should return the indicatorsSelected to the generatedPath', () => {
      const stateManager = new SearchStateManager('bang', ['1']);
      const generatedPath = stateManager.generatePath('/some-path');

      expect(generatedPath).toBe(
        '/some-path?indicator=bang&indicatorsSelected=1'
      );
    });

    it('should return all the indicatorsSelected to the generatedPath', () => {
      const stateManager = new SearchStateManager('bang', ['1', '2']);
      const generatedPath = stateManager.generatePath('/some-path');

      expect(generatedPath).toBe(
        '/some-path?indicator=bang&indicatorsSelected=1%2C2'
      );
    });
  });
});

import {
  SearchStateManager,
  encodedCommaSeperator,
} from './searchStateManager';

describe('SearchStateManager', () => {
  describe('addIndicatorSelected', () => {
    it('should add to the indicators selected array when initialy empty', () => {
      const stateManager = new SearchStateManager({ indicator: 'bang' });
      stateManager.addIndicatorSelected('1');

      const generatedPath = stateManager.generatePath('/some-path');
      expect(generatedPath).toBe(
        `/some-path?indicator=bang&indicatorsSelected=1`
      );
    });

    it('should add to the indicators selected array', () => {
      const stateManager = new SearchStateManager({
        indicator: 'bang',
        indicatorsSelected: ['1'],
      });
      stateManager.addIndicatorSelected('2');
      stateManager.addIndicatorSelected('3');

      const generatedPath = stateManager.generatePath('/some-path');
      expect(generatedPath).toBe(
        `/some-path?indicator=bang&indicatorsSelected=1${encodedCommaSeperator}2${encodedCommaSeperator}3`
      );
    });
  });

  describe('removeIndicatorSelected', () => {
    it('should remove from the indicators selected array', () => {
      const stateManager = new SearchStateManager({
        indicator: 'bang',
        indicatorsSelected: ['1', '2', '3'],
      });
      stateManager.removeIndicatorSelected('1');

      const generatedPath = stateManager.generatePath('/some-path');
      expect(generatedPath).toBe(
        `/some-path?indicator=bang&indicatorsSelected=2${encodedCommaSeperator}3`
      );
    });
  });

  describe('setStateFromParams', () => {
    it('should set the search state from URLSearchParams provided', () => {
      const params = new URLSearchParams();
      params.set('indicator', 'bang');
      params.set(
        'indicatorsSelected',
        `1${encodedCommaSeperator}2${encodedCommaSeperator}3`
      );

      const stateManager = new SearchStateManager();
      stateManager.setStateFromParams(params);

      const generatedPath = stateManager.generatePath('/some-path');
      expect(generatedPath).toBe(
        `/some-path?indicator=bang&indicatorsSelected=1${encodedCommaSeperator}2${encodedCommaSeperator}3`
      );
    });
  });

  describe('generatePath', () => {
    it('should just return the path provided when there is no state', () => {
      const stateManager = new SearchStateManager();
      const generatedPath = stateManager.generatePath('/some-path');

      expect(generatedPath).toBe('/some-path');
    });

    it('should return the indicator param to path', () => {
      const stateManager = new SearchStateManager({ indicator: 'bang' });

      const generatedPath = stateManager.generatePath('/some-path');

      expect(generatedPath).toBe('/some-path?indicator=bang');
    });

    it('should return the indicatorsSelected to the generatedPath', () => {
      const stateManager = new SearchStateManager({
        indicator: 'bang',
        indicatorsSelected: ['1'],
      });
      const generatedPath = stateManager.generatePath('/some-path');

      expect(generatedPath).toBe(
        '/some-path?indicator=bang&indicatorsSelected=1'
      );
    });
  });
});

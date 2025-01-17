import { SearchParams, SearchStateManager } from './searchStateManager';

describe('SearchStateManager', () => {
  describe('addIndicatorSelected', () => {
    it('should add to the indicators selected array when initialy empty', () => {
      const stateManager = new SearchStateManager({
        searchedIndicator: 'bang',
      });
      stateManager.addIndicatorSelected('1');

      const generatedPath = stateManager.generatePath('/some-path');
      expect(generatedPath).toBe(
        `/some-path?${SearchParams.SearchedIndicator}=bang&${SearchParams.IndicatorsSelected}=1`
      );
    });

    it('should add to the indicators selected array', () => {
      const stateManager = new SearchStateManager({
        searchedIndicator: 'bang',
        indicatorsSelected: ['1'],
      });
      stateManager.addIndicatorSelected('2');
      stateManager.addIndicatorSelected('3');

      const generatedPath = stateManager.generatePath('/some-path');
      expect(generatedPath).toBe(
        `/some-path?${SearchParams.SearchedIndicator}=bang&${SearchParams.IndicatorsSelected}=1&${SearchParams.IndicatorsSelected}=2&${SearchParams.IndicatorsSelected}=3`
      );
    });
  });

  describe('removeIndicatorSelected', () => {
    it('should remove from the indicators selected array', () => {
      const stateManager = new SearchStateManager({
        searchedIndicator: 'bang',
        indicatorsSelected: ['1', '2', '3'],
      });
      stateManager.removeIndicatorSelected('1');

      const generatedPath = stateManager.generatePath('/some-path');
      expect(generatedPath).toBe(
        `/some-path?${SearchParams.SearchedIndicator}=bang&${SearchParams.IndicatorsSelected}=2&${SearchParams.IndicatorsSelected}=3`
      );
    });
  });

  describe('removeAllIndicatorSelected', () => {
    it('should remove all items from the indicators selected array', () => {
      const stateManager = new SearchStateManager({
        searchedIndicator: 'bang',
        indicatorsSelected: ['1', '2', '3'],
      });
      stateManager.removeAllIndicatorSelected();

      const generatedPath = stateManager.generatePath('/some-path');
      expect(generatedPath).toBe(
        `/some-path?${SearchParams.SearchedIndicator}=bang`
      );
    });
  });

  describe('setStateFromParams', () => {
    it('should set the search state from URLSearchParams provided', () => {
      const params = new URLSearchParams();
      params.append(SearchParams.SearchedIndicator, 'bang');
      params.append(SearchParams.IndicatorsSelected, '1');
      params.append(SearchParams.IndicatorsSelected, '2');
      params.append(SearchParams.IndicatorsSelected, '3');

      const stateManager = SearchStateManager.setStateFromParams(params);

      const generatedPath = stateManager.generatePath('/some-path');
      expect(generatedPath).toBe(
        `/some-path?${SearchParams.SearchedIndicator}=bang&${SearchParams.IndicatorsSelected}=1&${SearchParams.IndicatorsSelected}=2&${SearchParams.IndicatorsSelected}=3`
      );
    });
  });

  describe('generatePath', () => {
    it('should only return the path provided when there is no state', () => {
      const stateManager = new SearchStateManager({});
      const generatedPath = stateManager.generatePath('/some-path');

      expect(generatedPath).toBe('/some-path');
    });

    it('should return the indicator param to path', () => {
      const stateManager = new SearchStateManager({
        searchedIndicator: 'bang',
      });

      const generatedPath = stateManager.generatePath('/some-path');

      expect(generatedPath).toBe(
        `/some-path?${SearchParams.SearchedIndicator}=bang`
      );
    });

    it('should return the indicatorsSelected to the generatedPath', () => {
      const stateManager = new SearchStateManager({
        searchedIndicator: 'bang',
        indicatorsSelected: ['1'],
      });
      const generatedPath = stateManager.generatePath('/some-path');

      expect(generatedPath).toBe(
        `/some-path?${SearchParams.SearchedIndicator}=bang&${SearchParams.IndicatorsSelected}=1`
      );
    });
  });
});

import {
  SearchParams,
  SearchState,
  SearchStateManager,
} from './searchStateManager';

describe('SearchStateManager', () => {
  describe('addIndicatorSelected', () => {
    it('should add to the indicators selected array when initially empty', () => {
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

  describe('getSearchState', () => {
    it('should return the current state', () => {
      const searchState: SearchState = {
        searchedIndicator: 'bang',
        indicatorsSelected: ['1', '2'],
        areasSelected: ['A001', 'A002'],
        areaTypeSelected: 'Some area type',
      };

      const stateManager = new SearchStateManager(searchState);

      expect(stateManager.getSearchState()).toEqual(searchState);
    });
  });

  describe('setAreaTypeSelected', () => {
    it('should set the areaTypeSelected', () => {
      const stateManager = new SearchStateManager({
        searchedIndicator: 'bang',
      });
      stateManager.setAreaTypeSelected('Some area type');

      expect(stateManager.getSearchState().areaTypeSelected).toEqual(
        'Some area type'
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
      const expectedPath = [
        `/some-path?${SearchParams.SearchedIndicator}=bang`,
        `&${SearchParams.IndicatorsSelected}=1&${SearchParams.IndicatorsSelected}=2&${SearchParams.IndicatorsSelected}=3`,
        `&${SearchParams.AreasSelected}=A001&${SearchParams.AreasSelected}=A002`,
        `&${SearchParams.AreaTypeSelected}=Some+area+type`,
      ].join('');

      const params = new URLSearchParams();
      params.append(SearchParams.SearchedIndicator, 'bang');
      params.append(SearchParams.IndicatorsSelected, '1');
      params.append(SearchParams.IndicatorsSelected, '2');
      params.append(SearchParams.IndicatorsSelected, '3');
      params.append(SearchParams.AreasSelected, 'A001');
      params.append(SearchParams.AreasSelected, 'A002');
      params.append(SearchParams.AreaTypeSelected, 'Some area type');

      const stateManager = SearchStateManager.setStateFromParams(params);

      const generatedPath = stateManager.generatePath('/some-path');
      expect(generatedPath).toBe(expectedPath);
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

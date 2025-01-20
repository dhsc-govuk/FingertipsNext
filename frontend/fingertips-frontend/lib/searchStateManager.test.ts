import {
  SearchParams,
  SearchState,
  SearchStateManager,
} from './searchStateManager';

describe('SearchStateManager', () => {
  describe('addIndicatorSelected', () => {
    it('should add to the indicators selected array when initialy empty', () => {
      const stateManager = new SearchStateManager({
        searchedIndicator: 'bang',
      });
      stateManager.addIndicatorSelected('1');

      expect(stateManager.getSearchState()).toEqual({
        searchedIndicator: 'bang',
        indicatorsSelected: ['1'],
        areasSelected: [],
      });
    });

    it('should add to the indicators selected array', () => {
      const stateManager = new SearchStateManager({
        searchedIndicator: 'bang',
        indicatorsSelected: ['1'],
      });
      stateManager.addIndicatorSelected('2');
      stateManager.addIndicatorSelected('3');

      expect(stateManager.getSearchState()).toEqual({
        searchedIndicator: 'bang',
        indicatorsSelected: ['1', '2', '3'],
        areasSelected: [],
      });
    });
  });

  describe('removeIndicatorSelected', () => {
    it('should remove from the indicators selected array', () => {
      const stateManager = new SearchStateManager({
        searchedIndicator: 'bang',
        indicatorsSelected: ['1', '2', '3'],
      });
      stateManager.removeIndicatorSelected('1');

      expect(stateManager.getSearchState()).toEqual({
        searchedIndicator: 'bang',
        indicatorsSelected: ['2', '3'],
        areasSelected: [],
      });
    });
  });

  describe('addAreaSelected', () => {
    it('should add to the areas selected array when initialy empty', () => {
      const stateManager = new SearchStateManager({
        searchedIndicator: 'bang',
      });
      stateManager.addAreaSelected('1');

      expect(stateManager.getSearchState()).toEqual({
        searchedIndicator: 'bang',
        indicatorsSelected: [],
        areasSelected: ['1'],
      });
    });

    it('should add to the areas selected array', () => {
      const stateManager = new SearchStateManager({
        searchedIndicator: 'bang',
        areasSelected: ['1'],
      });
      stateManager.addAreaSelected('2');
      stateManager.addAreaSelected('3');

      expect(stateManager.getSearchState()).toEqual({
        searchedIndicator: 'bang',
        indicatorsSelected: [],
        areasSelected: ['1', '2', '3'],
      });
    });
  });

  describe('removeAreaSelected', () => {
    it('should remove from the areas selected array', () => {
      const stateManager = new SearchStateManager({
        searchedIndicator: 'bang',
        areasSelected: ['1', '2', '3'],
      });
      stateManager.removeAreaSelected('1');

      expect(stateManager.getSearchState()).toEqual({
        searchedIndicator: 'bang',
        indicatorsSelected: [],
        areasSelected: ['2', '3'],
      });
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

      expect(stateManager.getSearchState()).toEqual({
        searchedIndicator: 'bang',
        indicatorsSelected: [],
        areasSelected: [],
      });
    });
  });

  describe('setStateFromParams', () => {
    it('should set the search state from URLSearchParams provided', () => {
      const params = new URLSearchParams();
      params.append(SearchParams.SearchedIndicator, 'bang');
      params.append(SearchParams.IndicatorsSelected, '1');
      params.append(SearchParams.IndicatorsSelected, '2');
      params.append(SearchParams.IndicatorsSelected, '3');
      params.append(SearchParams.AreasSelected, 'A001');
      params.append(SearchParams.AreasSelected, 'A002');
      params.append(SearchParams.AreaTypeSelected, 'Some area type');

      const stateManager = SearchStateManager.setStateFromParams(params);

      expect(stateManager.getSearchState()).toEqual({
        searchedIndicator: 'bang',
        indicatorsSelected: ['1', '2', '3'],
        areasSelected: ['A001', 'A002'],
        areaTypeSelected: 'Some area type',
      });
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
      const expectedPath = [
        `/some-path?${SearchParams.SearchedIndicator}=bang`,
        `&${SearchParams.IndicatorsSelected}=1&${SearchParams.IndicatorsSelected}=2`,
      ].join('');

      const stateManager = new SearchStateManager({
        searchedIndicator: 'bang',
        indicatorsSelected: ['1', '2'],
      });
      const generatedPath = stateManager.generatePath('/some-path');

      expect(generatedPath).toBe(expectedPath);
    });

    it('should return the areasSelected to the generatedPath', () => {
      const expectedPath = [
        `/some-path?${SearchParams.SearchedIndicator}=bang`,
        `&${SearchParams.IndicatorsSelected}=1`,
        `&${SearchParams.AreasSelected}=A001&${SearchParams.AreasSelected}=A002`,
      ].join('');

      const stateManager = new SearchStateManager({
        searchedIndicator: 'bang',
        indicatorsSelected: ['1'],
        areasSelected: ['A001', 'A002'],
      });
      const generatedPath = stateManager.generatePath('/some-path');

      expect(generatedPath).toBe(expectedPath);
    });

    it('should return the areaTypeSelected to the generatedPath', () => {
      const expectedPath = [
        `/some-path?${SearchParams.SearchedIndicator}=bang`,
        `&${SearchParams.IndicatorsSelected}=1`,
        `&${SearchParams.AreaTypeSelected}=Some+area+type`,
      ].join('');

      const stateManager = new SearchStateManager({
        searchedIndicator: 'bang',
        indicatorsSelected: ['1'],
        areaTypeSelected: 'Some area type',
      });
      const generatedPath = stateManager.generatePath('/some-path');

      expect(generatedPath).toBe(expectedPath);
    });
  });
});

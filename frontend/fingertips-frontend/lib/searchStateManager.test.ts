import {
  SearchParams,
  SearchStateManager,
  SearchStateParams,
} from './searchStateManager';

describe('SearchStateManager', () => {
  describe('initialise', () => {
    it('should initialise the search state from SearchStateParams provided', () => {
      const params: SearchStateParams = {
        [SearchParams.SearchedIndicator]: 'bang',
        [SearchParams.IndicatorsSelected]: ['1', '2'],
        [SearchParams.AreasSelected]: ['A001', 'A002'],
        [SearchParams.AreaTypeSelected]: 'Some area type',
        [SearchParams.GroupTypeSelected]: 'Some group type',
      };

      const stateManager = SearchStateManager.initialise(params);
      const newState = stateManager.getSearchState();

      expect(newState).toEqual({
        [SearchParams.SearchedIndicator]: 'bang',
        [SearchParams.IndicatorsSelected]: ['1', '2'],
        [SearchParams.AreasSelected]: ['A001', 'A002'],
        [SearchParams.AreaTypeSelected]: 'Some area type',
        [SearchParams.GroupTypeSelected]: 'Some group type',
      });
    });

    it('should return an empty search state if no params are provided', () => {
      const stateManager = SearchStateManager.initialise();
      const newState = stateManager.getSearchState();

      expect(newState).toEqual({});
    });
  });

  describe('addParamValueToState', () => {
    it('should add a multi value type param value to the array when initially empty', () => {
      const stateManager = SearchStateManager.initialise({
        [SearchParams.SearchedIndicator]: 'bang',
      });
      stateManager.addParamValueToState(SearchParams.IndicatorsSelected, '1');

      const newState = stateManager.getSearchState();
      expect(newState).toEqual({
        [SearchParams.SearchedIndicator]: 'bang',
        [SearchParams.IndicatorsSelected]: ['1'],
      });
    });

    it('should add a multi value type param value to an existing array', () => {
      const stateManager = SearchStateManager.initialise({
        [SearchParams.SearchedIndicator]: 'bang',
        [SearchParams.IndicatorsSelected]: ['1'],
      });

      stateManager.addParamValueToState(SearchParams.IndicatorsSelected, '2');

      const newState = stateManager.getSearchState();
      expect(newState).toEqual({
        [SearchParams.SearchedIndicator]: 'bang',
        [SearchParams.IndicatorsSelected]: ['1', '2'],
      });
    });

    it('should not add a multi value type param value if it already exists in the array', () => {
      const stateManager = SearchStateManager.initialise({
        [SearchParams.SearchedIndicator]: 'bang',
        [SearchParams.IndicatorsSelected]: ['1'],
      });

      stateManager.addParamValueToState(SearchParams.IndicatorsSelected, '1');

      const newState = stateManager.getSearchState();
      expect(newState).toEqual({
        [SearchParams.SearchedIndicator]: 'bang',
        [SearchParams.IndicatorsSelected]: ['1'],
      });
    });

    it('should add a single value type param value as string when initially empty', () => {
      const stateManager = SearchStateManager.initialise({});

      stateManager.addParamValueToState(SearchParams.SearchedIndicator, 'bang');

      const newState = stateManager.getSearchState();
      expect(newState).toEqual({
        [SearchParams.SearchedIndicator]: 'bang',
      });
    });

    it('should overwrite a single value type param value as string when it already exists', () => {
      const stateManager = SearchStateManager.initialise({
        [SearchParams.SearchedIndicator]: 'bang',
      });

      stateManager.addParamValueToState(SearchParams.SearchedIndicator, 'boom');

      const newState = stateManager.getSearchState();
      expect(newState).toEqual({
        [SearchParams.SearchedIndicator]: 'boom',
      });
    });
  });

  describe('removeParamValueFromState', () => {
    it('should remove a multi value type param value from the existing array', () => {
      const stateManager = SearchStateManager.initialise({
        [SearchParams.SearchedIndicator]: 'bang',
        [SearchParams.IndicatorsSelected]: ['1', '2', '3'],
      });

      stateManager.removeParamValueFromState(
        SearchParams.IndicatorsSelected,
        '1'
      );

      const newState = stateManager.getSearchState();
      expect(newState).toEqual({
        [SearchParams.SearchedIndicator]: 'bang',
        [SearchParams.IndicatorsSelected]: ['2', '3'],
      });
    });

    it('should remove a single value type param from state', () => {
      const stateManager = SearchStateManager.initialise({
        [SearchParams.SearchedIndicator]: 'bang',
        [SearchParams.IndicatorsSelected]: ['1', '2', '3'],
        [SearchParams.AreaTypeSelected]: 'Some area type',
      });

      stateManager.removeParamValueFromState(SearchParams.AreaTypeSelected);

      const newState = stateManager.getSearchState();
      expect(newState).toEqual({
        [SearchParams.SearchedIndicator]: 'bang',
        [SearchParams.IndicatorsSelected]: ['1', '2', '3'],
      });
    });
  });

  describe('removeAllParamFromState', () => {
    it('should remove the entire multi value type param value', () => {
      const stateManager = SearchStateManager.initialise({
        [SearchParams.SearchedIndicator]: 'bang',
        [SearchParams.IndicatorsSelected]: ['1', '2', '3'],
      });

      stateManager.removeAllParamFromState(SearchParams.IndicatorsSelected);

      const newState = stateManager.getSearchState();
      expect(newState).toEqual({
        [SearchParams.SearchedIndicator]: 'bang',
      });
    });

    it('should remove the entire single value type param value', () => {
      const stateManager = SearchStateManager.initialise({
        [SearchParams.SearchedIndicator]: 'bang',
        [SearchParams.IndicatorsSelected]: ['1', '2', '3'],
      });

      stateManager.removeAllParamFromState(SearchParams.SearchedIndicator);

      const newState = stateManager.getSearchState();
      expect(newState).toEqual({
        [SearchParams.IndicatorsSelected]: ['1', '2', '3'],
      });
    });
  });

  describe('getSearchState', () => {
    it('should return the current state', () => {
      const state: SearchStateParams = {
        [SearchParams.SearchedIndicator]: 'bang',
        [SearchParams.IndicatorsSelected]: ['1', '2'],
        [SearchParams.AreasSelected]: ['A001', 'A002'],
        [SearchParams.AreaTypeSelected]: 'Some area type',
        [SearchParams.GroupTypeSelected]: 'Some group type',
      };

      const stateManager = SearchStateManager.initialise(state);

      expect(stateManager.getSearchState()).toEqual(state);
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
      params.append(SearchParams.GroupTypeSelected, 'Some group type');

      const stateManager = SearchStateManager.setStateFromParams(params);
      const newState = stateManager.getSearchState();

      expect(newState).toEqual({
        [SearchParams.SearchedIndicator]: 'bang',
        [SearchParams.IndicatorsSelected]: ['1', '2', '3'],
        [SearchParams.AreasSelected]: ['A001', 'A002'],
        [SearchParams.AreaTypeSelected]: 'Some area type',
        [SearchParams.GroupTypeSelected]: 'Some group type',
      });
    });
  });

  describe('generatePath', () => {
    it('should only return the path provided when there is no state', () => {
      const stateManager = SearchStateManager.initialise();
      const generatedPath = stateManager.generatePath('/some-path');

      expect(generatedPath).toBe('/some-path');
    });

    it('should return the provided state to the generatedPath', () => {
      const expectedPath = [
        `/some-path?${SearchParams.SearchedIndicator}=bang`,
        `&${SearchParams.IndicatorsSelected}=1&${SearchParams.IndicatorsSelected}=2`,
        `&${SearchParams.AreasSelected}=A001&${SearchParams.AreasSelected}=A002`,
        `&${SearchParams.AreaTypeSelected}=Some+area+type`,
        `&${SearchParams.GroupTypeSelected}=Some+group+type`,
      ].join('');

      const stateManager = SearchStateManager.initialise({
        [SearchParams.SearchedIndicator]: 'bang',
        [SearchParams.IndicatorsSelected]: ['1', '2'],
        [SearchParams.AreasSelected]: ['A001', 'A002'],
        [SearchParams.AreaTypeSelected]: 'Some area type',
        [SearchParams.GroupTypeSelected]: 'Some group type',
      });

      const generatedPath = stateManager.generatePath('/some-path');

      expect(generatedPath).toBe(expectedPath);
    });
  });
});

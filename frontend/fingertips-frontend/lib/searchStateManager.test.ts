import { ALL_AREAS_SELECTED } from './areaFilterHelpers/constants';
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
        [SearchParams.GroupSelected]: 'A003',
        [SearchParams.GroupAreaSelected]: ALL_AREAS_SELECTED,
      };

      const stateManager = SearchStateManager.initialise(params);
      const newState = stateManager.getSearchState();

      expect(newState).toEqual({
        [SearchParams.SearchedIndicator]: 'bang',
        [SearchParams.IndicatorsSelected]: ['1', '2'],
        [SearchParams.AreasSelected]: ['A001', 'A002'],
        [SearchParams.AreaTypeSelected]: 'Some area type',
        [SearchParams.GroupTypeSelected]: 'Some group type',
        [SearchParams.GroupSelected]: 'A003',
        [SearchParams.GroupAreaSelected]: ALL_AREAS_SELECTED,
      });
    });

    it('should return an empty search state if no params are provided', () => {
      const stateManager = SearchStateManager.initialise();
      const newState = stateManager.getSearchState();

      expect(newState).toEqual({});
    });
  });

  describe('setState', () => {
    it('should update the searchState with state provided', () => {
      const params: SearchStateParams = {
        [SearchParams.SearchedIndicator]: 'bang',
        [SearchParams.IndicatorsSelected]: ['1', '2'],
      };

      const stateManager = SearchStateManager.initialise(params);

      stateManager.setState({
        ...params,
        [SearchParams.AreasSelected]: ['A001', 'A002'],
      });

      expect(stateManager.getSearchState()).toEqual({
        [SearchParams.SearchedIndicator]: 'bang',
        [SearchParams.IndicatorsSelected]: ['1', '2'],
        [SearchParams.AreasSelected]: ['A001', 'A002'],
      });
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

  describe('addAllParamsToState', () => {
    it('should replace all the param values currently in state for the param key with the params provided', () => {
      const initialAreasSelected = ['A001', 'A002'];
      const updatedAreasSelected = ['A002', 'A003', 'A004'];

      const stateManager = SearchStateManager.initialise({
        [SearchParams.AreasSelected]: initialAreasSelected,
      });

      stateManager.addAllParamsToState(
        SearchParams.AreasSelected,
        updatedAreasSelected
      );

      const newState = stateManager.getSearchState();
      expect(newState).toEqual({
        [SearchParams.AreasSelected]: updatedAreasSelected,
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
        [SearchParams.GroupSelected]: 'A003',
      };

      const stateManager = SearchStateManager.initialise(state);

      expect(stateManager.getSearchState()).toEqual(state);
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
        `&${SearchParams.GroupSelected}=A003`,
        `&${SearchParams.GroupAreaSelected}=ALL`
      ].join('');

      const stateManager = SearchStateManager.initialise({
        [SearchParams.SearchedIndicator]: 'bang',
        [SearchParams.IndicatorsSelected]: ['1', '2'],
        [SearchParams.AreasSelected]: ['A001', 'A002'],
        [SearchParams.AreaTypeSelected]: 'Some area type',
        [SearchParams.GroupTypeSelected]: 'Some group type',
        [SearchParams.GroupSelected]: 'A003',
        [SearchParams.GroupAreaSelected]: ALL_AREAS_SELECTED
      });

      const generatedPath = stateManager.generatePath('/some-path');

      expect(generatedPath).toBe(expectedPath);
    });
  });
});

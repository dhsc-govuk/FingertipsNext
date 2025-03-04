import { SearchParams, SearchStateParams } from '@/lib/searchStateManager';
import {
  IndicatorSelectionState,
  submitIndicatorSelection,
} from './indicatorSelectionActions';
import { redirect, RedirectType } from 'next/navigation';
import { areaCodeForEngland } from '@/lib/chartHelpers/constants';

jest.mock('next/navigation');
const redirectMock = jest.mocked(redirect);

const state: SearchStateParams = {
  [SearchParams.SearchedIndicator]: 'boom',
  [SearchParams.AreasSelected]: ['A001', 'A002'],
};

const initialState: IndicatorSelectionState = {
  searchState: JSON.stringify(state),
  indicatorsSelected: [],
};
let formData: FormData;

describe('Indicator Selection Actions', () => {
  beforeEach(() => {
    jest.clearAllMocks();
  });

  describe('submitIndicatorSelection', () => {
    it('should redirect to the charts page with the indicators selected in the query params', async () => {
      const expectedPath = [
        `/chart?${SearchParams.SearchedIndicator}=boom`,
        `&${SearchParams.IndicatorsSelected}=1&${SearchParams.IndicatorsSelected}=2`,
        `&${SearchParams.AreasSelected}=A001&${SearchParams.AreasSelected}=A002`,
      ].join('');

      formData = new FormData();
      formData.append('searchState', JSON.stringify(state));
      formData.append('indicator', '1');
      formData.append('indicator', '2');

      await submitIndicatorSelection(initialState, formData);

      expect(redirectMock).toHaveBeenCalledWith(
        expectedPath,
        RedirectType.push
      );
    });

    it('should redirect to the charts page with the areasSelected defaulted to areaCodeForEngland when no areasSelected are present in searchState', async () => {
      const expectedPath = [
        `/chart?${SearchParams.SearchedIndicator}=boom`,
        `&${SearchParams.IndicatorsSelected}=1&${SearchParams.IndicatorsSelected}=2`,
        `&${SearchParams.AreasSelected}=${areaCodeForEngland}`,
      ].join('');

      const stateWithNoAreasSelected = {
        ...state,
        [SearchParams.AreasSelected]: undefined,
      };

      const initialStateWithNoAreasSelected = {
        searchState: JSON.stringify(stateWithNoAreasSelected),
        indicatorsSelected: [],
      };

      formData = new FormData();
      formData.append('searchState', JSON.stringify(stateWithNoAreasSelected));
      formData.append('indicator', '1');
      formData.append('indicator', '2');

      await submitIndicatorSelection(initialStateWithNoAreasSelected, formData);

      expect(redirectMock).toHaveBeenCalledWith(
        expectedPath,
        RedirectType.push
      );
    });

    it('should return an error message when no indicators are selected', async () => {
      formData = new FormData();
      formData.append('searchedIndicator', 'boom');

      const state = await submitIndicatorSelection(initialState, formData);

      expect(state.message).toBe('Please select at least one indicator');
    });
  });
});

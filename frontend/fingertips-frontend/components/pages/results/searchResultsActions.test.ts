import { SearchParams } from '@/lib/searchStateManager';
import { SearchResultState, viewCharts } from './searchResultsActions';
import { redirect, RedirectType } from 'next/navigation';

jest.mock('next/navigation');
const redirectMock = jest.mocked(redirect);

const initialState: SearchResultState = {
  indicatorsSelected: [],
};
let formData: FormData;

describe('Search Results Actions', () => {
  describe('viewCharts', () => {
    it('should redirect to the charts page with the indicators selected in the query params', async () => {
      formData = new FormData();
      formData.append('searchedIndicator', 'boom');
      formData.append('indicator', '1');
      formData.append('indicator', '2');

      await viewCharts(initialState, formData);

      expect(redirectMock).toHaveBeenCalledWith(
        `/chart?${SearchParams.SearchedIndicator}=boom&${SearchParams.IndicatorsSelected}=1&${SearchParams.IndicatorsSelected}=2`,
        RedirectType.push
      );
    });

    it('should return an error message when no indicators are selected', async () => {
      formData = new FormData();
      formData.append('searchedIndicator', 'boom');

      const state = await viewCharts(initialState, formData);

      expect(state.message).toBe('Please select at least one indicator');
    });
  });
});

import { SomeState, viewCharts } from './searchResultsActions';
import { redirect, RedirectType } from 'next/navigation';

jest.mock('next/navigation');
const redirectMock = jest.mocked(redirect);

const initialState: SomeState = {
  indicators: [],
};

describe('Search Results Actions', () => {
  describe('viewCharts', () => {
    it('should redirect to the charts page with the indicators selected in the query params', async () => {
      const formData: FormData = new FormData();
      formData.append('indicators', '1');
      formData.append('indicators', '2');

      await viewCharts(initialState, formData);

      expect(redirectMock).toHaveBeenCalledWith(
        '/chart?indicators=1,2',
        RedirectType.push
      );
    });
  });
});

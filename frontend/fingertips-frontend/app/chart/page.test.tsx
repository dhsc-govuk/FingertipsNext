/**
 * @jest-environment node
 */

import { areaCodeForEngland } from '@/lib/chartHelpers/constants';
import ChartPage from './page';
import { SearchParams, SearchStateParams } from '@/lib/searchStateManager';

const mockGetHealthData = jest.fn();

jest.mock('@/lib/getApiConfiguration');
jest.mock('@/generated-sources/ft-api-client', () => {
  return {
    IndicatorsApi: jest.fn().mockImplementation(() => {
      return {
        getHealthDataForAnIndicator: mockGetHealthData,
      };
    }),
  };
});

jest.mock('@/components/pages/chart');

const searchParams: SearchStateParams = {
  [SearchParams.SearchedIndicator]: 'testing',
  [SearchParams.IndicatorsSelected]: ['1'],
  [SearchParams.AreasSelected]: ['A001'],
};

async function generateSearchParams(value: SearchStateParams) {
  return value;
}

describe('Chart Page', () => {
  it('should make 2 calls for get health data - first one for the indicator the next one for the population data', async () => {
    mockGetHealthData.mockResolvedValueOnce([]);
    mockGetHealthData.mockResolvedValueOnce([]);

    await ChartPage({
      searchParams: generateSearchParams(searchParams),
    });

    expect(mockGetHealthData).toHaveBeenNthCalledWith(1, {
      areaCodes: ['A001'],
      indicatorId: 1,
    });
    expect(mockGetHealthData).toHaveBeenNthCalledWith(2, {
      areaCodes: ['A001', areaCodeForEngland],
      indicatorId: 92708,
    });
  });

  // it('should pass the correct props to the SearchResults Page component', async () => {
  //   mockGetAreaTypes.mockResolvedValue(mockAreaTypes);
  //   mockSearchWith.mockResolvedValue(mockIndicatorSearchResults);

  //   const page = await ResultsPage({
  //     searchParams: generateSearchParams(searchParams),
  //   });

  //   expect(page.props.searchResultsFormState).toEqual({
  //     errors: {},
  //     indicatorsSelected: [],
  //     message: null,
  //     searchedIndicator: 'testing',
  //   });
  //   expect(page.props.searchResults).toEqual(mockIndicatorSearchResults);
  //   expect(page.props.availableAreaTypes).toEqual(mockAreaTypes);
  // });

  // // To unskip as part of DHSCFT-211
  // it.skip('should pass the correct props to the Error component when getAreaTypes call returns an error', async () => {
  //   mockGetAreaTypes.mockRejectedValue('Some areas api error');

  //   const page = await ResultsPage({
  //     searchParams: generateSearchParams(searchParams),
  //   });

  //   expect(page.props.errorText).toEqual(
  //     'An error has been returned by the service. Please try again.'
  //   );
  //   expect(page.props.errorLink).toEqual('/search');
  //   expect(page.props.errorLinkText).toEqual('Return to Search');
  // });

  // it('should pass the correct props to the Error component when searchWith returns an error', async () => {
  //   mockGetAreaTypes.mockResolvedValue(mockAreaTypes);
  //   mockSearchWith.mockRejectedValue('Some search-service error');

  //   const page = await ResultsPage({
  //     searchParams: generateSearchParams(searchParams),
  //   });

  //   expect(page.props.errorText).toEqual(
  //     'An error has been returned by the service. Please try again.'
  //   );
  //   expect(page.props.errorLink).toEqual('/search');
  //   expect(page.props.errorLinkText).toEqual('Return to Search');
  // });
});

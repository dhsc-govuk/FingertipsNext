/**
 * @jest-environment node
 */

import { IndicatorSearchResult } from '@/lib/search/searchResultData';
import ResultsPage from './page';
import { SearchParams, SearchStateParams } from '@/lib/searchStateManager';

const mockAreaTypes = ['Some area type 1', 'Some area type 2'];

const generateIndicatorSearchResults = (id: string): IndicatorSearchResult => ({
  indicatorId: id,
  indicatorName: `indicator name for id ${id}`,
});
const mockIndicatorSearchResults: IndicatorSearchResult[] = [
  generateIndicatorSearchResults('1'),
  generateIndicatorSearchResults('2'),
];

const mockGetAreaTypes = jest.fn();
const mockSearchWith = jest.fn();

jest.mock('@/lib/getApiConfiguration');
jest.mock('@/generated-sources/ft-api-client', () => {
  return {
    AreasApi: jest.fn().mockImplementation(() => {
      return {
        getAreaTypes: mockGetAreaTypes,
      };
    }),
  };
});

jest.mock('@/lib/search/searchResultData', () => {
  return {
    getSearchService: jest.fn().mockImplementation(() => {
      return {
        searchWith: mockSearchWith,
      };
    }),
  };
});

jest.mock('@/components/pages/results');

const searchParams: SearchStateParams = {
  [SearchParams.SearchedIndicator]: 'testing',
};

async function generateSearchParams(value: SearchStateParams) {
  return value;
}

describe('Results Page', () => {
  it('should have made calls to getAreaTypes and searchResults', async () => {
    mockGetAreaTypes.mockResolvedValue(mockAreaTypes);
    mockSearchWith.mockResolvedValue(mockIndicatorSearchResults);

    await ResultsPage({
      searchParams: generateSearchParams(searchParams),
    });

    expect(mockGetAreaTypes).toHaveBeenCalled();
    expect(mockSearchWith).toHaveBeenCalled();
  });

  it('should pass the correct props to the SearchResults Page component', async () => {
    mockGetAreaTypes.mockResolvedValue(mockAreaTypes);
    mockSearchWith.mockResolvedValue(mockIndicatorSearchResults);

    const page = await ResultsPage({
      searchParams: generateSearchParams(searchParams),
    });

    expect(page.props.searchResultsFormState).toEqual({
      errors: {},
      indicatorsSelected: [],
      message: null,
      searchedIndicator: 'testing',
    });
    expect(page.props.searchResults).toEqual(mockIndicatorSearchResults);
    expect(page.props.availableAreaTypes).toEqual(mockAreaTypes);
  });

  it('should pass the correct props to the Error component when getAreaTypes call returns an error', async () => {
    mockGetAreaTypes.mockRejectedValue('Some areas api error');

    const page = await ResultsPage({
      searchParams: generateSearchParams(searchParams),
    });

    expect(page.props.errorText).toEqual(
      'An error has been returned by the service. Please try again.'
    );
    expect(page.props.errorLink).toEqual('/search');
    expect(page.props.errorLinkText).toEqual('Return to Search');
  });

  it('should pass the correct props to the Error component when searchWith returns an error', async () => {
    mockGetAreaTypes.mockResolvedValue(mockAreaTypes);
    mockSearchWith.mockRejectedValue('Some search-service error');

    const page = await ResultsPage({
      searchParams: generateSearchParams(searchParams),
    });

    expect(page.props.errorText).toEqual(
      'An error has been returned by the service. Please try again.'
    );
    expect(page.props.errorLink).toEqual('/search');
    expect(page.props.errorLinkText).toEqual('Return to Search');
  });
});

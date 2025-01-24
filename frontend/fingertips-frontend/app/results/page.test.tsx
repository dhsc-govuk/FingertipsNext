/**
 * @jest-environment node
 */

import ResultsPage from './page';
import { SearchParams, SearchStateParams } from '@/lib/searchStateManager';
import {
  IIndicatorSearchService,
  IndicatorDocument,
} from '@/lib/search/searchTypes';
import { SearchServiceFactory } from '@/lib/search/searchServiceFactory';
import { mockDeep } from 'jest-mock-extended';

const mockAreaTypes = ['Some area type 1', 'Some area type 2'];

const generateIndicatorSearchResults = (id: string): IndicatorDocument => ({
  indicatorId: id,
  name: `indicator name for id ${id}`,
  definition: `Some definition for id ${id}`,
  dataSource: `Some data source for id ${id}`,
  latestDataPeriod: '2023',
  lastUpdated: new Date(),
});
const mockIndicatorSearchResults: IndicatorDocument[] = [
  generateIndicatorSearchResults('1'),
  generateIndicatorSearchResults('2'),
];

const mockGetAreaTypes = jest.fn();
const mockIndicatorSearchService = mockDeep<IIndicatorSearchService>();

jest.mock('@/lib/getApiConfiguration');
jest.mock('@/generated-sources/ft-api-client', () => ({
  AreasApi: jest.fn().mockImplementation(() => ({
    getAreaTypes: mockGetAreaTypes,
  })),
}));

jest.mock('@/components/pages/results');

SearchServiceFactory.getIndicatorSearchService = () =>
  mockIndicatorSearchService;

const searchParams: SearchStateParams = {
  [SearchParams.SearchedIndicator]: 'testing',
};

async function generateSearchParams(value: SearchStateParams) {
  return value;
}

describe('Results Page', () => {
  afterEach(() => {
    jest.clearAllMocks();
  });

  it('should have made calls to getAreaTypes and searchResults', async () => {
    mockGetAreaTypes.mockResolvedValue(mockAreaTypes);
    mockIndicatorSearchService.searchWith.mockResolvedValue(
      mockIndicatorSearchResults
    );

    await ResultsPage({
      searchParams: generateSearchParams(searchParams),
    });

    expect(mockGetAreaTypes).toHaveBeenCalled();
    expect(mockIndicatorSearchService.searchWith).toHaveBeenCalledWith(
      'testing'
    );
  });

  it('should pass the correct props to the SearchResults Page component', async () => {
    mockGetAreaTypes.mockResolvedValue(mockAreaTypes);
    mockIndicatorSearchService.searchWith.mockResolvedValue(
      mockIndicatorSearchResults
    );

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

  // To unskip as part of DHSCFT-211
  it.skip('should pass the correct props to the Error component when getAreaTypes call returns an error', async () => {
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
    mockIndicatorSearchService.searchWith.mockRejectedValue(
      'Some search-service error'
    );

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

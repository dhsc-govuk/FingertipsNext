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
import { ApiClientFactory } from '@/lib/apiClient/apiClientFactory';
import {
  AreasApi,
  AreaType,
  AreaWithRelations,
} from '@/generated-sources/ft-api-client';
import { mockAvailableAreas } from '@/mock/data/areaData';

const generateAreaType = (name: string, level: number): AreaType => ({
  name,
  level,
  hierarchyName: `hierarchyName for ${name}`,
});

const mockAreaTypes: AreaType[] = [
  generateAreaType('A002', 2),
  generateAreaType('A001', 1),
];

const mockSortedAreaTypes: AreaType[] = [
  generateAreaType('A001', 1),
  generateAreaType('A002', 2),
];

const generateMockArea = (code: string): AreaWithRelations => ({
  code,
  hierarchyName: `hierarchy name for ${code}`,
  areaType: `area type for ${code}`,
  name: `name for ${code}`,
});

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

const mockIndicatorSearchService = mockDeep<IIndicatorSearchService>();
const mockAreasApi = mockDeep<AreasApi>();

jest.mock('@/components/pages/results');

SearchServiceFactory.getIndicatorSearchService = () =>
  mockIndicatorSearchService;

ApiClientFactory.getAreasApiClient = () => mockAreasApi;

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
    mockAreasApi.getAreaTypes.mockResolvedValue(mockAreaTypes);
    mockIndicatorSearchService.searchWith.mockResolvedValue(
      mockIndicatorSearchResults
    );

    await ResultsPage({
      searchParams: generateSearchParams(searchParams),
    });

    expect(mockAreasApi.getAreaTypes).toHaveBeenCalled();
    expect(mockIndicatorSearchService.searchWith).toHaveBeenCalledWith(
      'testing'
    );
  });

  it('should have made a call to getAreaTypeMembers when an areaType has been selected', async () => {
    mockAreasApi.getAreaTypes.mockResolvedValue(mockAreaTypes);
    mockAreasApi.getAreaTypeMembers.mockResolvedValue(
      mockAvailableAreas['NHS Region']
    );

    await ResultsPage({
      searchParams: generateSearchParams({
        ...searchParams,
        [SearchParams.AreaTypeSelected]: 'NHS Region',
      }),
    });

    expect(mockAreasApi.getAreaTypeMembers).toHaveBeenCalled();
    expect(mockAreasApi.getAreaTypeMembers).toHaveBeenCalledWith({
      areaType: 'NHS Region',
    });
  });

  it('should have made calls to get area data for all the areas selected', async () => {
    mockAreasApi.getArea.mockResolvedValueOnce(generateMockArea('A001'));
    mockAreasApi.getArea.mockResolvedValueOnce(generateMockArea('A002'));

    mockIndicatorSearchService.searchWith.mockResolvedValue(
      mockIndicatorSearchResults
    );

    await ResultsPage({
      searchParams: generateSearchParams({
        ...searchParams,
        [SearchParams.AreasSelected]: ['A001', 'A002'],
      }),
    });

    expect(mockAreasApi.getArea).toHaveBeenNthCalledWith(1, {
      areaCode: 'A001',
    });
    expect(mockAreasApi.getArea).toHaveBeenNthCalledWith(2, {
      areaCode: 'A002',
    });
    expect(mockIndicatorSearchService.searchWith).toHaveBeenCalledWith(
      'testing'
    );
  });

  it('should pass the correct props to the SearchResults Page component', async () => {
    const searchState: SearchStateParams = {
      ...searchParams,
      [SearchParams.IndicatorsSelected]: ['1', '2'],
      [SearchParams.AreaTypeSelected]: 'Some area type',
      [SearchParams.GroupTypeSelected]: 'Some group type',
    };

    mockAreasApi.getAreaTypes.mockResolvedValue(mockAreaTypes);
    mockAreasApi.getAreaTypeMembers.mockResolvedValue(
      mockAvailableAreas['NHS Region']
    );
    mockIndicatorSearchService.searchWith.mockResolvedValue(
      mockIndicatorSearchResults
    );

    const page = await ResultsPage({
      searchParams: generateSearchParams(searchState),
    });

    expect(page.props.searchResultsFormState).toEqual({
      errors: {},
      indicatorsSelected: ['1', '2'],
      message: null,
      searchState: JSON.stringify(searchState),
    });
    expect(page.props.searchResults).toEqual(mockIndicatorSearchResults);
    expect(page.props.availableAreaTypes).toEqual(mockSortedAreaTypes);
    expect(page.props.availableAreas).toEqual(mockAvailableAreas['NHS Region']);
    expect(page.props.searchState).toEqual(searchState);
  });

  it('should pass the correct props to the SearchResults Page component when there are areasSelected', async () => {
    const searchState: SearchStateParams = {
      ...searchParams,
      [SearchParams.AreasSelected]: ['A001', 'A002'],
      [SearchParams.AreaTypeSelected]: 'Some area type',
      [SearchParams.GroupTypeSelected]: 'Some group type',
    };

    mockAreasApi.getArea.mockResolvedValueOnce(generateMockArea('A001'));
    mockAreasApi.getArea.mockResolvedValueOnce(generateMockArea('A002'));
    mockIndicatorSearchService.searchWith.mockResolvedValue(
      mockIndicatorSearchResults
    );

    const page = await ResultsPage({
      searchParams: generateSearchParams(searchState),
    });

    expect(page.props.searchResultsFormState).toEqual({
      errors: {},
      indicatorsSelected: [],
      message: null,
      searchState: JSON.stringify(searchState),
    });
    expect(page.props.searchResults).toEqual(mockIndicatorSearchResults);
    expect(page.props.availableAreaTypes).toEqual(mockSortedAreaTypes);
    expect(page.props.searchState).toEqual(searchState);
  });

  it('should pass the correct props to the Error component when getAreaTypes call returns an error', async () => {
    mockAreasApi.getAreaTypes.mockRejectedValue('Some areas api error');

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
    mockAreasApi.getAreaTypes.mockResolvedValue(mockAreaTypes);
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

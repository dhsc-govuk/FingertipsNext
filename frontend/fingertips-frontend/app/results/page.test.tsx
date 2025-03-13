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
import { AreasApi } from '@/generated-sources/ft-api-client';
import {
  mockAreaDataForNHSRegion,
  mockAvailableAreas,
} from '@/mock/data/areaData';
import {
  allAreaTypes,
  englandAreaType,
  nhsRegionsAreaType,
} from '@/lib/areaFilterHelpers/areaType';
import {
  eastEnglandNHSRegion,
  londonNHSRegion,
} from '@/mock/data/areas/nhsRegionsAreas';
import { areaCodeForEngland } from '@/lib/chartHelpers/constants';
import { getAreaFilterData } from '@/lib/areaFilterHelpers/getAreaFilterData';

jest.mock('@/lib/areaFilterHelpers/getAreaFilterData');

const mockGetAreaFilterData = getAreaFilterData as jest.MockedFunction<
  typeof getAreaFilterData
>;

const generateIndicatorSearchResults = (id: string): IndicatorDocument => ({
  indicatorID: id,
  indicatorName: `indicator name for id ${id}`,
  indicatorDefinition: `Some definition for id ${id}`,
  dataSource: `Some data source for id ${id}`,
  earliestDataPeriod: '2022',
  latestDataPeriod: '2023',
  lastUpdatedDate: new Date(),
  associatedAreaCodes: [],
  unitLabel: 'some unit label',
  hasInequalities: true,
  usedInPoc: true,
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

  describe('Check correct props are passed to SearchResults Page component', () => {
    it('should pass initialIndicatorSelectionState prop based upon the searchParams and updatedSearchState from getAreaFilterData call', async () => {
      const initialSearchState = {
        ...searchParams,
        [SearchParams.IndicatorsSelected]: ['1', '2'],
        [SearchParams.AreasSelected]: ['E40000007', 'E40000003'],
      };

      const updatedSearchState = {
        ...initialSearchState,
        [SearchParams.GroupTypeSelected]: 'england',
        [SearchParams.GroupSelected]: areaCodeForEngland,
      };

      mockGetAreaFilterData.mockResolvedValue({ updatedSearchState });

      const searchState: SearchStateParams = {
        ...searchParams,
        [SearchParams.IndicatorsSelected]: ['1', '2'],
        [SearchParams.AreaTypeSelected]: 'nhs-regions',
      };

      const page = await ResultsPage({
        searchParams: generateSearchParams(searchState),
      });

      expect(page.props.initialIndicatorSelectionState).toEqual({
        searchState: JSON.stringify(updatedSearchState),
        indicatorsSelected: ['1', '2'],
        message: null,
        errors: {},
      });
    });

    it('should pass the searchResults prop with the results of the searchWith call', async () => {
      mockIndicatorSearchService.searchWith.mockResolvedValue(
        mockIndicatorSearchResults
      );

      const searchState: SearchStateParams = {
        ...searchParams,
        [SearchParams.IndicatorsSelected]: ['1', '2'],
      };

      const page = await ResultsPage({
        searchParams: generateSearchParams(searchState),
      });

      expect(mockIndicatorSearchService.searchWith).toHaveBeenCalledWith(
        'testing',
        undefined
      );
      expect(page.props.searchResults).toEqual(mockIndicatorSearchResults);
    });

    it('should pass the searchResults prop with the results of the searchWith filtered by areas selected', async () => {
      mockIndicatorSearchService.searchWith.mockResolvedValue(
        mockIndicatorSearchResults
      );
      mockAreasApi.getArea.mockResolvedValueOnce(eastEnglandNHSRegion);
      mockAreasApi.getArea.mockResolvedValueOnce(londonNHSRegion);

      const searchState: SearchStateParams = {
        ...searchParams,
        [SearchParams.IndicatorsSelected]: ['1', '2'],
        [SearchParams.AreasSelected]: ['E40000007', 'E40000003'],
      };

      const page = await ResultsPage({
        searchParams: generateSearchParams(searchState),
      });

      expect(mockIndicatorSearchService.searchWith).toHaveBeenCalledWith(
        'testing',
        ['E40000007', 'E40000003']
      );
      expect(page.props.searchResults).toEqual(mockIndicatorSearchResults);
    });

    it('should pass the areaFilterData prop with the data from the getAreaFilterData call', async () => {
      const areaFilterData = {
        availableAreaTypes: allAreaTypes,
        availableGroupTypes: [nhsRegionsAreaType, englandAreaType],
        availableGroups: mockAvailableAreas['nhs-integrated-care-boards'],
        availableAreas:
          mockAreaDataForNHSRegion[eastEnglandNHSRegion.code].children,
      };

      mockGetAreaFilterData.mockResolvedValue(areaFilterData);

      const searchState: SearchStateParams = {
        ...searchParams,
        [SearchParams.IndicatorsSelected]: ['1', '2'],
      };

      const page = await ResultsPage({
        searchParams: generateSearchParams(searchState),
      });

      expect(mockGetAreaFilterData).toHaveBeenCalledWith(searchState, []);
      expect(page.props.areaFilterData).toEqual(areaFilterData);
    });

    it('should pass the selectedAreasData prop with data from getArea for each areaSelected', async () => {
      mockGetAreaFilterData.mockResolvedValue({});
      mockAreasApi.getArea.mockResolvedValueOnce(eastEnglandNHSRegion);
      mockAreasApi.getArea.mockResolvedValueOnce(londonNHSRegion);

      const searchState: SearchStateParams = {
        ...searchParams,
        [SearchParams.IndicatorsSelected]: ['1', '2'],
        [SearchParams.AreasSelected]: ['E40000007', 'E40000003'],
      };

      const page = await ResultsPage({
        searchParams: generateSearchParams(searchState),
      });

      expect(mockAreasApi.getArea).toHaveBeenNthCalledWith(
        1,
        {
          areaCode: eastEnglandNHSRegion.code,
        },
        { next: { revalidate: 3600 } }
      );
      expect(mockAreasApi.getArea).toHaveBeenNthCalledWith(
        2,
        {
          areaCode: londonNHSRegion.code,
        },
        { next: { revalidate: 3600 } }
      );
      expect(page.props.selectedAreasData).toEqual([
        eastEnglandNHSRegion,
        londonNHSRegion,
      ]);
    });

    it('should pass the searchState prop with data from the params and updated by getAreaFilterData call', async () => {
      const initialSearchState = {
        ...searchParams,
        [SearchParams.IndicatorsSelected]: ['1', '2'],
        [SearchParams.AreasSelected]: ['E40000007', 'E40000003'],
      };

      const updatedSearchState = {
        ...initialSearchState,
        [SearchParams.GroupTypeSelected]: 'england',
        [SearchParams.GroupSelected]: areaCodeForEngland,
      };

      mockGetAreaFilterData.mockResolvedValue({
        updatedSearchState,
      });

      mockAreasApi.getArea.mockResolvedValueOnce({
        ...eastEnglandNHSRegion,
      });
      mockAreasApi.getArea.mockResolvedValueOnce({
        ...londonNHSRegion,
      });

      const page = await ResultsPage({
        searchParams: generateSearchParams(initialSearchState),
      });

      expect(page.props.searchState).toEqual(updatedSearchState);
    });

    it('should pass the current date prop', async () => {
      const date = new Date('January 1, 2000');
      jest.useFakeTimers();
      jest.setSystemTime(date);

      const page = await ResultsPage({});

      expect(page.props.currentDate).toEqual(date);

      jest.useRealTimers();
    });
  });

  describe('Check correct props to the error component are passed when there is an error', () => {
    it('should pass the correct props when getAreaFilterData call returns an error', async () => {
      mockGetAreaFilterData.mockRejectedValue('Some areas api error');

      const page = await ResultsPage({
        searchParams: generateSearchParams(searchParams),
      });

      expect(page.props.errorText).toEqual(
        'An error has been returned by the service. Please try again.'
      );
      expect(page.props.errorLink).toEqual('/');
      expect(page.props.errorLinkText).toEqual('Return to Search');
    });

    it('should pass the correct props when searchWith returns an error', async () => {
      mockAreasApi.getAreaTypes.mockResolvedValue(allAreaTypes);
      mockIndicatorSearchService.searchWith.mockRejectedValue(
        'Some search-service error'
      );

      const page = await ResultsPage({
        searchParams: generateSearchParams(searchParams),
      });

      expect(page.props.errorText).toEqual(
        'An error has been returned by the service. Please try again.'
      );
      expect(page.props.errorLink).toEqual('/');
      expect(page.props.errorLinkText).toEqual('Return to Search');
    });
  });
});

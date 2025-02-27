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
import { AreasApi, AreaType } from '@/generated-sources/ft-api-client';
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
import { englandArea } from '@/mock/data/areas/englandAreas';

const mockSortedAreaTypes: AreaType[] = allAreaTypes.toSorted(
  (a, b) => a.level - b.level
);

const generateIndicatorSearchResults = (id: string): IndicatorDocument => ({
  indicatorID: id,
  indicatorName: `indicator name for id ${id}`,
  indicatorDefinition: `Some definition for id ${id}`,
  dataSource: `Some data source for id ${id}`,
  earliestDataPeriod: '2022',
  latestDataPeriod: '2023',
  lastUpdatedDate: new Date(),
  associatedAreaCodes: [],
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
    it('should pass initialIndicatorSelectionState prop based upon the searchParams provided', async () => {
      const searchState: SearchStateParams = {
        ...searchParams,
        [SearchParams.IndicatorsSelected]: ['1', '2'],
        [SearchParams.AreaTypeSelected]: 'nhs-regions',
      };

      const page = await ResultsPage({
        searchParams: generateSearchParams(searchState),
      });

      expect(page.props.initialIndicatorSelectionState).toEqual({
        searchState: JSON.stringify({
          ...searchState,
          [SearchParams.GroupTypeSelected]: 'england',
        }),
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

    it('should pass the availableAreaTypes prop with a sorted by level list of areaTypes from the getAreaTypes call', async () => {
      mockAreasApi.getAreaTypes.mockResolvedValue(allAreaTypes);

      const searchState: SearchStateParams = {
        ...searchParams,
        [SearchParams.IndicatorsSelected]: ['1', '2'],
      };

      const page = await ResultsPage({
        searchParams: generateSearchParams(searchState),
      });

      expect(mockAreasApi.getAreaTypes).toHaveBeenCalled();
      expect(page.props.availableAreaTypes).toEqual(mockSortedAreaTypes);
    });

    it('should pass the availableGroupTypes prop with a subset of areaTypes that are applicable based upon the areaTypeSelected', async () => {
      mockAreasApi.getAreaTypes.mockResolvedValue(allAreaTypes);

      const searchState: SearchStateParams = {
        ...searchParams,
        [SearchParams.IndicatorsSelected]: ['1', '2'],
        [SearchParams.AreaTypeSelected]: 'nhs-integrated-care-boards',
      };

      const page = await ResultsPage({
        searchParams: generateSearchParams(searchState),
      });

      expect(page.props.availableGroupTypes).toEqual([
        nhsRegionsAreaType,
        englandAreaType,
      ]);
    });

    it('should pass the availableGroup prop with results from getAreaTypeMembers based upon selected groupType', async () => {
      mockAreasApi.getAreaTypeMembers.mockResolvedValue(
        mockAvailableAreas['nhs-integrated-care-boards']
      );

      const searchState: SearchStateParams = {
        ...searchParams,
        [SearchParams.IndicatorsSelected]: ['1', '2'],
        [SearchParams.AreaTypeSelected]: 'nhs-integrated-care-boards',
        [SearchParams.GroupTypeSelected]: 'nhs-regions',
      };

      const page = await ResultsPage({
        searchParams: generateSearchParams(searchState),
      });

      expect(mockAreasApi.getAreaTypeMembers).toHaveBeenCalledWith({
        areaTypeKey: 'nhs-regions',
      });
      expect(page.props.availableGroups).toEqual(
        mockAvailableAreas['nhs-integrated-care-boards']
      );
    });

    it('should pass the availableAreas prop with the children from the getArea call based upon the group selected', async () => {
      mockAreasApi.getArea.mockResolvedValueOnce(
        mockAreaDataForNHSRegion[eastEnglandNHSRegion.code]
      );

      const searchState: SearchStateParams = {
        ...searchParams,
        [SearchParams.IndicatorsSelected]: ['1', '2'],
        [SearchParams.AreaTypeSelected]: 'nhs-integrated-care-boards',
        [SearchParams.GroupTypeSelected]: 'nhs-regions',
        [SearchParams.GroupSelected]: eastEnglandNHSRegion.code,
      };

      const page = await ResultsPage({
        searchParams: generateSearchParams(searchState),
      });

      expect(mockAreasApi.getArea).toHaveBeenCalledWith({
        areaCode: eastEnglandNHSRegion.code,
        includeChildren: true,
        childAreaType: 'nhs-integrated-care-boards',
      });
      expect(page.props.availableAreas).toEqual(
        mockAreaDataForNHSRegion[eastEnglandNHSRegion.code].children
      );
    });

    it('should pass the selectedAreasData prop with data from getArea for each areaSelected', async () => {
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

      expect(mockAreasApi.getArea).toHaveBeenNthCalledWith(1, {
        areaCode: eastEnglandNHSRegion.code,
      });
      expect(mockAreasApi.getArea).toHaveBeenNthCalledWith(2, {
        areaCode: londonNHSRegion.code,
      });
      expect(page.props.selectedAreasData).toEqual([
        eastEnglandNHSRegion,
        londonNHSRegion,
      ]);
    });

    it('should pass the searchState prop with data from the params or calculated from selection', async () => {
      const searchState: SearchStateParams = {
        ...searchParams,
        [SearchParams.IndicatorsSelected]: ['1', '2'],
        [SearchParams.AreasSelected]: ['E40000007', 'E40000003'],
      };

      mockAreasApi.getArea.mockResolvedValueOnce({
        ...eastEnglandNHSRegion,
        parents: [englandArea],
      });
      mockAreasApi.getArea.mockResolvedValueOnce({
        ...londonNHSRegion,
        parents: [englandArea],
      });

      const page = await ResultsPage({
        searchParams: generateSearchParams(searchState),
      });

      expect(page.props.searchState).toEqual({
        ...searchState,
        [SearchParams.AreaTypeSelected]: 'nhs-regions',
        [SearchParams.GroupTypeSelected]: 'england',
      });
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
    it('should pass the correct props when getAreaTypes call returns an error', async () => {
      mockAreasApi.getAreaTypes.mockRejectedValue('Some areas api error');

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

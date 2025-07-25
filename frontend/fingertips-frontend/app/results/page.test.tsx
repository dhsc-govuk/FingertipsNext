/**
 * @vitest-environment node
 */

import ResultsPage from './page';
import { SearchParams, SearchStateParams } from '@/lib/searchStateManager';
import {
  IIndicatorSearchService,
  IndicatorDocument,
} from '@/lib/search/searchTypes';
import { SearchServiceFactory } from '@/lib/search/searchServiceFactory';
import { mockDeep } from 'vitest-mock-extended';
import { AreasApi } from '@/generated-sources/ft-api-client';
import {
  mockAreaDataForNHSRegion,
  mockAvailableAreas,
} from '@/mock/data/areaData';
import {
  allAreaTypes,
  englandAreaType,
  nhsIntegratedCareBoardsAreaType,
  nhsRegionsAreaType,
} from '@/lib/areaFilterHelpers/areaType';
import {
  eastEnglandNHSRegion,
  londonNHSRegion,
} from '@/mock/data/areas/nhsRegionsAreas';
import { areaCodeForEngland } from '@/lib/chartHelpers/constants';
import { getAreaFilterData } from '@/lib/areaFilterHelpers/getAreaFilterData';
import { generateIndicatorDocument } from '@/lib/search/mockDataHelper';
import { getSelectedAreasDataByAreaType } from '@/lib/areaFilterHelpers/getSelectedAreasData';
import { ALL_AREAS_SELECTED } from '@/lib/areaFilterHelpers/constants';
import { INDICATOR_SEARCH_MAX_CHARACTERS } from '@/lib/search/indicatorSearchService';
import { MockedFunction } from 'vitest';

vi.mock('@/lib/areaFilterHelpers/getAreaFilterData');
vi.mock('@/lib/areaFilterHelpers/getSelectedAreasData');

const mockGetAreaFilterData = getAreaFilterData as MockedFunction<
  typeof getAreaFilterData
>;

const mockGetSelectedAreasDataByAreaType =
  getSelectedAreasDataByAreaType as MockedFunction<
    typeof getSelectedAreasDataByAreaType
  >;

const mockIndicatorSearchResults: IndicatorDocument[] = [
  generateIndicatorDocument('1'),
  generateIndicatorDocument('2'),
];

const mockIndicatorSearchService = mockDeep<IIndicatorSearchService>();
const mockAreasApi = mockDeep<AreasApi>();

vi.mock('@/components/pages/results');

SearchServiceFactory.getIndicatorSearchService = () =>
  mockIndicatorSearchService;

const searchParams: SearchStateParams = {
  [SearchParams.SearchedIndicator]: 'testing',
};

async function generateSearchParams(value: SearchStateParams) {
  return value;
}

describe('Results Page', () => {
  const areaFilterData = {
    availableAreaTypes: allAreaTypes,
    availableGroupTypes: [nhsRegionsAreaType, englandAreaType],
    availableGroups: mockAvailableAreas['nhs-integrated-care-boards'],
    availableAreas:
      mockAreaDataForNHSRegion[eastEnglandNHSRegion.code].children,
  };

  afterEach(() => {
    vi.clearAllMocks();
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
        false,
        undefined
      );
      expect(page.props.searchResults).toEqual(mockIndicatorSearchResults);
    });

    it('should restrict search length', async () => {
      mockIndicatorSearchService.searchWith.mockResolvedValue(
        mockIndicatorSearchResults
      );

      const searchState: SearchStateParams = {
        ...searchParams,
        [SearchParams.SearchedIndicator]: 'A'.repeat(
          INDICATOR_SEARCH_MAX_CHARACTERS + 1
        ),
        [SearchParams.IndicatorsSelected]: ['1', '2'],
      };

      const _ = await ResultsPage({
        searchParams: generateSearchParams(searchState),
      });

      expect(mockIndicatorSearchService.searchWith).toHaveBeenCalledWith(
        'A'.repeat(INDICATOR_SEARCH_MAX_CHARACTERS),
        false,
        undefined
      );
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
        false,
        ['E40000007', 'E40000003']
      );
      expect(page.props.searchResults).toEqual(mockIndicatorSearchResults);
    });

    it('should call the search service with the correct params when no areas selected but England is selected group', async () => {
      mockIndicatorSearchService.searchWith.mockResolvedValue(
        mockIndicatorSearchResults
      );

      const searchState: SearchStateParams = {
        ...searchParams,
        [SearchParams.IndicatorsSelected]: ['1', '2'],
        [SearchParams.GroupSelected]: 'E92000001',
      };

      const page = await ResultsPage({
        searchParams: generateSearchParams(searchState),
      });

      expect(mockIndicatorSearchService.searchWith).toHaveBeenCalledWith(
        'testing',
        true,
        undefined
      );
      expect(page.props.searchResults).toEqual(mockIndicatorSearchResults);
    });

    it('should pass the areaFilterData prop with the data from the getAreaFilterData call', async () => {
      mockGetAreaFilterData.mockResolvedValue(areaFilterData);
      mockGetSelectedAreasDataByAreaType.mockResolvedValue([]);

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

    it('should pass the selectedAreasData prop with data from getSelectedAreasDataByAreaType', async () => {
      mockGetAreaFilterData.mockResolvedValue({});
      mockGetSelectedAreasDataByAreaType.mockResolvedValue([
        eastEnglandNHSRegion,
        londonNHSRegion,
      ]);

      const searchState: SearchStateParams = {
        ...searchParams,
        [SearchParams.IndicatorsSelected]: ['1', '2'],
        [SearchParams.AreaTypeSelected]: 'nhs-regions',
        [SearchParams.AreasSelected]: ['E40000007', 'E40000003'],
      };

      const page = await ResultsPage({
        searchParams: generateSearchParams(searchState),
      });

      expect(mockGetSelectedAreasDataByAreaType).toHaveBeenCalledWith(
        ['E40000007', 'E40000003'],
        'nhs-regions'
      );
      expect(page.props.selectedAreasData).toEqual([
        eastEnglandNHSRegion,
        londonNHSRegion,
      ]);
    });

    it('should pass the current date prop', async () => {
      const date = new Date('January 1, 2000');
      vi.useFakeTimers();
      vi.setSystemTime(date);

      const page = await ResultsPage({});

      expect(page.props.currentDate).toEqual(date);

      vi.useRealTimers();
    });
  });

  describe('results filtering', () => {
    it('should pass the selected areas to the search service when specific areas are selected', async () => {
      mockGetAreaFilterData.mockResolvedValue(areaFilterData);

      const selectedAreas = ['E40000007', 'E40000003'];
      const searchState: SearchStateParams = {
        ...searchParams,
        [SearchParams.AreasSelected]: selectedAreas,
      };

      await ResultsPage({
        searchParams: generateSearchParams(searchState),
      });

      expect(mockIndicatorSearchService.searchWith).toHaveBeenCalledWith(
        'testing',
        false,
        selectedAreas
      );
    });

    it('should pass the available areas to the search service when all areas in a group are selected', async () => {
      mockGetAreaFilterData.mockResolvedValue({
        ...areaFilterData,
        availableAreas: [
          {
            code: 'E38000007',
            name: 'NHS Basildon And Brentwood ICB',
            areaType: nhsIntegratedCareBoardsAreaType,
          },
          {
            code: 'E38000026',
            name: 'NHS Cambridgeshire and Peterborough ICB',
            areaType: nhsIntegratedCareBoardsAreaType,
          },
          {
            code: 'E38000240',
            name: 'NHS North Central London ICB',
            areaType: nhsIntegratedCareBoardsAreaType,
          },
        ],
      });

      const searchState: SearchStateParams = {
        ...searchParams,
        [SearchParams.GroupAreaSelected]: ALL_AREAS_SELECTED,
      };

      await ResultsPage({
        searchParams: generateSearchParams(searchState),
      });

      expect(mockIndicatorSearchService.searchWith).toHaveBeenCalledWith(
        'testing',
        false,
        ['E38000007', 'E38000026', 'E38000240']
      );
    });
  });
});

/**
 * @jest-environment node
 */

import { SearchParams, SearchStateParams } from '@/lib/searchStateManager';
import HomePage from './page';
import { getAreaFilterData } from '@/lib/areaFilterHelpers/getAreaFilterData';
import { AreasApi } from '@/generated-sources/ft-api-client';
import { mockDeep } from 'jest-mock-extended';
import {
  API_CACHE_CONFIG,
  ApiClientFactory,
} from '@/lib/apiClient/apiClientFactory';
import {
  allAreaTypes,
  nhsRegionsAreaType,
  englandAreaType,
} from '@/lib/areaFilterHelpers/areaType';
import {
  mockAvailableAreas,
  mockAreaDataForNHSRegion,
} from '@/mock/data/areaData';
import {
  eastEnglandNHSRegion,
  londonNHSRegion,
} from '@/mock/data/areas/nhsRegionsAreas';
import { areaCodeForEngland } from '@/lib/chartHelpers/constants';

jest.mock('@/lib/areaFilterHelpers/getAreaFilterData');
jest.mock('@/components/pages/home');

const mockGetAreaFilterData = getAreaFilterData as jest.MockedFunction<
  typeof getAreaFilterData
>;

const mockAreasApi = mockDeep<AreasApi>();

ApiClientFactory.getAreasApiClient = () => mockAreasApi;

async function generateSearchParams(value: SearchStateParams) {
  return value;
}

describe('Home page', () => {
  afterEach(() => {
    jest.clearAllMocks();
  });

  describe('Check correct props are passed to the Home Page component', () => {
    it('should pass initialFormState prop based upon the searchParams provided', async () => {
      const searchState: SearchStateParams = {
        [SearchParams.SearchedIndicator]: 'testing',
        [SearchParams.AreasSelected]: ['E40000007'],
      };

      mockGetAreaFilterData.mockResolvedValue({
        updatedSearchState: searchState,
      });

      const page = await HomePage({
        searchParams: generateSearchParams(searchState),
      });

      expect(page.props.initialFormState).toEqual({
        indicator: 'testing',
        searchState: JSON.stringify(searchState),
        message: null,
        errors: {},
      });
    });

    it('should pass areaFilterData prop with the data from the getAreaFilterData call', async () => {
      const areaFilterData = {
        availableAreaTypes: allAreaTypes,
        availableGroupTypes: [nhsRegionsAreaType, englandAreaType],
        availableGroups: mockAvailableAreas['nhs-integrated-care-boards'],
        availableAreas:
          mockAreaDataForNHSRegion[eastEnglandNHSRegion.code].children,
      };

      mockGetAreaFilterData.mockResolvedValue(areaFilterData);

      const page = await HomePage({
        searchParams: generateSearchParams({}),
      });

      expect(mockGetAreaFilterData).toHaveBeenCalledWith({}, []);
      expect(page.props.areaFilterData).toEqual(areaFilterData);
    });

    it('should pass the selectedAreasData prop with data from getArea for each areaSelected', async () => {
      mockAreasApi.getArea.mockResolvedValueOnce(eastEnglandNHSRegion);
      mockAreasApi.getArea.mockResolvedValueOnce(londonNHSRegion);

      const searchState: SearchStateParams = {
        [SearchParams.AreasSelected]: ['E40000007', 'E40000003'],
      };

      const page = await HomePage({
        searchParams: generateSearchParams(searchState),
      });

      expect(mockAreasApi.getArea).toHaveBeenNthCalledWith(
        1,
        {
          areaCode: eastEnglandNHSRegion.code,
        },
        API_CACHE_CONFIG
      );
      expect(mockAreasApi.getArea).toHaveBeenNthCalledWith(
        2,
        {
          areaCode: londonNHSRegion.code,
        },
        API_CACHE_CONFIG
      );
      expect(page.props.selectedAreasData).toEqual([
        eastEnglandNHSRegion,
        londonNHSRegion,
      ]);
    });

    it('should pass the searchState prop with data from the params and updated by getAreaFilterData call', async () => {
      const initialSearchState = {
        [SearchParams.SearchedIndicator]: 'testing',
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

      const page = await HomePage({
        searchParams: generateSearchParams(initialSearchState),
      });

      expect(page.props.searchState).toEqual(updatedSearchState);
    });
  });
});

/**
 * @jest-environment node
 */

import ChartPage from './page';
import { SearchParams, SearchStateParams } from '@/lib/searchStateManager';
import { mockDeep } from 'jest-mock-extended';
import { ApiClientFactory } from '@/lib/apiClient/apiClientFactory';
import { IndicatorsApi } from '@/generated-sources/ft-api-client';
import { getAreaFilterData } from '@/lib/areaFilterHelpers/getAreaFilterData';
import {
  allAreaTypes,
  englandAreaType,
  nhsRegionsAreaType,
} from '@/lib/areaFilterHelpers/areaType';
import {
  mockAreaDataForNHSRegion,
  mockAvailableAreas,
} from '@/mock/data/areaData';
import {
  eastEnglandNHSRegion,
  londonNHSRegion,
} from '@/mock/data/areas/nhsRegionsAreas';
import { IIndicatorSearchService } from '@/lib/search/searchTypes';
import { SearchServiceFactory } from '@/lib/search/searchServiceFactory';
import { generateIndicatorDocument } from '@/lib/search/mockDataHelper';
import { getSelectedAreasDataByAreaType } from '@/lib/areaFilterHelpers/getSelectedAreasData';

const mockIndicatorsApi = mockDeep<IndicatorsApi>();
ApiClientFactory.getIndicatorsApiClient = () => mockIndicatorsApi;

jest.mock('@/components/organisms/ThematicMap/thematicMapHelpers.ts', () => ({
  getMapGeographyData: jest.fn(),
}));

jest.mock('@/lib/areaFilterHelpers/getAreaFilterData');
const mockGetAreaFilterData = getAreaFilterData as jest.MockedFunction<
  typeof getAreaFilterData
>;
mockGetAreaFilterData.mockResolvedValue({});

jest.mock('@/lib/areaFilterHelpers/getSelectedAreasData');
const mockGetSelectedAreasDataByAreaType =
  getSelectedAreasDataByAreaType as jest.MockedFunction<
    typeof getSelectedAreasDataByAreaType
  >;
mockGetSelectedAreasDataByAreaType.mockResolvedValue([]);

const mockIndicatorSearchService = mockDeep<IIndicatorSearchService>();
SearchServiceFactory.getIndicatorSearchService = () =>
  mockIndicatorSearchService;

async function generateSearchParams(value: SearchStateParams) {
  return value;
}

describe('Chart Page', () => {
  afterEach(() => {
    jest.clearAllMocks();
  });

  describe('ViewContext', () => {
    it('should pass search state prop with data from the params to the ViewContext', async () => {
      const mockAreaCode = 'E06000047';
      const searchParams: SearchStateParams = {
        [SearchParams.SearchedIndicator]: 'testing',
        [SearchParams.IndicatorsSelected]: ['333'],
        [SearchParams.AreasSelected]: [mockAreaCode],
      };
      const page = await ChartPage({
        searchParams: generateSearchParams(searchParams),
      });
      expect(page.props.searchState).toEqual({
        [SearchParams.SearchedIndicator]: 'testing',
        [SearchParams.IndicatorsSelected]: ['333'],
        [SearchParams.AreasSelected]: ['E06000047'],
      });
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
        [SearchParams.SearchedIndicator]: 'testing',
        [SearchParams.IndicatorsSelected]: ['1', '2'],
        [SearchParams.AreasSelected]: ['an area'],
      };

      const page = await ChartPage({
        searchParams: generateSearchParams(searchState),
      });

      expect(mockGetAreaFilterData).toHaveBeenCalledWith(searchState, []);
      expect(page.props.areaFilterData).toEqual(areaFilterData);
    });

    it('should pass the selectedAreasData prop with data from getSelectedAreasDataByAreaType', async () => {
      mockGetSelectedAreasDataByAreaType.mockResolvedValue([
        eastEnglandNHSRegion,
        londonNHSRegion,
      ]);

      const searchState: SearchStateParams = {
        [SearchParams.SearchedIndicator]: 'testing',
        [SearchParams.IndicatorsSelected]: ['1', '2'],
        [SearchParams.AreaTypeSelected]: 'nhs-regions',
        [SearchParams.AreasSelected]: ['E40000007', 'E40000003'],
      };

      const page = await ChartPage({
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

    it('should pass the selectedIndicatorsData prop with data from the getIndicator for each indicatorsSelected', async () => {
      const firstSelectedIndicatorId = '1';
      const secondSelectedIndicatorId = '2';

      const mockIndicatorDocument1 = generateIndicatorDocument(
        firstSelectedIndicatorId
      );
      const mockIndicatorDocument2 = generateIndicatorDocument(
        secondSelectedIndicatorId
      );

      mockIndicatorSearchService.getIndicator.mockResolvedValueOnce(
        mockIndicatorDocument1
      );
      mockIndicatorSearchService.getIndicator.mockResolvedValueOnce(
        mockIndicatorDocument2
      );

      const searchState: SearchStateParams = {
        [SearchParams.SearchedIndicator]: 'testing',
        [SearchParams.IndicatorsSelected]: [
          firstSelectedIndicatorId,
          secondSelectedIndicatorId,
        ],
      };

      const page = await ChartPage({
        searchParams: generateSearchParams(searchState),
      });

      expect(mockIndicatorSearchService.getIndicator).toHaveBeenNthCalledWith(
        1,
        firstSelectedIndicatorId
      );
      expect(mockIndicatorSearchService.getIndicator).toHaveBeenNthCalledWith(
        2,
        secondSelectedIndicatorId
      );
      expect(page.props.selectedIndicatorsData).toEqual([
        mockIndicatorDocument1,
        mockIndicatorDocument2,
      ]);
    });
  });
});

/**
 * @jest-environment node
 */

import {
  areaCodeForEngland,
  indicatorIdForPopulation,
} from '@/lib/chartHelpers/constants';
import ChartPage from './page';
import { SearchParams, SearchStateParams } from '@/lib/searchStateManager';
import { mockHealthData } from '@/mock/data/healthdata';
import { mockDeep } from 'jest-mock-extended';
import {
  API_CACHE_CONFIG,
  ApiClientFactory,
} from '@/lib/apiClient/apiClientFactory';
import {
  IndicatorsApi,
  GetHealthDataForAnIndicatorComparisonMethodEnum,
  AreasApi,
} from '@/generated-sources/ft-api-client';
import { getAreaFilterData } from '@/lib/areaFilterHelpers/getAreaFilterData';
import {
  allAreaTypes,
  englandAreaType,
  nhsRegionsAreaType,
} from '@/lib/areaFilterHelpers/areaType';
import {
  mockAvailableAreas,
  mockAreaDataForNHSRegion,
} from '@/mock/data/areaData';
import {
  eastEnglandNHSRegion,
  londonNHSRegion,
} from '@/mock/data/areas/nhsRegionsAreas';

const mockIndicatorsApi = mockDeep<IndicatorsApi>();
ApiClientFactory.getIndicatorsApiClient = () => mockIndicatorsApi;

jest.mock('@/components/pages/chart');
jest.mock('@/lib/thematicMapUtils/getMapData', () => ({
  getMapData: jest.fn(),
}));

jest.mock('@/lib/areaFilterHelpers/getAreaFilterData');

const mockGetAreaFilterData = getAreaFilterData as jest.MockedFunction<
  typeof getAreaFilterData
>;
mockGetAreaFilterData.mockResolvedValue({});

const mockAreasApi = mockDeep<AreasApi>();
ApiClientFactory.getAreasApiClient = () => mockAreasApi;

const searchParams: SearchStateParams = {
  [SearchParams.SearchedIndicator]: 'testing',
  [SearchParams.IndicatorsSelected]: ['1'],
  [SearchParams.AreasSelected]: ['A001'],
};

async function generateSearchParams(value: SearchStateParams) {
  return value;
}

describe('Chart Page', () => {
  afterEach(() => {
    jest.clearAllMocks();
  });

  describe('when no group area is available', () => {
    it('should make 1 calls for get health data, when there is only one indicator selected', async () => {
      mockIndicatorsApi.getHealthDataForAnIndicator.mockResolvedValueOnce([]);

      await ChartPage({
        searchParams: generateSearchParams(searchParams),
      });

      expect(
        mockIndicatorsApi.getHealthDataForAnIndicator
      ).toHaveBeenNthCalledWith(
        1,
        {
          areaCodes: ['A001', areaCodeForEngland],
          indicatorId: 1,
          inequalities: ['sex'],
          comparisonMethod: GetHealthDataForAnIndicatorComparisonMethodEnum.Rag,
        },
        API_CACHE_CONFIG
      );
    });

    it('should make 2 calls for get health data, when there are 2 indicators selected - first two calls for the indicators', async () => {
      const searchParams: SearchStateParams = {
        [SearchParams.SearchedIndicator]: 'testing',
        [SearchParams.IndicatorsSelected]: ['1', '2'],
        [SearchParams.AreasSelected]: ['A001'],
      };

      mockIndicatorsApi.getHealthDataForAnIndicator.mockResolvedValueOnce([]);
      mockIndicatorsApi.getHealthDataForAnIndicator.mockResolvedValueOnce([]);

      await ChartPage({
        searchParams: generateSearchParams(searchParams),
      });

      expect(
        mockIndicatorsApi.getHealthDataForAnIndicator
      ).toHaveBeenNthCalledWith(
        1,
        {
          areaCodes: ['A001', areaCodeForEngland],
          indicatorId: 1,
          inequalities: [],
          comparisonMethod: GetHealthDataForAnIndicatorComparisonMethodEnum.Rag,
        },
        API_CACHE_CONFIG
      );
      expect(
        mockIndicatorsApi.getHealthDataForAnIndicator
      ).toHaveBeenNthCalledWith(
        2,
        {
          areaCodes: ['A001', areaCodeForEngland],
          indicatorId: 2,
          inequalities: [],
          comparisonMethod: GetHealthDataForAnIndicatorComparisonMethodEnum.Rag,
        },
        API_CACHE_CONFIG
      );
    });
  });

  describe('when a single group is selected', () => {
    const mockAreaCode = 'E06000047';
    it('should make 2 calls for get health data, when there is only one indicator selected - first one for the indicator, including the group area', async () => {
      const mockParentAreaCode = 'E12000001';
      const searchParams: SearchStateParams = {
        [SearchParams.SearchedIndicator]: 'testing',
        [SearchParams.IndicatorsSelected]: ['333'],
        [SearchParams.AreasSelected]: [mockAreaCode],
        [SearchParams.GroupSelected]: mockParentAreaCode,
      };
      mockIndicatorsApi.getHealthDataForAnIndicator.mockResolvedValueOnce([]);

      await ChartPage({
        searchParams: generateSearchParams(searchParams),
      });

      expect(
        mockIndicatorsApi.getHealthDataForAnIndicator
      ).toHaveBeenNthCalledWith(
        1,
        {
          areaCodes: [mockAreaCode, areaCodeForEngland, mockParentAreaCode],
          indicatorId: 333,
          inequalities: ['sex'],
          comparisonMethod: GetHealthDataForAnIndicatorComparisonMethodEnum.Rag,
        },
        API_CACHE_CONFIG
      );
    });

    it('should not include groupSelected in the API call if England is the groupSelected', async () => {
      const mockParentAreaCode = 'E92000001';
      const searchParams: SearchStateParams = {
        [SearchParams.SearchedIndicator]: 'testing',
        [SearchParams.IndicatorsSelected]: ['333'],
        [SearchParams.AreasSelected]: [mockAreaCode],
        [SearchParams.GroupSelected]: mockParentAreaCode,
      };

      mockIndicatorsApi.getHealthDataForAnIndicator.mockResolvedValueOnce([]);

      await ChartPage({
        searchParams: generateSearchParams(searchParams),
      });

      expect(
        mockIndicatorsApi.getHealthDataForAnIndicator
      ).toHaveBeenNthCalledWith(
        1,
        {
          areaCodes: [mockAreaCode, areaCodeForEngland],
          indicatorId: 333,
          inequalities: ['sex'],
          comparisonMethod: GetHealthDataForAnIndicatorComparisonMethodEnum.Rag,
        },
        API_CACHE_CONFIG
      );
    });

    describe('Check correct props are passed to Chart page component', () => {
      it('should pass healthIndicatorData to the Chart page', async () => {
        mockIndicatorsApi.getHealthDataForAnIndicator.mockResolvedValueOnce(
          mockHealthData['1']
        );

        const page = await ChartPage({
          searchParams: generateSearchParams(searchParams),
        });

        // using props.children[1] during transition to views in DHSCFT-380
        expect(page.props.children[1].props.healthIndicatorData).toEqual([
          mockHealthData['1'],
        ]);
      });

      it('should pass search state prop with data from the params to the Chart page', async () => {
        const mockAreaCode = 'E06000047';
        const searchParams: SearchStateParams = {
          [SearchParams.SearchedIndicator]: 'testing',
          [SearchParams.IndicatorsSelected]: ['333'],
          [SearchParams.AreasSelected]: [mockAreaCode],
        };

        mockIndicatorsApi.getHealthDataForAnIndicator.mockResolvedValueOnce(
          mockHealthData['333']
        );

        const page = await ChartPage({
          searchParams: generateSearchParams(searchParams),
        });

        const expected = {
          [SearchParams.SearchedIndicator]: 'testing',
          [SearchParams.IndicatorsSelected]: ['333'],
          [SearchParams.AreasSelected]: ['E06000047'],
        };
        expect(page.props.children[1].props.searchState).toEqual(expected);
      });

      it('should pass undefined if there are not enough areas selected ', async () => {
        const mockAreaCode = 'E06000047';
        const searchParams: SearchStateParams = {
          [SearchParams.SearchedIndicator]: 'testing',
          [SearchParams.IndicatorsSelected]: ['333'],
          [SearchParams.AreasSelected]: [mockAreaCode],
          [SearchParams.AreaTypeSelected]: 'nhs-regions',
        };

        mockIndicatorsApi.getHealthDataForAnIndicator.mockResolvedValueOnce(
          mockHealthData['333']
        );

        const page = await ChartPage({
          searchParams: generateSearchParams(searchParams),
        });

        expect(page.props.children[1].props.mapData).toEqual(undefined);
      });
    });
  });

  describe('ViewContext', () => {
    it('should pass search state prop with data from the params to the Chart page', async () => {
      const mockAreaCode = 'E06000047';
      const searchParams: SearchStateParams = {
        [SearchParams.SearchedIndicator]: 'testing',
        [SearchParams.IndicatorsSelected]: ['333'],
        [SearchParams.AreasSelected]: [mockAreaCode],
      };

      mockIndicatorsApi.getHealthDataForAnIndicator.mockResolvedValueOnce(
        mockHealthData['333']
      );

      const page = await ChartPage({
        searchParams: generateSearchParams(searchParams),
      });

      expect(page.props.children[0].props.searchState).toEqual({
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
      expect(page.props.children[0].props.areaFilterData).toEqual(
        areaFilterData
      );
    });

    it('should pass the selectedAreasData prop with data from getArea for each areaSelected', async () => {
      mockAreasApi.getArea.mockResolvedValueOnce(eastEnglandNHSRegion);
      mockAreasApi.getArea.mockResolvedValueOnce(londonNHSRegion);

      const searchState: SearchStateParams = {
        [SearchParams.SearchedIndicator]: 'testing',
        [SearchParams.IndicatorsSelected]: ['1', '2'],
        [SearchParams.AreasSelected]: ['E40000007', 'E40000003'],
      };

      const page = await ChartPage({
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
      expect(page.props.children[0].props.selectedAreasData).toEqual([
        eastEnglandNHSRegion,
        londonNHSRegion,
      ]);
    });
  });
});

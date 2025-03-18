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
import { preparePopulationData } from '@/lib/chartHelpers/preparePopulationData';
import { mockDeep } from 'jest-mock-extended';
import {
  API_CACHE_CONFIG,
  ApiClientFactory,
} from '@/lib/apiClient/apiClientFactory';
import { IndicatorsApi, AreasApi } from '@/generated-sources/ft-api-client';
import { getMapData } from '@/lib/thematicMapUtils/getMapData';
import NHSRegionsMap from '@/assets/maps/NHS_England_Regions_January_2024_EN_BSC_7500404208533377417.geo.json';
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
import { IIndicatorSearchService } from '@/lib/search/searchTypes';
import { SearchServiceFactory } from '@/lib/search/searchServiceFactory';
import { generateIndicatorDocument } from '@/lib/search/mockDataHelper';

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

const mockIndicatorSearchService = mockDeep<IIndicatorSearchService>();
SearchServiceFactory.getIndicatorSearchService = () =>
  mockIndicatorSearchService;

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
    it('should make 2 calls for get health data, when there is only one indicator selected - first one for the indicator the next one for the population data', async () => {
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
          inequalities: ['sex'],
        },
        API_CACHE_CONFIG
      );
      expect(
        mockIndicatorsApi.getHealthDataForAnIndicator
      ).toHaveBeenNthCalledWith(
        2,
        {
          areaCodes: ['A001', areaCodeForEngland],
          indicatorId: indicatorIdForPopulation,
        },
        API_CACHE_CONFIG
      );
    });

    it('should make 3 calls for get health data, when there are 2 indicators selected - first two for the indicators the last one for the population data', async () => {
      const searchParams: SearchStateParams = {
        [SearchParams.SearchedIndicator]: 'testing',
        [SearchParams.IndicatorsSelected]: ['1', '2'],
        [SearchParams.AreasSelected]: ['A001'],
      };

      mockIndicatorsApi.getHealthDataForAnIndicator.mockResolvedValueOnce([]);
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
        },
        API_CACHE_CONFIG
      );
      expect(
        mockIndicatorsApi.getHealthDataForAnIndicator
      ).toHaveBeenNthCalledWith(
        3,
        {
          areaCodes: ['A001', areaCodeForEngland],
          indicatorId: indicatorIdForPopulation,
        },
        API_CACHE_CONFIG
      );
    });
  });

  describe('when a single group is selected', () => {
    const mockAreaCode = 'E06000047';
    it('should make 2 calls for get health data, when there is only one indicator selected - first one for the indicator, including the group area the next one for the population data', async () => {
      const mockParentAreaCode = 'E12000001';
      const searchParams: SearchStateParams = {
        [SearchParams.SearchedIndicator]: 'testing',
        [SearchParams.IndicatorsSelected]: ['333'],
        [SearchParams.AreasSelected]: [mockAreaCode],
        [SearchParams.GroupSelected]: mockParentAreaCode,
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
          areaCodes: [mockAreaCode, areaCodeForEngland, mockParentAreaCode],
          indicatorId: 333,
          inequalities: ['sex'],
        },
        API_CACHE_CONFIG
      );
      expect(
        mockIndicatorsApi.getHealthDataForAnIndicator
      ).toHaveBeenNthCalledWith(
        2,
        {
          areaCodes: [mockAreaCode, areaCodeForEngland],
          indicatorId: indicatorIdForPopulation,
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
        },
        API_CACHE_CONFIG
      );
      expect(
        mockIndicatorsApi.getHealthDataForAnIndicator
      ).toHaveBeenNthCalledWith(
        2,
        {
          areaCodes: [mockAreaCode, areaCodeForEngland],
          indicatorId: indicatorIdForPopulation,
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

      it('should pass population data to the Chart page', async () => {
        const expectedPopulationData = preparePopulationData(
          mockHealthData[`${indicatorIdForPopulation}`],
          'A001'
        );

        mockIndicatorsApi.getHealthDataForAnIndicator.mockResolvedValueOnce(
          mockHealthData['1']
        );
        mockIndicatorsApi.getHealthDataForAnIndicator.mockResolvedValueOnce(
          mockHealthData[`${indicatorIdForPopulation}`]
        );

        const page = await ChartPage({
          searchParams: generateSearchParams(searchParams),
        });

        expect(page.props.children[1].props.populationData).toEqual(
          expectedPopulationData
        );
      });

      it('should pass undefined if there was an error getting population data', async () => {
        mockIndicatorsApi.getHealthDataForAnIndicator.mockResolvedValueOnce(
          mockHealthData['1']
        );
        mockIndicatorsApi.getHealthDataForAnIndicator.mockRejectedValueOnce(
          'Some error getting population data'
        );

        const page = await ChartPage({
          searchParams: generateSearchParams(searchParams),
        });

        expect(page.props.children[1].props.populationData).toEqual(undefined);
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

        expect(page.props.children[1].props.searchState).toEqual({
          [SearchParams.SearchedIndicator]: 'testing',
          [SearchParams.IndicatorsSelected]: ['333'],
          [SearchParams.AreasSelected]: ['E06000047'],
        });
      });

      it('should pass map data to the Chart page', async () => {
        const searchParams: SearchStateParams = {
          [SearchParams.SearchedIndicator]: 'testing',
          [SearchParams.IndicatorsSelected]: ['333'],
          [SearchParams.AreasSelected]: ['E40000011', 'E40000012'],
          [SearchParams.AreaTypeSelected]: 'nhs-regions',
        };

        mockIndicatorsApi.getHealthDataForAnIndicator.mockResolvedValueOnce(
          mockHealthData['333']
        );

        const mockData = (getMapData as jest.Mock).mockReturnValue({
          mapJoinKey: 'test',
          mapFile: NHSRegionsMap,
          mapGroupBoundary: NHSRegionsMap,
        });

        const page = await ChartPage({
          searchParams: generateSearchParams(searchParams),
        });

        const expected = getMapData('nhs-regions', ['A1245', 'A1245']);

        expect(mockData).toHaveBeenCalled();
        expect(page.props.children[1].props.mapData).toEqual(expected);
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
      expect(page.props.children[0].props.selectedIndicatorsData).toEqual([
        mockIndicatorDocument1,
        mockIndicatorDocument2,
      ]);
    });
  });
});

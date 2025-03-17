/**
 * @jest-environment node
 */

import { IndicatorsApi } from '@/generated-sources/ft-api-client';
import { SearchParams, SearchStateParams } from '@/lib/searchStateManager';
import { mockDeep } from 'jest-mock-extended';
import OneIndicatorTwoOrMoreAreasView from '.';
import { areaCodeForEngland } from '@/lib/chartHelpers/constants';
import {
  API_CACHE_CONFIG,
  ApiClientFactory,
} from '@/lib/apiClient/apiClientFactory';
import { mockHealthData } from '@/mock/data/healthdata';
import { SearchServiceFactory } from '@/lib/search/searchServiceFactory';
import { IIndicatorSearchService } from '@/lib/search/searchTypes';
import regionsMap from '@/assets/maps/Regions_December_2023_Boundaries_EN_BUC_1958740832896680092.geo.json';

const mockIndicatorsApi = mockDeep<IndicatorsApi>();
ApiClientFactory.getIndicatorsApiClient = () => mockIndicatorsApi;

const mockIndicatorSearchService = mockDeep<IIndicatorSearchService>();
SearchServiceFactory.getIndicatorSearchService = () =>
  mockIndicatorSearchService;

const mockMapData = { joinKey: 'RGN23CD', mapFile: regionsMap };

describe('OneIndicatorTwoOrMoreAreasView', () => {
  afterEach(() => {
    jest.resetAllMocks();
  });
  it.each([
    [
      ['1', '2'],
      ['A001', 'A002'],
    ],
    [['1'], ['A001']],
  ])(
    'should return an error if given invalid parameters',
    async (testIndicators, testAreas) => {
      const searchState: SearchStateParams = {
        [SearchParams.IndicatorsSelected]: testIndicators,
        [SearchParams.AreasSelected]: testAreas,
      };
      mockIndicatorsApi.getHealthDataForAnIndicator.mockResolvedValueOnce([]);
      await expect(async () => {
        await OneIndicatorTwoOrMoreAreasView({ searchState: searchState });
      }).rejects.toThrow('Invalid parameters provided to view');
    }
  );

  it.each([
    [
      ['1'],
      ['A001', 'A002'],
      'G001',
      ['A001', 'A002', areaCodeForEngland, 'G001'],
    ],
    [
      ['1'],
      ['A001', 'A002'],
      areaCodeForEngland,
      ['A001', 'A002', areaCodeForEngland],
    ],
  ])(
    'should make 1 call to the healthIndicatorApi with the expected parameters',
    async (testIndicators, testAreas, testGroup, expectedAreaCodes) => {
      const searchState: SearchStateParams = {
        [SearchParams.IndicatorsSelected]: testIndicators,
        [SearchParams.AreasSelected]: testAreas,
        [SearchParams.GroupSelected]: testGroup,
      };
      mockIndicatorsApi.getHealthDataForAnIndicator.mockResolvedValueOnce([]);

      await OneIndicatorTwoOrMoreAreasView({ searchState: searchState });

      expect(
        mockIndicatorsApi.getHealthDataForAnIndicator
      ).toHaveBeenNthCalledWith(
        1,
        {
          areaCodes: expectedAreaCodes,
          indicatorId: 1,
        },
        API_CACHE_CONFIG
      );
    }
  );

  it('should call get indicator endpoint and pass indicator metadata', async () => {
    const indicatorId = '123';
    const searchParams: SearchStateParams = {
      [SearchParams.SearchedIndicator]: 'testing',
      [SearchParams.IndicatorsSelected]: [indicatorId],
      [SearchParams.AreasSelected]: ['E06000047', 'A002'],
    };

    const mockResponse = {
      indicatorID: indicatorId,
      indicatorName: 'pancakes eaten',
      indicatorDefinition: 'number of pancakes consumed',
      dataSource: 'BJSS Leeds',
      earliestDataPeriod: '2025',
      latestDataPeriod: '2025',
      lastUpdatedDate: new Date('March 4, 2025'),
      associatedAreaCodes: ['E06000047'],
      unitLabel: 'pancakes',
      hasInequalities: true,
      usedInPoc: false,
    };

    mockIndicatorSearchService.getIndicator.mockResolvedValueOnce(mockResponse);

    const page = await OneIndicatorTwoOrMoreAreasView({
      searchState: searchParams,
    });

    expect(mockIndicatorSearchService.getIndicator).toHaveBeenCalledWith(
      indicatorId
    );
    expect(page.props.indicatorMetadata).toBe(mockResponse);
  });

  it('should call OneIndicatorTwoOrMoreAreasViewPlot with the correct props', async () => {
    const searchState: SearchStateParams = {
      [SearchParams.IndicatorsSelected]: ['1'],
      [SearchParams.AreasSelected]: ['A001', 'A002'],
      [SearchParams.GroupSelected]: 'G001',
    };
    mockIndicatorsApi.getHealthDataForAnIndicator.mockResolvedValueOnce([
      mockHealthData['108'][1],
    ]);

    const page = await OneIndicatorTwoOrMoreAreasView({
      searchState: searchState,
    });

    expect(page.props.healthIndicatorData).toEqual([mockHealthData['108'][1]]);
    expect(page.props.searchState).toEqual(searchState);
  });

  it('should pass the map data if all areas in the group are selected', async () => {
    const searchState: SearchStateParams = {
      [SearchParams.IndicatorsSelected]: ['1'],
      [SearchParams.AreasSelected]: ['E12000004', 'E12000006'],
      [SearchParams.GroupAreaSelected]: 'ALL',
      [SearchParams.AreaTypeSelected]: 'regions',
      // DHSCFT-483 to remove this
      [SearchParams.GroupSelected]: 'a group',
    };
    mockIndicatorsApi.getHealthDataForAnIndicator.mockResolvedValueOnce([
      mockHealthData['108'][1],
    ]);

    const page = await OneIndicatorTwoOrMoreAreasView({
      searchState: searchState,
    });

    expect(page.props.healthIndicatorData).toEqual([mockHealthData['108'][1]]);
    expect(page.props.searchState).toEqual(searchState);
    expect(page.props.mapData.mapJoinKey).toEqual(mockMapData.joinKey);
    expect(page.props.mapData.mapFile).toEqual(mockMapData.mapFile);
  });
});

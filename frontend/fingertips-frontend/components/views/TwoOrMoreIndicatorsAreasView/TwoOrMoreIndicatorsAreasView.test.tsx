/**
 * @jest-environment node
 */

import { IndicatorsApi } from '@/generated-sources/ft-api-client';
import { SearchParams, SearchStateParams } from '@/lib/searchStateManager';
import { mockDeep } from 'jest-mock-extended';
import TwoOrMoreIndicatorsAreasView from '.';
import { areaCodeForEngland } from '@/lib/chartHelpers/constants';
import {
  API_CACHE_CONFIG,
  ApiClientFactory,
} from '@/lib/apiClient/apiClientFactory';
import { mockHealthData } from '@/mock/data/healthdata';
import { SearchServiceFactory } from '@/lib/search/searchServiceFactory';
import { IIndicatorSearchService } from '@/lib/search/searchTypes';

const mockIndicatorsApi = mockDeep<IndicatorsApi>();
ApiClientFactory.getIndicatorsApiClient = () => mockIndicatorsApi;

const mockIndicatorSearchService = mockDeep<IIndicatorSearchService>();
SearchServiceFactory.getIndicatorSearchService = () =>
  mockIndicatorSearchService;

describe('TwoOrMoreIndicatorsAreasView', () => {
  afterEach(() => {
    jest.resetAllMocks();
  });
  it.each([
    [
      ['1', '2'],
      ['A001', 'A002', 'A003'],
    ],
    [['1'], ['A001']],
  ])(
    'should return an error if given invalid parameters',
    async (testIndicators, testAreas) => {
      const searchState: SearchStateParams = {
        [SearchParams.IndicatorsSelected]: testIndicators,
        [SearchParams.AreasSelected]: testAreas,
      };

      await expect(async () => {
        await TwoOrMoreIndicatorsAreasView({ searchState: searchState });
      }).rejects.toThrow('Invalid parameters provided to view');
    }
  );

  it.each([
    [['1', '2'], ['A001'], 'G001', ['A001', areaCodeForEngland, 'G001']],
    [['1', '2'], ['A001'], areaCodeForEngland, ['A001', areaCodeForEngland]],
  ])(
    'should make 2 calls to the healthIndicatorApi with the expected parameters',
    async (testIndicators, testAreas, testGroup, expectedAreaCodes) => {
      const searchState: SearchStateParams = {
        [SearchParams.IndicatorsSelected]: testIndicators,
        [SearchParams.AreasSelected]: testAreas,
        [SearchParams.GroupSelected]: testGroup,
      };
      mockIndicatorsApi.getHealthDataForAnIndicator.mockResolvedValueOnce([]);

      await TwoOrMoreIndicatorsAreasView({ searchState: searchState });

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
    const indicatorIds = ['123', '321'];

    const searchParams: SearchStateParams = {
      [SearchParams.SearchedIndicator]: 'testing',
      [SearchParams.IndicatorsSelected]: indicatorIds,
      [SearchParams.AreasSelected]: ['E06000047'],
    };

    const mockResponses = [
      {
        indicatorID: indicatorIds[0],
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
      },
      {
        indicatorID: indicatorIds[1],
        indicatorName: 'pizzas eaten',
        indicatorDefinition: 'number of pizzas consumed',
        dataSource: 'BJSS Leeds',
        earliestDataPeriod: '2023',
        latestDataPeriod: '2023',
        lastUpdatedDate: new Date('March 4, 2023'),
        associatedAreaCodes: ['E06000047'],
        unitLabel: 'pizzas',
        hasInequalities: true,
        usedInPoc: false,
      },
    ];

    mockIndicatorSearchService.getIndicator
      .mockResolvedValueOnce(mockResponses[0])
      .mockResolvedValueOnce(mockResponses[1]);

    const page = await TwoOrMoreIndicatorsAreasView({
      searchState: searchParams,
    });

    indicatorIds.forEach((indicator) => {
      expect(mockIndicatorSearchService.getIndicator).toHaveBeenCalledWith(
        indicator
      );
    });

    expect(page.props.indicatorMetadata).toStrictEqual(mockResponses);
  });

  it('should call TwoOrMoreIndicatorsAreasViewPlots with the correct props', async () => {
    const searchState: SearchStateParams = {
      [SearchParams.IndicatorsSelected]: ['1', '2'],
      [SearchParams.AreasSelected]: ['A001'],
    };

    const mockResponses = [mockHealthData['108'], mockHealthData['107']];

    mockIndicatorsApi.getHealthDataForAnIndicator
      .mockResolvedValueOnce(mockResponses[0])
      .mockResolvedValueOnce(mockResponses[1]);

    const page = await TwoOrMoreIndicatorsAreasView({
      searchState: searchState,
    });

    expect(page.props.searchState).toEqual(searchState);
    expect(page.props.healthIndicatorData).toEqual(mockResponses);
  });
});

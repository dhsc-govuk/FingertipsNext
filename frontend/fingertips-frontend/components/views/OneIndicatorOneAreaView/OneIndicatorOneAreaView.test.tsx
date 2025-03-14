/**
 * @jest-environment node
 */

import {
  GetHealthDataForAnIndicatorComparisonMethodEnum,
  IndicatorsApi,
} from '@/generated-sources/ft-api-client';
import { mockDeep } from 'jest-mock-extended';
import OneIndicatorOneAreaView from '.';
import { SearchParams, SearchStateParams } from '@/lib/searchStateManager';
import { areaCodeForEngland } from '@/lib/chartHelpers/constants';
import {
  API_CACHE_CONFIG,
  ApiClientFactory,
} from '@/lib/apiClient/apiClientFactory';
import { mockHealthData } from '@/mock/data/healthdata';
import { IIndicatorSearchService } from '@/lib/search/searchTypes';
import { SearchServiceFactory } from '@/lib/search/searchServiceFactory';

const mockIndicatorsApi = mockDeep<IndicatorsApi>();
ApiClientFactory.getIndicatorsApiClient = () => mockIndicatorsApi;

const mockIndicatorSearchService = mockDeep<IIndicatorSearchService>();
SearchServiceFactory.getIndicatorSearchService = () =>
  mockIndicatorSearchService;

describe('OneIndicatorOneAreaView', () => {
  afterEach(() => {
    jest.resetAllMocks();
  });
  it.each([
    [['1'], ['A001', 'A002']],
    [['1', '2'], ['A001']],
  ])(
    'should return an error if given invalid parameters',
    async (testIndicators, testAreas) => {
      const searchState: SearchStateParams = {
        [SearchParams.IndicatorsSelected]: testIndicators,
        [SearchParams.AreasSelected]: testAreas,
      };
      mockIndicatorsApi.getHealthDataForAnIndicator.mockResolvedValueOnce([]);
      await expect(async () => {
        await OneIndicatorOneAreaView({ searchState: searchState });
      }).rejects.toThrow('Invalid parameters provided to view');
    }
  );

  it.each([
    [['1'], ['A001'], 'G001', ['A001', areaCodeForEngland, 'G001']],
    [['1'], ['A001'], areaCodeForEngland, ['A001', areaCodeForEngland]],
    [['1'], [areaCodeForEngland], undefined, [areaCodeForEngland]],
  ])(
    'should make 1 call to the healthIndicatorApi with the expected parameters',
    async (testIndicators, testAreas, testGroup, expectedAreaCodes) => {
      const searchState: SearchStateParams = {
        [SearchParams.IndicatorsSelected]: testIndicators,
        [SearchParams.AreasSelected]: testAreas,
        [SearchParams.GroupSelected]: testGroup,
      };
      mockIndicatorsApi.getHealthDataForAnIndicator.mockResolvedValueOnce([]);

      await OneIndicatorOneAreaView({ searchState: searchState });

      expect(
        mockIndicatorsApi.getHealthDataForAnIndicator
      ).toHaveBeenNthCalledWith(
        1,
        {
          areaCodes: expectedAreaCodes,
          indicatorId: 1,
          comparisonMethod: GetHealthDataForAnIndicatorComparisonMethodEnum.Rag,
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
      [SearchParams.AreasSelected]: ['E06000047'],
    };

    mockIndicatorSearchService.getIndicator.mockResolvedValueOnce({
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
    });

    const page = await OneIndicatorOneAreaView({
      searchState: searchParams,
    });

    expect(mockIndicatorSearchService.getIndicator).toHaveBeenCalledWith(
      indicatorId
    );

    expect(page.props.indicatorMetadata).not.toBeUndefined();
  });

  it('should call OneIndicatorOneAreaViewPlots with the correct props', async () => {
    const searchState: SearchStateParams = {
      [SearchParams.IndicatorsSelected]: ['1'],
      [SearchParams.AreasSelected]: ['A001'],
    };
    mockIndicatorsApi.getHealthDataForAnIndicator.mockResolvedValueOnce([
      mockHealthData['108'][1],
    ]);

    const page = await OneIndicatorOneAreaView({ searchState: searchState });

    expect(page.props.healthIndicatorData).toEqual([mockHealthData['108'][1]]);
    expect(page.props.searchState).toEqual(searchState);
  });
});

/**
 * @jest-environment node
 */

import {
  BenchmarkComparisonMethod,
  IndicatorPolarity,
  IndicatorsApi,
} from '@/generated-sources/ft-api-client';
import { SearchParams, SearchStateParams } from '@/lib/searchStateManager';
import { mockDeep } from 'jest-mock-extended';
import OneIndicatorTwoOrMoreAreasView from '.';
import { areaCodeForEngland } from '@/lib/chartHelpers/constants';
import {
  API_CACHE_CONFIG,
  ApiClientFactory,
} from '@/lib/apiClient/apiClientFactory';
import { mockHealthData } from '@/mock/data/healthdata';
import regionsMap from '@/assets/maps/Regions_December_2023_Boundaries_EN_BUC_1958740832896680092.geo.json';
import { ALL_AREAS_SELECTED } from '@/lib/areaFilterHelpers/constants';
import { generateIndicatorDocument } from '@/lib/search/mockDataHelper';

const mockIndicatorsApi = mockDeep<IndicatorsApi>();
ApiClientFactory.getIndicatorsApiClient = () => mockIndicatorsApi;

const mockMapGeographyData = { mapFile: regionsMap };

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

      mockIndicatorsApi.getHealthDataForAnIndicator.mockResolvedValueOnce({
        areaHealthData: [],
      });
      await expect(async () => {
        await OneIndicatorTwoOrMoreAreasView({
          searchState: searchState,
        });
      }).rejects.toThrow('Invalid parameters provided to view');
    }
  );

  it.each([
    [
      '1',
      ['A001', 'A002'],
      'G001',
      ['A001', 'A002', areaCodeForEngland, 'G001'],
    ],
    [
      '1',
      ['A001', 'A002'],
      areaCodeForEngland,
      ['A001', 'A002', areaCodeForEngland],
    ],
  ])(
    'should make appropriate number of calls to the healthIndicatorApi with the expected parameters',
    async (testIndicators, testAreas, testGroup, expectedAreaCodes) => {
      const searchState: SearchStateParams = {
        [SearchParams.IndicatorsSelected]: [testIndicators],
        [SearchParams.GroupSelected]: testGroup,
        [SearchParams.AreasSelected]: testAreas,
      };
      mockIndicatorsApi.getHealthDataForAnIndicator.mockResolvedValueOnce({
        areaHealthData: [],
      });

      await OneIndicatorTwoOrMoreAreasView({
        searchState: searchState,
      });

      expect(
        mockIndicatorsApi.getHealthDataForAnIndicator
      ).toHaveBeenNthCalledWith(
        1,
        {
          areaCodes: expectedAreaCodes,
          indicatorId: Number(testIndicators),
        },
        API_CACHE_CONFIG
      );
    }
  );

  it('should make appropriate number of calls to the healthIndicatorApi with the expected parameters with a long list of areas', async () => {
    const testIndicators = '1';
    const testAreas = new Array(101).fill('a', 0, 101);
    const testGroup = 'G001';

    const searchState: SearchStateParams = {
      [SearchParams.IndicatorsSelected]: [testIndicators],
      [SearchParams.GroupSelected]: testGroup,
      [SearchParams.AreasSelected]: testAreas,
    };
    mockIndicatorsApi.getHealthDataForAnIndicator.mockResolvedValueOnce({
      areaHealthData: [],
    });

    await OneIndicatorTwoOrMoreAreasView({
      searchState: searchState,
    });

    expect(mockIndicatorsApi.getHealthDataForAnIndicator).toHaveBeenCalledTimes(
      2
    );

    const expected2 = {
      areaCodes: ['a', 'E92000001', 'G001'],
      indicatorId: Number(testIndicators),
    };

    expect(
      mockIndicatorsApi.getHealthDataForAnIndicator
    ).toHaveBeenNthCalledWith(2, expected2, API_CACHE_CONFIG);
  });

  it('should pass the first indicatorDocument from selectedIndicatorData as indicatorMetadata prop', async () => {
    const firstIndicatorDocument = generateIndicatorDocument('1');

    const searchParams: SearchStateParams = {
      [SearchParams.SearchedIndicator]: 'testing',
      [SearchParams.IndicatorsSelected]: ['1'],
      [SearchParams.AreasSelected]: ['E12000001', 'E12000003'],
    };

    mockIndicatorsApi.getHealthDataForAnIndicator.mockResolvedValueOnce({
      areaHealthData: [mockHealthData['108'][1]],
    });

    const page = await OneIndicatorTwoOrMoreAreasView({
      selectedIndicatorsData: [firstIndicatorDocument],
      searchState: searchParams,
    });

    expect(page.props.indicatorMetadata).toEqual(firstIndicatorDocument);
  });

  it('should call OneIndicatorTwoOrMoreAreasViewPlot with the correct props', async () => {
    const searchState: SearchStateParams = {
      [SearchParams.IndicatorsSelected]: ['1'],
      [SearchParams.GroupSelected]: 'G001',
      [SearchParams.AreaTypeSelected]: 'regions',
      [SearchParams.AreasSelected]: ['E12000001', 'E12000003'],
    };
    const mockIndicatorData = {
      areaHealthData: [mockHealthData['108'][1]],
    };
    mockIndicatorsApi.getHealthDataForAnIndicator.mockResolvedValueOnce(
      mockIndicatorData
    );

    const page = await OneIndicatorTwoOrMoreAreasView({
      searchState: searchState,
    });

    expect(page.props.indicatorData).toEqual(mockIndicatorData);
    expect(page.props.searchState).toEqual(searchState);
  });

  it('should pass the map data if all areas in the group are selected', async () => {
    const searchState: SearchStateParams = {
      [SearchParams.IndicatorsSelected]: ['1'],
      [SearchParams.AreasSelected]: ['E12000004', 'E12000006'],
      [SearchParams.GroupAreaSelected]: ALL_AREAS_SELECTED,
      [SearchParams.AreaTypeSelected]: 'regions',
    };
    const mockIndicatorData = {
      polarity: IndicatorPolarity.LowIsGood,
      benchmarkComparisonMethod:
        BenchmarkComparisonMethod.CIOverlappingReferenceValue95,
      areaHealthData: [mockHealthData['108'][1]],
    };
    mockIndicatorsApi.getHealthDataForAnIndicator.mockResolvedValueOnce(
      mockIndicatorData
    );

    const page = await OneIndicatorTwoOrMoreAreasView({
      searchState: searchState,
    });

    expect(page.props.indicatorData).toEqual(mockIndicatorData);
    expect(page.props.searchState).toEqual(searchState);
    expect(page.props.mapGeographyData.mapFile).toEqual(
      mockMapGeographyData.mapFile
    );
  });
});

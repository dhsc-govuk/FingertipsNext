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
import { englandAreaType } from '@/lib/areaFilterHelpers/areaType';

const mockIndicatorsApi = mockDeep<IndicatorsApi>();
ApiClientFactory.getIndicatorsApiClient = () => mockIndicatorsApi;

const mockMapGeographyData = { mapFile: regionsMap };

describe('OneIndicatorTwoOrMoreAreasView', () => {
  const testIndicators = '1';
  const testAreas = ['A001', 'A002'];
  const testGroup = 'G001';
  const testAreaType = 'test_area_type';
  const testGroupType = 'test_group_type';

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

  it('should make appropriate number of calls to the healthIndicatorApi when no group is specified', async () => {
    const searchState: SearchStateParams = {
      [SearchParams.IndicatorsSelected]: [testIndicators],
      [SearchParams.AreasSelected]: testAreas,
      [SearchParams.AreaTypeSelected]: testAreaType,
    };
    mockIndicatorsApi.getHealthDataForAnIndicator.mockResolvedValueOnce({
      areaHealthData: [],
    });
    mockIndicatorsApi.getHealthDataForAnIndicator.mockResolvedValueOnce({
      areaHealthData: [],
    });
    mockIndicatorsApi.getHealthDataForAnIndicator.mockResolvedValueOnce({
      areaHealthData: [],
    });

    await OneIndicatorTwoOrMoreAreasView({
      searchState: searchState,
    });

    expect(mockIndicatorsApi.getHealthDataForAnIndicator).toHaveBeenCalledTimes(
      2
    );

    expect(
      mockIndicatorsApi.getHealthDataForAnIndicator
    ).toHaveBeenNthCalledWith(
      1,
      {
        areaCodes: testAreas,
        indicatorId: Number(testIndicators),
        areaType: testAreaType,
      },
      API_CACHE_CONFIG
    );
    expect(
      mockIndicatorsApi.getHealthDataForAnIndicator
    ).toHaveBeenNthCalledWith(
      2,
      {
        areaCodes: [areaCodeForEngland],
        indicatorId: Number(testIndicators),
        areaType: 'england',
      },
      API_CACHE_CONFIG
    );
  });

  it('should make appropriate number of calls to the healthIndicatorApi when a group is specified', async () => {
    const searchState: SearchStateParams = {
      [SearchParams.IndicatorsSelected]: [testIndicators],
      [SearchParams.AreasSelected]: testAreas,
      [SearchParams.AreaTypeSelected]: testAreaType,
      [SearchParams.GroupSelected]: testGroup,
      [SearchParams.GroupTypeSelected]: testGroupType,
    };
    mockIndicatorsApi.getHealthDataForAnIndicator.mockResolvedValueOnce({
      areaHealthData: [],
    });
    mockIndicatorsApi.getHealthDataForAnIndicator.mockResolvedValueOnce({
      areaHealthData: [],
    });
    mockIndicatorsApi.getHealthDataForAnIndicator.mockResolvedValueOnce({
      areaHealthData: [],
    });

    await OneIndicatorTwoOrMoreAreasView({
      searchState: searchState,
    });

    expect(mockIndicatorsApi.getHealthDataForAnIndicator).toHaveBeenCalledTimes(
      3
    );

    expect(
      mockIndicatorsApi.getHealthDataForAnIndicator
    ).toHaveBeenNthCalledWith(
      1,
      {
        areaCodes: testAreas,
        indicatorId: Number(testIndicators),
        areaType: testAreaType,
      },
      API_CACHE_CONFIG
    );
    expect(
      mockIndicatorsApi.getHealthDataForAnIndicator
    ).toHaveBeenNthCalledWith(
      2,
      {
        areaCodes: [areaCodeForEngland],
        indicatorId: Number(testIndicators),
        areaType: 'england',
      },
      API_CACHE_CONFIG
    );
    expect(
      mockIndicatorsApi.getHealthDataForAnIndicator
    ).toHaveBeenNthCalledWith(
      3,
      {
        areaCodes: [testGroup],
        indicatorId: Number(testIndicators),
        areaType: testGroupType,
      },
      API_CACHE_CONFIG
    );
  });

  it('should make appropriate number of calls to the healthIndicatorApi with the expected parameters with a long list of areas', async () => {
    const testAreas = new Array(101).fill('a', 0, 101);
    const searchState: SearchStateParams = {
      [SearchParams.IndicatorsSelected]: [testIndicators],
      [SearchParams.AreasSelected]: testAreas,
      [SearchParams.AreaTypeSelected]: testAreaType,
      [SearchParams.GroupSelected]: testGroup,
      [SearchParams.GroupTypeSelected]: testGroupType,
    };
    mockIndicatorsApi.getHealthDataForAnIndicator.mockResolvedValueOnce({
      areaHealthData: [],
    });

    await OneIndicatorTwoOrMoreAreasView({
      searchState: searchState,
    });

    expect(mockIndicatorsApi.getHealthDataForAnIndicator).toHaveBeenCalledTimes(
      4
    );

    expect(
      mockIndicatorsApi.getHealthDataForAnIndicator
    ).toHaveBeenNthCalledWith(
      1,
      {
        areaCodes: new Array(100).fill('a', 0, 100),
        indicatorId: Number(testIndicators),
        areaType: testAreaType,
      },
      API_CACHE_CONFIG
    );

    expect(
      mockIndicatorsApi.getHealthDataForAnIndicator
    ).toHaveBeenNthCalledWith(
      2,
      {
        areaCodes: ['a'],
        indicatorId: Number(testIndicators),
        areaType: testAreaType,
      },
      API_CACHE_CONFIG
    );

    expect(
      mockIndicatorsApi.getHealthDataForAnIndicator
    ).toHaveBeenNthCalledWith(
      3,
      {
        areaCodes: [areaCodeForEngland],
        indicatorId: Number(testIndicators),
        areaType: englandAreaType.key,
      },
      API_CACHE_CONFIG
    );

    expect(
      mockIndicatorsApi.getHealthDataForAnIndicator
    ).toHaveBeenNthCalledWith(
      4,
      {
        areaCodes: [testGroup],
        indicatorId: Number(testIndicators),
        areaType: testGroupType,
      },
      API_CACHE_CONFIG
    );
  });

  it('should pass the first indicatorDocument from selectedIndicatorData as indicatorMetadata prop', async () => {
    const firstIndicatorDocument = generateIndicatorDocument('1');

    const searchParams: SearchStateParams = {
      [SearchParams.SearchedIndicator]: 'testing',
      [SearchParams.IndicatorsSelected]: ['1'],
      [SearchParams.AreasSelected]: ['E12000001', 'E12000003'],
      [SearchParams.AreaTypeSelected]: 'regions',
    };

    const mockIndicatorData = {
      areaHealthData: [mockHealthData['108'][1], mockHealthData['108'][2]],
    };
    mockIndicatorsApi.getHealthDataForAnIndicator.mockResolvedValueOnce(
      mockIndicatorData
    );

    const page = await OneIndicatorTwoOrMoreAreasView({
      selectedIndicatorsData: [firstIndicatorDocument],
      searchState: searchParams,
    });

    expect(page.props.children.props.indicatorMetadata).toEqual(
      firstIndicatorDocument
    );
  });

  it('should call OneIndicatorTwoOrMoreAreasViewPlot with the correct props', async () => {
    const searchState: SearchStateParams = {
      [SearchParams.IndicatorsSelected]: ['1'],
      [SearchParams.GroupSelected]: 'G001',
      [SearchParams.AreaTypeSelected]: 'regions',
      [SearchParams.AreasSelected]: ['E12000001', 'E12000003'],
    };
    const mockIndicatorData = {
      areaHealthData: [mockHealthData['108'][1], mockHealthData['108'][2]],
    };
    mockIndicatorsApi.getHealthDataForAnIndicator.mockResolvedValueOnce(
      mockIndicatorData
    );

    const page = await OneIndicatorTwoOrMoreAreasView({
      searchState: searchState,
    });

    expect(page.props.children.props.indicatorData).toEqual(mockIndicatorData);
    expect(page.props.children.props.searchState).toEqual(searchState);
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

    expect(page.props.children.props.indicatorData).toEqual(mockIndicatorData);
    expect(page.props.children.props.searchState).toEqual(searchState);
    expect(page.props.children.props.mapGeographyData.mapFile).toEqual(
      mockMapGeographyData.mapFile
    );
  });
});

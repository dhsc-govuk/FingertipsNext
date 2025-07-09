/**
 * @vitest-environment node
 */

import {
  BenchmarkReferenceType,
  IndicatorsApi,
} from '@/generated-sources/ft-api-client';
import { SearchParams, SearchStateParams } from '@/lib/searchStateManager';
import { mockDeep } from 'vitest-mock-extended';

import {
  API_CACHE_CONFIG,
  ApiClientFactory,
} from '@/lib/apiClient/apiClientFactory';
import { mockHealthData } from '@/mock/data/healthdata';
import { generateIndicatorDocument } from '@/lib/search/mockDataHelper';
import { regionsAreaType } from '@/lib/areaFilterHelpers/areaType';
import OneIndicatorTwoOrMoreAreasView from '@/components/views/OneIndicatorTwoOrMoreAreasView/index';

const mockIndicatorsApi = mockDeep<IndicatorsApi>();
ApiClientFactory.getIndicatorsApiClient = () => mockIndicatorsApi;

describe('OneIndicatorTwoOrMoreAreasView', () => {
  afterEach(() => {
    vi.resetAllMocks();
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

      mockIndicatorsApi.getHealthDataForAnIndicator.mockResolvedValue({
        areaHealthData: [],
      });
      await expect(async () => {
        await OneIndicatorTwoOrMoreAreasView({
          searchState: searchState,
        });
      }).rejects.toThrow('Invalid parameters provided to view');
    }
  );

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
    mockIndicatorsApi.getHealthDataForAnIndicator.mockResolvedValue(
      mockIndicatorData
    );

    const page = await OneIndicatorTwoOrMoreAreasView({
      searchState: searchState,
    });

    expect(page.props.children.props.indicatorData).toEqual(mockIndicatorData);
  });

  it('should pass the latestYear flag as true when there are more than 2 areas selected', async () => {
    const searchState: SearchStateParams = {
      [SearchParams.IndicatorsSelected]: ['1'],
      [SearchParams.AreasSelected]: ['E12000004', 'E12000006', 'E12000007'],
    };

    mockIndicatorsApi.getHealthDataForAnIndicator.mockResolvedValue({});

    await OneIndicatorTwoOrMoreAreasView({
      searchState: searchState,
      availableAreas: [
        { code: 'E12000004', name: 'area 1', areaType: regionsAreaType },
        { code: 'E12000006', name: 'area 2', areaType: regionsAreaType },
        { code: 'E12000007', name: 'area 3', areaType: regionsAreaType },
      ],
    });

    expect(mockIndicatorsApi.getHealthDataForAnIndicator).toHaveBeenCalledWith(
      {
        areaCodes: ['E12000004', 'E12000006', 'E12000007'],
        indicatorId: 1,
        latestOnly: true,
        benchmarkRefType: BenchmarkReferenceType.England,
      },
      API_CACHE_CONFIG
    );
  });

  it('should pass the latestYear flag as false when there are 2 areas or less selected', async () => {
    const searchState: SearchStateParams = {
      [SearchParams.IndicatorsSelected]: ['1'],
      [SearchParams.AreasSelected]: ['E12000004', 'E12000006'],
    };

    mockIndicatorsApi.getHealthDataForAnIndicator.mockResolvedValue({});

    await OneIndicatorTwoOrMoreAreasView({
      searchState: searchState,
      availableAreas: [
        { code: 'E12000004', name: 'area 1', areaType: regionsAreaType },
        { code: 'E12000006', name: 'area 2', areaType: regionsAreaType },
      ],
    });

    expect(mockIndicatorsApi.getHealthDataForAnIndicator).toHaveBeenCalledWith(
      {
        areaCodes: ['E12000004', 'E12000006'],
        indicatorId: 1,
        latestOnly: false,
        benchmarkRefType: BenchmarkReferenceType.England,
      },
      API_CACHE_CONFIG
    );
  });
});

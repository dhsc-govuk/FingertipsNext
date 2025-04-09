/**
 * @jest-environment node
 */

import {
  AreasApi,
  BenchmarkComparisonMethod,
  GetHealthDataForAnIndicatorInequalitiesEnum,
  IndicatorPolarity,
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
import { generateIndicatorDocument } from '@/lib/search/mockDataHelper';
import { londonNHSRegion } from '@/mock/data/areas/nhsRegionsAreas';
import { englandAreaType } from '@/lib/areaFilterHelpers/areaType';

const mockIndicatorsApi = mockDeep<IndicatorsApi>();
ApiClientFactory.getIndicatorsApiClient = () => mockIndicatorsApi;

const mockAreasApi = mockDeep<AreasApi>();
ApiClientFactory.getAreasApiClient = () => mockAreasApi;

describe('OneIndicatorOneAreaView', () => {
  afterEach(() => {
    jest.resetAllMocks();
  });
  beforeEach(() => {
    mockAreasApi.getArea.mockResolvedValue(londonNHSRegion);
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
      mockIndicatorsApi.getHealthDataForAnIndicator.mockResolvedValueOnce({
        areaHealthData: [],
      });
      await expect(async () => {
        await OneIndicatorOneAreaView({ searchState: searchState });
      }).rejects.toThrow('Invalid parameters provided to view');
    }
  );

  it.each([
    [['1'], ['A001'], 'G001', 'AT001', ['A001', areaCodeForEngland, 'G001']],
    [
      ['1'],
      ['A001'],
      areaCodeForEngland,
      'AT001',
      ['A001', areaCodeForEngland],
    ],
    [
      ['1'],
      [areaCodeForEngland],
      undefined,
      englandAreaType.key,
      [areaCodeForEngland],
    ],
  ])(
    'should make 1 call to the healthIndicatorApi with the expected parameters',
    async (
      testIndicators,
      testAreas,
      testGroup,
      testAreaType,
      expectedAreaCodes
    ) => {
      const searchState: SearchStateParams = {
        [SearchParams.IndicatorsSelected]: testIndicators,
        [SearchParams.AreasSelected]: testAreas,
        [SearchParams.GroupSelected]: testGroup,
        [SearchParams.AreaTypeSelected]: testAreaType,
      };
      mockIndicatorsApi.getHealthDataForAnIndicator.mockResolvedValueOnce({
        areaHealthData: [],
      });

      await OneIndicatorOneAreaView({ searchState: searchState });

      expect(
        mockIndicatorsApi.getHealthDataForAnIndicator
      ).toHaveBeenNthCalledWith(
        1,
        {
          areaCodes: expectedAreaCodes,
          indicatorId: 1,
          inequalities: [
            GetHealthDataForAnIndicatorInequalitiesEnum.Sex,
            GetHealthDataForAnIndicatorInequalitiesEnum.Deprivation,
          ],
          areaType: testAreaType,
        },
        API_CACHE_CONFIG
      );
    }
  );

  it('should pass the first indicatorDocument from selectedIndicatorData as indicatorMetadata prop', async () => {
    const firstIndicatorDocument = generateIndicatorDocument('1');

    const searchParams: SearchStateParams = {
      [SearchParams.SearchedIndicator]: 'testing',
      [SearchParams.IndicatorsSelected]: ['1'],
      [SearchParams.AreasSelected]: ['E12000001'],
      [SearchParams.AreaTypeSelected]: 'regions',
    };

    const mockIndicatorData = {
      areaHealthData: [mockHealthData['108'][1]],
    };
    mockIndicatorsApi.getHealthDataForAnIndicator.mockResolvedValueOnce(
      mockIndicatorData
    );

    const page = await OneIndicatorOneAreaView({
      selectedIndicatorsData: [firstIndicatorDocument],
      searchState: searchParams,
    });

    expect(page.props.children.props.indicatorMetadata).toEqual(
      firstIndicatorDocument
    );
  });

  it('should call OneIndicatorOneAreaViewPlots with the correct props', async () => {
    const searchState: SearchStateParams = {
      [SearchParams.IndicatorsSelected]: ['1'],
      [SearchParams.AreasSelected]: ['E12000001'],
    };
    const mockIndicator = {
      polarity: IndicatorPolarity.NoJudgement,
      benchmarkComparisonMethod:
        BenchmarkComparisonMethod.CIOverlappingReferenceValue99_8,
      areaHealthData: [mockHealthData['108'][1]],
    };
    mockIndicatorsApi.getHealthDataForAnIndicator.mockResolvedValueOnce(
      mockIndicator
    );

    const page = await OneIndicatorOneAreaView({ searchState: searchState });
    expect(page.props.children.props.indicatorData).toEqual(mockIndicator);
    expect(page.props.children.props.searchState).toEqual(searchState);
  });
});

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

import { ApiClientFactory } from '@/lib/apiClient/apiClientFactory';
import { mockHealthData } from '@/mock/data/healthdata';
import regionsMap from '@/assets/maps/Regions_December_2023_Boundaries_EN_BUC_1958740832896680092.geo.json';
import { ALL_AREAS_SELECTED } from '@/lib/areaFilterHelpers/constants';
import { generateIndicatorDocument } from '@/lib/search/mockDataHelper';
import { regionsAreaType } from '@/lib/areaFilterHelpers/areaType';
import OneIndicatorTwoOrMoreAreasView from '@/components/views/OneIndicatorTwoOrMoreAreasView/index';

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
    mockIndicatorsApi.getHealthDataForAnIndicator.mockResolvedValue(
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
    mockIndicatorsApi.getHealthDataForAnIndicator.mockResolvedValue(
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
    mockIndicatorsApi.getHealthDataForAnIndicator.mockResolvedValue(
      mockIndicatorData
    );

    const page = await OneIndicatorTwoOrMoreAreasView({
      searchState: searchState,
      availableAreas: [
        { code: 'E12000004', name: 'area 1', areaType: regionsAreaType },
        { code: 'E12000006', name: 'area 2', areaType: regionsAreaType },
      ],
    });

    expect(page.props.children.props.indicatorData).toEqual(mockIndicatorData);
    expect(page.props.children.props.searchState).toEqual(searchState);
    expect(page.props.children.props.mapGeographyData.mapFile).toEqual(
      mockMapGeographyData.mapFile
    );
  });
});

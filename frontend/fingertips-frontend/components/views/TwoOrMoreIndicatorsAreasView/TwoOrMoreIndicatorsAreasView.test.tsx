/**
 * @vitest-environment node
 */

import {
  BenchmarkReferenceType,
  HealthDataForArea,
  IndicatorsApi,
} from '@/generated-sources/ft-api-client';
import { SearchParams, SearchStateParams } from '@/lib/searchStateManager';
import { mockDeep } from 'vitest-mock-extended';
import TwoOrMoreIndicatorsAreasView from '.';
import { areaCodeForEngland } from '@/lib/chartHelpers/constants';
import {
  API_CACHE_CONFIG,
  ApiClientFactory,
} from '@/lib/apiClient/apiClientFactory';
import { IndicatorDocument } from '@/lib/search/searchTypes';
import { IndicatorWithHealthDataForArea } from '@/generated-sources/ft-api-client';
import { englandAreaType } from '@/lib/areaFilterHelpers/areaType';

const mockIndicatorsApi = mockDeep<IndicatorsApi>();
ApiClientFactory.getIndicatorsApiClient = () => mockIndicatorsApi;

const mockAreaCode = 'A001';
const mockGroupCode = 'G001';
const mockAreaType = 'AT001';
const mockGroupType = 'GT001';

const mockAreaData: HealthDataForArea = {
  areaCode: mockAreaCode,
  areaName: 'area',
  healthData: [],
};

const mockGroupData: HealthDataForArea = {
  areaCode: mockGroupCode,
  areaName: 'group',
  healthData: [],
};

const mockEnglandData: HealthDataForArea = {
  areaCode: areaCodeForEngland,
  areaName: 'england',
  healthData: [],
};

const mockIndicator: IndicatorWithHealthDataForArea = {
  areaHealthData: [mockAreaData, mockGroupData, mockEnglandData],
};

const mockIndicatorDocument = (indicatorId: string): IndicatorDocument => {
  return {
    indicatorID: indicatorId,
    indicatorName: 'mock indicator',
    indicatorDefinition: 'mock description',
    dataSource: '1',
    earliestDataPeriod: '1',
    latestDataPeriod: '1',
    lastUpdatedDate: new Date(),
    hasInequalities: false,
    unitLabel: '1',
  };
};

const fullSearchParams: SearchStateParams = {
  [SearchParams.IndicatorsSelected]: ['1', '2'],
  [SearchParams.AreasSelected]: [mockAreaCode],
  [SearchParams.GroupSelected]: mockGroupCode,
  [SearchParams.AreaTypeSelected]: mockAreaType,
  [SearchParams.GroupTypeSelected]: mockGroupType,
};

const fullSelectedIndicatorsData: IndicatorDocument[] = [
  mockIndicatorDocument('1'),
  mockIndicatorDocument('2'),
];

describe('TwoOrMoreIndicatorsAreasView', () => {
  beforeEach(() => {
    mockIndicatorsApi.getHealthDataForAnIndicator.mockClear();
    mockIndicatorsApi.getHealthDataForAnIndicator.mockResolvedValue(
      mockIndicator
    );
  });

  it('should call indicators API with correct parameters', async () => {
    await TwoOrMoreIndicatorsAreasView({
      searchState: fullSearchParams,
      selectedIndicatorsData: fullSelectedIndicatorsData,
    });

    expect(mockIndicatorsApi.getHealthDataForAnIndicator).toHaveBeenCalledTimes(
      6
    );

    expect(
      mockIndicatorsApi.getHealthDataForAnIndicator
    ).toHaveBeenNthCalledWith(
      1,
      {
        areaCodes: [mockAreaCode],
        indicatorId: 1,
        areaType: mockAreaType,
        benchmarkRefType: BenchmarkReferenceType.England,
        latestOnly: true,
      },
      API_CACHE_CONFIG
    );

    expect(
      mockIndicatorsApi.getHealthDataForAnIndicator
    ).toHaveBeenNthCalledWith(
      2,
      {
        areaCodes: [areaCodeForEngland],
        indicatorId: 1,
        areaType: englandAreaType.key,
        benchmarkRefType: BenchmarkReferenceType.England,
        latestOnly: true,
      },
      API_CACHE_CONFIG
    );

    expect(
      mockIndicatorsApi.getHealthDataForAnIndicator
    ).toHaveBeenNthCalledWith(
      3,
      {
        areaCodes: [mockGroupCode],
        indicatorId: 1,
        areaType: mockGroupType,
        benchmarkRefType: BenchmarkReferenceType.England,
        latestOnly: true,
      },
      API_CACHE_CONFIG
    );

    expect(
      mockIndicatorsApi.getHealthDataForAnIndicator
    ).toHaveBeenNthCalledWith(
      4,
      {
        areaCodes: [mockAreaCode],
        indicatorId: 2,
        areaType: mockAreaType,
        benchmarkRefType: BenchmarkReferenceType.England,
        latestOnly: true,
      },
      API_CACHE_CONFIG
    );

    expect(
      mockIndicatorsApi.getHealthDataForAnIndicator
    ).toHaveBeenNthCalledWith(
      5,
      {
        areaCodes: [areaCodeForEngland],
        indicatorId: 2,
        areaType: englandAreaType.key,
        benchmarkRefType: BenchmarkReferenceType.England,
        latestOnly: true,
      },
      API_CACHE_CONFIG
    );

    expect(
      mockIndicatorsApi.getHealthDataForAnIndicator
    ).toHaveBeenNthCalledWith(
      6,
      {
        areaCodes: [mockGroupCode],
        indicatorId: 2,
        areaType: mockGroupType,
        benchmarkRefType: BenchmarkReferenceType.England,
        latestOnly: true,
      },
      API_CACHE_CONFIG
    );
  });

  it('should call TwoOrMoreIndicatorsAreasViewPlots with the correct props', async () => {
    const page = await TwoOrMoreIndicatorsAreasView({
      searchState: fullSearchParams,
      selectedIndicatorsData: fullSelectedIndicatorsData,
    });

    expect(page.props.children[1].props.indicatorData).toEqual([
      mockIndicator,
      mockIndicator,
    ]);
    expect(page.props.children[1].props.indicatorMetadata).toEqual(
      fullSelectedIndicatorsData
    );
  });

  it('should throw an error when search state contains no selected indicators', async () => {
    const searchState: SearchStateParams = {
      ...fullSearchParams,
      [SearchParams.IndicatorsSelected]: [],
    };

    await expect(async () => {
      await TwoOrMoreIndicatorsAreasView({
        searchState: searchState,
        selectedIndicatorsData: fullSelectedIndicatorsData,
      });
    }).rejects.toThrow('indicators');
  });

  it('should throw an error when search state contains fewer than 2 selected indicators', async () => {
    const searchState: SearchStateParams = {
      ...fullSearchParams,
      [SearchParams.IndicatorsSelected]: ['1'],
    };

    await expect(async () => {
      await TwoOrMoreIndicatorsAreasView({
        searchState: searchState,
        selectedIndicatorsData: fullSelectedIndicatorsData,
      });
    }).rejects.toThrow('indicators');
  });

  it('should throw an error when indicator metadata is empty', async () => {
    const selectedIndicatorsData: IndicatorDocument[] = [];

    await expect(async () => {
      await TwoOrMoreIndicatorsAreasView({
        searchState: fullSearchParams,
        selectedIndicatorsData: selectedIndicatorsData,
      });
    }).rejects.toThrow('indicator metadata');
  });

  it('should throw an error when indicator metadata mismatches selected indicators', async () => {
    const selectedIndicatorsData: IndicatorDocument[] = [];
    fullSearchParams[SearchParams.IndicatorsSelected]?.forEach(
      (indicatorId) => {
        selectedIndicatorsData.push(mockIndicatorDocument(indicatorId));
      }
    );
    selectedIndicatorsData.push(mockIndicatorDocument('99999'));

    await expect(async () => {
      await TwoOrMoreIndicatorsAreasView({
        searchState: fullSearchParams,
        selectedIndicatorsData: selectedIndicatorsData,
      });
    }).rejects.toThrow('indicator metadata');
  });
});

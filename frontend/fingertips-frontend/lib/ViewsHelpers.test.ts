import {
  getHealthDataForIndicator,
  getIndicatorData,
  GetIndicatorDataParam,
} from './ViewsHelpers';
import {
  BenchmarkReferenceType,
  IndicatorsApi,
  IndicatorWithHealthDataForArea,
} from '@/generated-sources/ft-api-client';
import { mockDeep } from 'jest-mock-extended';
import {
  API_CACHE_CONFIG,
  ApiClientFactory,
} from '@/lib/apiClient/apiClientFactory';
import { healthDataPoint } from './mocks';
import { areaCodeForEngland } from '@/lib/chartHelpers/constants';
import { maxNumAreasThatCanBeRequestedAPI } from './chunkArray';

const mockIndicator: IndicatorWithHealthDataForArea = {
  indicatorId: 1,
  areaHealthData: [
    {
      areaCode: 'A001',
      areaName: 'North FooBar',
      healthData: [healthDataPoint],
    },
  ],
};

describe('getHealthDataForIndicator', () => {
  const mockIndicatorsApi = mockDeep<IndicatorsApi>();
  ApiClientFactory.getIndicatorsApiClient = () => mockIndicatorsApi;

  afterEach(() => {
    jest.resetAllMocks();
  });

  it('should return the health data for indicator', async () => {
    mockIndicatorsApi.getHealthDataForAnIndicator.mockResolvedValueOnce(
      mockIndicator
    );

    const result = await getHealthDataForIndicator(mockIndicatorsApi, '5555', [
      { areaCodes: ['A001'] },
    ]);

    expect(mockIndicatorsApi.getHealthDataForAnIndicator).toHaveBeenCalledWith(
      { indicatorId: 5555, areaCodes: ['A001'] },
      API_CACHE_CONFIG
    );
    expect(result).toEqual(mockIndicator);
  });

  it('should make the appropriate number of API calls when a long list of areas is requested', async () => {
    const testAreas = new Array(maxNumAreasThatCanBeRequestedAPI + 1).fill(
      'a',
      0,
      maxNumAreasThatCanBeRequestedAPI + 1
    );

    mockIndicatorsApi.getHealthDataForAnIndicator.mockResolvedValueOnce(
      mockIndicator
    );

    await getHealthDataForIndicator(mockIndicatorsApi, '1', [
      {
        areaCodes: testAreas,
      },
    ]);

    expect(
      mockIndicatorsApi.getHealthDataForAnIndicator
    ).toHaveBeenNthCalledWith(
      1,
      {
        areaCodes: new Array(maxNumAreasThatCanBeRequestedAPI).fill(
          'a',
          0,
          maxNumAreasThatCanBeRequestedAPI
        ),
        indicatorId: Number(1),
      },
      API_CACHE_CONFIG
    );

    expect(
      mockIndicatorsApi.getHealthDataForAnIndicator
    ).toHaveBeenNthCalledWith(
      2,
      {
        areaCodes: ['a'],
        indicatorId: Number(1),
      },
      API_CACHE_CONFIG
    );
  });

  it('should return combined data when a long list of areas is requested', async () => {
    const testAreas = new Array(maxNumAreasThatCanBeRequestedAPI + 1).fill(
      'a',
      0,
      maxNumAreasThatCanBeRequestedAPI + 1
    );

    mockIndicatorsApi.getHealthDataForAnIndicator.mockResolvedValueOnce(
      mockIndicator
    );
    mockIndicatorsApi.getHealthDataForAnIndicator.mockResolvedValueOnce({
      ...mockIndicator,
      areaHealthData: [
        {
          areaCode: 'A002',
          areaName: 'South FooBar',
          healthData: [healthDataPoint],
        },
      ],
    });

    const result = await getHealthDataForIndicator(mockIndicatorsApi, '1', [
      { areaCodes: testAreas },
    ]);

    expect(result).toEqual({
      ...mockIndicator,
      areaHealthData: [
        {
          areaCode: 'A001',
          areaName: 'North FooBar',
          healthData: [healthDataPoint],
        },
        {
          areaCode: 'A002',
          areaName: 'South FooBar',
          healthData: [healthDataPoint],
        },
      ],
    });
  });

  it('should throw an error if there is an error making a request', async () => {
    const testAreas = new Array(101).fill('a', 0, 101);

    mockIndicatorsApi.getHealthDataForAnIndicator.mockResolvedValueOnce(
      mockIndicator
    );
    mockIndicatorsApi.getHealthDataForAnIndicator.mockRejectedValueOnce(
      'Something went wrong.'
    );

    await expect(
      async () =>
        await getHealthDataForIndicator(mockIndicatorsApi, '1', testAreas)
    ).rejects.toThrow();
  });

  it('should make multiple requests if different area types are given', async () => {
    mockIndicatorsApi.getHealthDataForAnIndicator.mockResolvedValue(
      mockIndicator
    );
    const mockAreaCode1 = 'A001';
    const mockAreaType1 = 'AT001';
    const mockAreaCode2 = 'A002';
    const mockAreaType2 = 'AT002';

    await getHealthDataForIndicator(mockIndicatorsApi, '1', [
      {
        areaCodes: [mockAreaCode1],
        areaType: mockAreaType1,
      },
      {
        areaCodes: [mockAreaCode2],
        areaType: mockAreaType2,
      },
    ]);

    expect(
      mockIndicatorsApi.getHealthDataForAnIndicator
    ).toHaveBeenNthCalledWith(
      1,
      {
        areaCodes: [mockAreaCode1],
        indicatorId: 1,
        areaType: mockAreaType1,
      },
      API_CACHE_CONFIG
    );

    expect(
      mockIndicatorsApi.getHealthDataForAnIndicator
    ).toHaveBeenNthCalledWith(
      2,
      {
        areaCodes: [mockAreaCode2],
        indicatorId: 1,
        areaType: mockAreaType2,
      },
      API_CACHE_CONFIG
    );
  });
});

describe('getIndicatorData', () => {
  const mockIndicatorsApi = mockDeep<IndicatorsApi>();
  ApiClientFactory.getIndicatorsApiClient = () => mockIndicatorsApi;

  const testParams: GetIndicatorDataParam = {
    areasSelected: ['abc', 'def'],
    indicatorSelected: ['1'],
    selectedAreaType: 'test_area_type',
  };

  afterEach(() => {
    jest.resetAllMocks();
  });

  it('should make appropriate calls to the healthIndicatorApi when no group is specified', async () => {
    mockIndicatorsApi.getHealthDataForAnIndicator.mockResolvedValue(
      mockIndicator
    );

    await getIndicatorData(testParams, true, BenchmarkReferenceType.England);
    expect(mockIndicatorsApi.getHealthDataForAnIndicator).toHaveBeenCalledTimes(
      2
    );

    expect(
      mockIndicatorsApi.getHealthDataForAnIndicator
    ).toHaveBeenNthCalledWith(
      1,
      {
        areaCodes: testParams.areasSelected,
        indicatorId: Number(testParams.indicatorSelected[0]),
        areaType: testParams.selectedAreaType,
        includeEmptyAreas: true,
        benchmarkRefType: BenchmarkReferenceType.England,
      },
      API_CACHE_CONFIG
    );

    expect(
      mockIndicatorsApi.getHealthDataForAnIndicator
    ).toHaveBeenNthCalledWith(
      2,
      {
        areaCodes: [areaCodeForEngland],
        indicatorId: Number(testParams.indicatorSelected[0]),
        areaType: 'england',
        includeEmptyAreas: true,
        benchmarkRefType: BenchmarkReferenceType.England,
      },
      API_CACHE_CONFIG
    );
  });

  const testParamsWithGroup = {
    ...testParams,
    selectedGroupCode: 'ggg',
    selectedGroupType: 'test_group_type',
  };

  it('should make appropriate calls to the healthIndicatorApi when a group is specified', async () => {
    mockIndicatorsApi.getHealthDataForAnIndicator.mockResolvedValue(
      mockIndicator
    );

    await getIndicatorData(
      testParamsWithGroup,
      true,
      BenchmarkReferenceType.England
    );
    expect(mockIndicatorsApi.getHealthDataForAnIndicator).toHaveBeenCalledTimes(
      3
    );

    expect(
      mockIndicatorsApi.getHealthDataForAnIndicator
    ).toHaveBeenNthCalledWith(
      3,
      {
        areaCodes: [testParamsWithGroup.selectedGroupCode],
        indicatorId: Number(testParamsWithGroup.indicatorSelected[0]),
        areaType: testParamsWithGroup.selectedGroupType,
        includeEmptyAreas: true,
        benchmarkRefType: BenchmarkReferenceType.England,
      },
      API_CACHE_CONFIG
    );
  });

  it('should make appropriate calls to the healthIndicatorApi when benchmarkRefType is AreaGroup', async () => {
    mockIndicatorsApi.getHealthDataForAnIndicator.mockResolvedValue(
      mockIndicator
    );

    await getIndicatorData(
      testParamsWithGroup,
      true,
      BenchmarkReferenceType.AreaGroup
    );
    expect(mockIndicatorsApi.getHealthDataForAnIndicator).toHaveBeenCalledTimes(
      3
    );

    expect(
      mockIndicatorsApi.getHealthDataForAnIndicator
    ).toHaveBeenNthCalledWith(
      3,
      {
        areaCodes: [testParamsWithGroup.selectedGroupCode],
        indicatorId: Number(testParamsWithGroup.indicatorSelected[0]),
        areaType: testParamsWithGroup.selectedGroupType,
        includeEmptyAreas: true,
        benchmarkRefType: BenchmarkReferenceType.AreaGroup,
        areaGroup: testParamsWithGroup.selectedGroupCode,
      },
      API_CACHE_CONFIG
    );
  });

  const testParamsWithManyAreas = {
    ...testParamsWithGroup,
    areasSelected: new Array(maxNumAreasThatCanBeRequestedAPI + 1).fill('a'),
  };

  it('should make appropriate calls to the healthIndicatorApi when a long list of areas is specified', async () => {
    mockIndicatorsApi.getHealthDataForAnIndicator.mockResolvedValue(
      mockIndicator
    );

    await getIndicatorData(
      testParamsWithManyAreas,
      true,
      BenchmarkReferenceType.England
    );
    expect(mockIndicatorsApi.getHealthDataForAnIndicator).toHaveBeenCalledTimes(
      4
    );

    const call1arg =
      mockIndicatorsApi.getHealthDataForAnIndicator.mock.calls[0][0];
    expect(call1arg).toHaveProperty(
      'areaCodes',
      testParamsWithManyAreas.areasSelected.slice(
        0,
        maxNumAreasThatCanBeRequestedAPI
      )
    );

    const call2arg =
      mockIndicatorsApi.getHealthDataForAnIndicator.mock.calls[1][0];
    expect(call2arg).toHaveProperty(
      'areaCodes',
      testParamsWithManyAreas.areasSelected.slice(
        maxNumAreasThatCanBeRequestedAPI,
        maxNumAreasThatCanBeRequestedAPI + 1
      )
    );
  });

  it('should specify the year in the calls for England and group when the latest only parameter is provided', async () => {
    mockIndicatorsApi.getHealthDataForAnIndicator.mockResolvedValue(
      mockIndicator
    );

    await getIndicatorData(
      testParamsWithGroup,
      true,
      BenchmarkReferenceType.England,
      true
    );
    expect(mockIndicatorsApi.getHealthDataForAnIndicator).toHaveBeenCalledTimes(
      3
    );

    expect(
      mockIndicatorsApi.getHealthDataForAnIndicator
    ).toHaveBeenNthCalledWith(
      1,
      {
        areaCodes: ['abc', 'def'],
        areaType: 'test_area_type',
        includeEmptyAreas: true,
        indicatorId: 1,
        latestOnly: true,
        benchmarkRefType: BenchmarkReferenceType.England,
      },
      { next: { revalidate: 600 } }
    );
    expect(
      mockIndicatorsApi.getHealthDataForAnIndicator
    ).toHaveBeenNthCalledWith(
      2,
      {
        areaCodes: [areaCodeForEngland],
        areaType: 'england',
        includeEmptyAreas: true,
        indicatorId: 1,
        years: [2006],
      },
      { next: { revalidate: 600 } }
    );
    expect(
      mockIndicatorsApi.getHealthDataForAnIndicator
    ).toHaveBeenNthCalledWith(
      3,
      {
        areaCodes: ['ggg'],
        areaType: 'test_group_type',
        includeEmptyAreas: true,
        indicatorId: 1,
        years: [2006],
      },
      { next: { revalidate: 600 } }
    );
  });

  // Edge case where client has navigated to chart page where no requested areas contain data for the given indicator
  // AI search will only return results that have data for the indicator
  // In this case, it suffices to set the calls for England and group to get data for the latest year since no sub areas contain data anyway
  it('should request latest data in the calls for England and group when latest only parameter is provided and sub areas contain no data', async () => {
    const mockEmptyIndicatorData: IndicatorWithHealthDataForArea = {
      indicatorId: 1,
      areaHealthData: [
        {
          areaCode: 'abc',
          areaName: 'North FooBar',
          healthData: [],
        },
        {
          areaCode: 'def',
          areaName: 'South FooBar',
          healthData: [],
        },
      ],
    };
    mockIndicatorsApi.getHealthDataForAnIndicator.mockResolvedValueOnce(
      mockEmptyIndicatorData
    );
    mockIndicatorsApi.getHealthDataForAnIndicator.mockResolvedValue(
      mockIndicator
    );

    await getIndicatorData(
      testParamsWithGroup,
      true,
      BenchmarkReferenceType.England,
      true
    );
    expect(mockIndicatorsApi.getHealthDataForAnIndicator).toHaveBeenCalledTimes(
      3
    );

    expect(
      mockIndicatorsApi.getHealthDataForAnIndicator
    ).toHaveBeenNthCalledWith(
      1,
      {
        areaCodes: ['abc', 'def'],
        areaType: 'test_area_type',
        includeEmptyAreas: true,
        indicatorId: 1,
        latestOnly: true,
        benchmarkRefType: BenchmarkReferenceType.England,
      },
      { next: { revalidate: 600 } }
    );
    expect(
      mockIndicatorsApi.getHealthDataForAnIndicator
    ).toHaveBeenNthCalledWith(
      2,
      {
        areaCodes: [areaCodeForEngland],
        areaType: 'england',
        includeEmptyAreas: true,
        indicatorId: 1,
        latestOnly: true,
      },
      { next: { revalidate: 600 } }
    );
    expect(
      mockIndicatorsApi.getHealthDataForAnIndicator
    ).toHaveBeenNthCalledWith(
      3,
      {
        areaCodes: ['ggg'],
        areaType: 'test_group_type',
        includeEmptyAreas: true,
        indicatorId: 1,
        latestOnly: true,
      },
      { next: { revalidate: 600 } }
    );
  });
});

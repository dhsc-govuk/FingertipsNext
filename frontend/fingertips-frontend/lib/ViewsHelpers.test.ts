import {
  getHealthDataForIndicator,
  getIndicatorData,
  GetIndicatorDataParam,
} from './ViewsHelpers';
import {
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
    const testAreas = new Array(101).fill('a', 0, 101);

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
        areaCodes: new Array(100).fill('a', 0, 100),
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
    const testAreas = new Array(101).fill('a', 0, 101);

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

    await getIndicatorData(testParams, true);
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

    await getIndicatorData(testParamsWithGroup, true);
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
      },
      API_CACHE_CONFIG
    );
  });

  const testParamsWithManyAreas = {
    ...testParamsWithGroup,
    areasSelected: new Array(101).fill('a'),
  };

  it('should make appropriate calls to the healthIndicatorApi when a long list of areas is specified', async () => {
    mockIndicatorsApi.getHealthDataForAnIndicator.mockResolvedValue(
      mockIndicator
    );

    await getIndicatorData(testParamsWithManyAreas, true);
    expect(mockIndicatorsApi.getHealthDataForAnIndicator).toHaveBeenCalledTimes(
      4
    );

    const call1arg =
      mockIndicatorsApi.getHealthDataForAnIndicator.mock.calls[0][0];
    expect(call1arg).toHaveProperty(
      'areaCodes',
      testParamsWithManyAreas.areasSelected.slice(0, 100)
    );

    const call2arg =
      mockIndicatorsApi.getHealthDataForAnIndicator.mock.calls[1][0];
    expect(call2arg).toHaveProperty(
      'areaCodes',
      testParamsWithManyAreas.areasSelected.slice(100, 101)
    );
  });
});

import { chunkArray, getHealthDataForIndicator } from './ViewsHelpers';
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

describe('chunkArray', () => {
  it('should chunk an array into the correct sized sub arrays', () => {
    const testArray1: string[] = new Array(10).fill('a', 0, 10);
    const testArray2: string[] = new Array(5).fill('b', 0, 5);

    expect(chunkArray(testArray1, 2)).toHaveLength(5);
    expect(chunkArray(testArray2, 2)).toEqual([['b', 'b'], ['b', 'b'], ['b']]);
  });
});

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
  //TODO: DHSCFT-518 move the following API call tests from OneIndicatorTwoOrMoreAreasView.test
  it.todo(
    'should make appropriate calls to the healthIndicatorApi when no group is specified'
  );
  it.todo(
    'should make appropriate calls to the healthIndicatorApi when a group is specified'
  );
  it.todo(
    'should make appropriate calls to the healthIndicatorApi when a long list of areas is specified'
  );
});

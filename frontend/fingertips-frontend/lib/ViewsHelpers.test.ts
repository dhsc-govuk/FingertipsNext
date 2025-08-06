import {
  determineBenchmarkRefType,
  getHealthDataForIndicator,
  getIndicatorData,
  GetIndicatorDataParam,
} from './ViewsHelpers';
import {
  BenchmarkReferenceType,
  HealthDataPoint,
  IndicatorsApi,
  IndicatorWithHealthDataForArea,
} from '@/generated-sources/ft-api-client';
import { mockDeep } from 'vitest-mock-extended';
import { ApiClientFactory } from '@/lib/apiClient/apiClientFactory';
import { healthDataPoint } from './mocks';
import { areaCodeForEngland } from '@/lib/chartHelpers/constants';
import { maxNumAreasThatCanBeRequestedAPI } from './chunkArray';
import { getAuthorisedHealthDataForAnIndicator } from './chartHelpers/getAuthorisedHealthDataForAnIndicator';
import { mockIndicatorWithHealthDataForArea } from '@/mock/data/mockIndicatorWithHealthDataForArea';

vi.mock('./chartHelpers/getAuthorisedHealthDataForAnIndicator', () => ({
  getAuthorisedHealthDataForAnIndicator: vi.fn(),
}));
const mockedGetgetAuthorisedHealthDataForAnIndicator = vi.mocked(
  getAuthorisedHealthDataForAnIndicator
);

const newMockIndicatorData = mockIndicatorWithHealthDataForArea();
const mockIndicatorData: IndicatorWithHealthDataForArea = {
  indicatorId: 1,
  areaHealthData: [
    {
      areaCode: 'A001',
      areaName: 'North FooBar',
      healthData: [healthDataPoint as unknown as HealthDataPoint],
    },
  ],
};

describe('getHealthDataForIndicator', () => {
  afterEach(() => {
    vi.resetAllMocks();
  });

  it('should return the health data for indicator', async () => {
    mockedGetgetAuthorisedHealthDataForAnIndicator.mockResolvedValue(
      newMockIndicatorData
    );

    const result = await getHealthDataForIndicator(
      '5555',
      [{ areaCodes: ['A001'] }],
      BenchmarkReferenceType.England
    );

    expect(getAuthorisedHealthDataForAnIndicator).toHaveBeenCalledWith({
      indicatorId: 5555,
      areaCodes: ['A001'],
      benchmarkRefType: BenchmarkReferenceType.England,
    });
    expect(result).toEqual(newMockIndicatorData);
  });

  it('should make the appropriate number of API calls when a long list of areas is requested', async () => {
    mockedGetgetAuthorisedHealthDataForAnIndicator.mockResolvedValue(
      newMockIndicatorData
    );
    const testAreas = new Array(maxNumAreasThatCanBeRequestedAPI + 1).fill(
      'a',
      0,
      maxNumAreasThatCanBeRequestedAPI + 1
    );

    await getHealthDataForIndicator(
      '1',
      [
        {
          areaCodes: testAreas,
        },
      ],
      BenchmarkReferenceType.England
    );

    expect(getAuthorisedHealthDataForAnIndicator).toHaveBeenNthCalledWith(1, {
      areaCodes: new Array(maxNumAreasThatCanBeRequestedAPI).fill(
        'a',
        0,
        maxNumAreasThatCanBeRequestedAPI
      ),
      indicatorId: Number(1),
      benchmarkRefType: BenchmarkReferenceType.England,
    });

    expect(getAuthorisedHealthDataForAnIndicator).toHaveBeenNthCalledWith(2, {
      areaCodes: ['a'],
      indicatorId: Number(1),
      benchmarkRefType: BenchmarkReferenceType.England,
    });
  });

  it('should return combined data when a long list of areas is requested', async () => {
    const testAreas = new Array(maxNumAreasThatCanBeRequestedAPI + 1).fill(
      'a',
      0,
      maxNumAreasThatCanBeRequestedAPI + 1
    );

    mockedGetgetAuthorisedHealthDataForAnIndicator.mockResolvedValueOnce(
      mockIndicatorData
    );
    mockedGetgetAuthorisedHealthDataForAnIndicator.mockResolvedValueOnce({
      ...mockIndicatorData,
      areaHealthData: [
        {
          areaCode: 'A002',
          areaName: 'South FooBar',
          healthData: [healthDataPoint],
        },
      ],
    });

    const result = await getHealthDataForIndicator(
      '1',
      [{ areaCodes: testAreas }],
      BenchmarkReferenceType.England
    );

    expect(result).toEqual({
      ...mockIndicatorData,
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

    mockedGetgetAuthorisedHealthDataForAnIndicator.mockResolvedValueOnce(
      mockIndicatorData
    );
    mockedGetgetAuthorisedHealthDataForAnIndicator.mockRejectedValueOnce(
      'Something went wrong.'
    );

    await expect(
      async () =>
        await getHealthDataForIndicator(
          '1',
          testAreas,
          BenchmarkReferenceType.England
        )
    ).rejects.toThrow();
  });

  it('should make multiple requests if different area types are given', async () => {
    mockedGetgetAuthorisedHealthDataForAnIndicator.mockResolvedValueOnce(
      mockIndicatorData
    );

    const mockAreaCode1 = 'A001';
    const mockAreaType1 = 'AT001';
    const mockAreaCode2 = 'A002';
    const mockAreaType2 = 'AT002';

    await getHealthDataForIndicator(
      '1',
      [
        {
          areaCodes: [mockAreaCode1],
          areaType: mockAreaType1,
        },
        {
          areaCodes: [mockAreaCode2],
          areaType: mockAreaType2,
        },
      ],
      BenchmarkReferenceType.England
    );

    expect(getAuthorisedHealthDataForAnIndicator).toHaveBeenNthCalledWith(1, {
      areaCodes: [mockAreaCode1],
      indicatorId: 1,
      areaType: mockAreaType1,
      benchmarkRefType: BenchmarkReferenceType.England,
    });

    expect(getAuthorisedHealthDataForAnIndicator).toHaveBeenNthCalledWith(2, {
      areaCodes: [mockAreaCode2],
      indicatorId: 1,
      areaType: mockAreaType2,
      benchmarkRefType: BenchmarkReferenceType.England,
    });
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
    vi.resetAllMocks();
  });

  it('should make appropriate calls to the healthIndicatorApi when no group is specified', async () => {
    mockedGetgetAuthorisedHealthDataForAnIndicator.mockResolvedValue(
      mockIndicatorData
    );

    await getIndicatorData(testParams, BenchmarkReferenceType.England);
    expect(
      mockedGetgetAuthorisedHealthDataForAnIndicator
    ).toHaveBeenCalledTimes(2);

    expect(
      mockedGetgetAuthorisedHealthDataForAnIndicator
    ).toHaveBeenNthCalledWith(1, {
      areaCodes: testParams.areasSelected,
      indicatorId: Number(testParams.indicatorSelected[0]),
      areaType: testParams.selectedAreaType,
      benchmarkRefType: BenchmarkReferenceType.England,
    });

    expect(
      mockedGetgetAuthorisedHealthDataForAnIndicator
    ).toHaveBeenNthCalledWith(2, {
      areaCodes: [areaCodeForEngland],
      indicatorId: Number(testParams.indicatorSelected[0]),
      areaType: 'england',
      benchmarkRefType: BenchmarkReferenceType.England,
    });
  });

  const testParamsWithGroup = {
    ...testParams,
    selectedGroupCode: 'ggg',
    selectedGroupType: 'test_group_type',
  };

  it('should make appropriate calls to the healthIndicatorApi when a group is specified', async () => {
    mockedGetgetAuthorisedHealthDataForAnIndicator.mockResolvedValue(
      mockIndicatorData
    );

    await getIndicatorData(testParamsWithGroup, BenchmarkReferenceType.England);
    expect(
      mockedGetgetAuthorisedHealthDataForAnIndicator
    ).toHaveBeenCalledTimes(3);

    expect(
      mockedGetgetAuthorisedHealthDataForAnIndicator
    ).toHaveBeenNthCalledWith(3, {
      areaCodes: [testParamsWithGroup.selectedGroupCode],
      indicatorId: Number(testParamsWithGroup.indicatorSelected[0]),
      areaType: testParamsWithGroup.selectedGroupType,
      benchmarkRefType: BenchmarkReferenceType.England,
    });
  });

  it('should make appropriate calls to the healthIndicatorApi when benchmarkRefType is SubNational', async () => {
    mockedGetgetAuthorisedHealthDataForAnIndicator.mockResolvedValue(
      mockIndicatorData
    );

    await getIndicatorData(
      testParamsWithGroup,
      BenchmarkReferenceType.SubNational
    );
    expect(
      mockedGetgetAuthorisedHealthDataForAnIndicator
    ).toHaveBeenCalledTimes(3);

    expect(
      mockedGetgetAuthorisedHealthDataForAnIndicator
    ).toHaveBeenNthCalledWith(3, {
      areaCodes: [testParamsWithGroup.selectedGroupCode],
      indicatorId: Number(testParamsWithGroup.indicatorSelected[0]),
      areaType: testParamsWithGroup.selectedGroupType,
      benchmarkRefType: BenchmarkReferenceType.SubNational,
      ancestorCode: testParamsWithGroup.selectedGroupCode,
    });
  });

  const testParamsWithManyAreas = {
    ...testParamsWithGroup,
    areasSelected: new Array(maxNumAreasThatCanBeRequestedAPI + 1).fill('a'),
  };

  it('should make appropriate calls to the healthIndicatorApi when a long list of areas is specified', async () => {
    mockedGetgetAuthorisedHealthDataForAnIndicator.mockResolvedValue(
      mockIndicatorData
    );

    await getIndicatorData(
      testParamsWithManyAreas,
      BenchmarkReferenceType.England
    );
    expect(
      mockedGetgetAuthorisedHealthDataForAnIndicator
    ).toHaveBeenCalledTimes(4);

    const call1arg =
      mockedGetgetAuthorisedHealthDataForAnIndicator.mock.calls[0][0];
    expect(call1arg).toHaveProperty(
      'areaCodes',
      testParamsWithManyAreas.areasSelected.slice(
        0,
        maxNumAreasThatCanBeRequestedAPI
      )
    );

    const call2arg =
      mockedGetgetAuthorisedHealthDataForAnIndicator.mock.calls[1][0];
    expect(call2arg).toHaveProperty(
      'areaCodes',
      testParamsWithManyAreas.areasSelected.slice(
        maxNumAreasThatCanBeRequestedAPI,
        maxNumAreasThatCanBeRequestedAPI + 1
      )
    );
  });

  it('should specify the year in the calls for England and group when the latest only parameter is provided', async () => {
    mockedGetgetAuthorisedHealthDataForAnIndicator.mockResolvedValue(
      mockIndicatorData
    );

    await getIndicatorData(
      testParamsWithGroup,
      BenchmarkReferenceType.England,
      true
    );
    expect(
      mockedGetgetAuthorisedHealthDataForAnIndicator
    ).toHaveBeenCalledTimes(3);

    expect(
      mockedGetgetAuthorisedHealthDataForAnIndicator
    ).toHaveBeenNthCalledWith(1, {
      areaCodes: ['abc', 'def'],
      areaType: 'test_area_type',
      indicatorId: 1,
      latestOnly: true,
      benchmarkRefType: BenchmarkReferenceType.England,
    });
    expect(
      mockedGetgetAuthorisedHealthDataForAnIndicator
    ).toHaveBeenNthCalledWith(2, {
      areaCodes: [areaCodeForEngland],
      areaType: 'england',
      indicatorId: 1,
      years: [2006],
    });
    expect(
      mockedGetgetAuthorisedHealthDataForAnIndicator
    ).toHaveBeenNthCalledWith(3, {
      areaCodes: ['ggg'],
      areaType: 'test_group_type',
      indicatorId: 1,
      years: [2006],
    });
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
    mockedGetgetAuthorisedHealthDataForAnIndicator.mockResolvedValueOnce(
      mockEmptyIndicatorData
    );
    mockedGetgetAuthorisedHealthDataForAnIndicator.mockResolvedValue(
      mockIndicatorData
    );

    await getIndicatorData(
      testParamsWithGroup,
      BenchmarkReferenceType.England,
      true
    );
    expect(
      mockedGetgetAuthorisedHealthDataForAnIndicator
    ).toHaveBeenCalledTimes(3);

    expect(
      mockedGetgetAuthorisedHealthDataForAnIndicator
    ).toHaveBeenNthCalledWith(1, {
      areaCodes: ['abc', 'def'],
      areaType: 'test_area_type',
      indicatorId: 1,
      latestOnly: true,
      benchmarkRefType: BenchmarkReferenceType.England,
    });
    expect(
      mockedGetgetAuthorisedHealthDataForAnIndicator
    ).toHaveBeenNthCalledWith(2, {
      areaCodes: [areaCodeForEngland],
      areaType: 'england',
      indicatorId: 1,
      latestOnly: true,
    });
    expect(
      mockedGetgetAuthorisedHealthDataForAnIndicator
    ).toHaveBeenNthCalledWith(3, {
      areaCodes: ['ggg'],
      areaType: 'test_group_type',
      indicatorId: 1,
      latestOnly: true,
    });
  });
});

describe('determineBenchmarkRefType', () => {
  it('should return "England" if no area is selected', () => {
    expect(determineBenchmarkRefType()).toBe(BenchmarkReferenceType.England);
  });

  it('should return "England" if England is selected', () => {
    expect(determineBenchmarkRefType(areaCodeForEngland)).toBe(
      BenchmarkReferenceType.England
    );
  });

  it('should return "SubNational" if a non-England area is selected', () => {
    expect(determineBenchmarkRefType('SOME_OTHER_CODE')).toBe(
      BenchmarkReferenceType.SubNational
    );
  });
});

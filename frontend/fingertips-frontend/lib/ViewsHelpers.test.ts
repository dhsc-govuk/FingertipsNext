import { chunkArray, getHealthDataForIndicator } from './ViewsHelpers';
import {
  HealthDataForArea,
  IndicatorsApi,
  IndicatorWithHealthDataForArea,
} from '@/generated-sources/ft-api-client';
import { mockDeep } from 'jest-mock-extended';
import { ApiClientFactory } from '@/lib/apiClient/apiClientFactory';
import { areaCodeForEngland } from '@/lib/chartHelpers/constants';

const mockEnglandData: HealthDataForArea = {
  areaCode: areaCodeForEngland,
  areaName: 'england',
  healthData: [],
};

const mockIndicator: IndicatorWithHealthDataForArea = {
  areaHealthData: [mockEnglandData],
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

  it('should return the health data for indicator', async () => {
    mockIndicatorsApi.getHealthDataForAnIndicator.mockResolvedValueOnce(
      mockIndicator
    );

    const result = await getHealthDataForIndicator('5555', mockIndicatorsApi);

    expect(mockIndicatorsApi.getHealthDataForAnIndicator).toHaveBeenCalled();
    expect(result).toEqual(mockIndicator);
  });
});

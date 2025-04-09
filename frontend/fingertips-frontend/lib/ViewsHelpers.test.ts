import { IndicatorWithHealthDataForArea } from '@/generated-sources/ft-api-client';
import {
  chunkArray,
  fetchIndicatorWithHealthDataForAreaInBatches,
} from './ViewsHelpers';
import { mockHealthData } from '@/mock/data/healthdata';

const mockGetHealthDataForAnIndicator = jest.fn().mockResolvedValue({
  indicatorId: 337,
  areaHealthData: mockHealthData['337'],
} as IndicatorWithHealthDataForArea);
jest.mock('@/lib/apiClient/apiClientFactory', () => ({
  ApiClientFactory: {
    getIndicatorsApiClient: jest.fn().mockImplementation(() => {
      return {
        getHealthDataForAnIndicator: mockGetHealthDataForAnIndicator,
      };
    }),
  },
}));

describe('chunkArray', () => {
  it('should chunk an array into the correct sized sub arrays', () => {
    const testArray1: string[] = new Array(10).fill('a', 0, 10);
    const testArray2: string[] = new Array(5).fill('b', 0, 5);

    expect(chunkArray(testArray1, 2)).toHaveLength(5);
    expect(chunkArray(testArray2, 2)).toEqual([['b', 'b'], ['b', 'b'], ['b']]);
  });

  it('check that getHealthDataForAnIndicator  is called with the right parameters when fetchBatchIndicatorWithHealthDataForArea is called', async () => {
    const areaCodes = ['E0001', 'E0003'];
    const indicatorData = await fetchIndicatorWithHealthDataForAreaInBatches(
      337,
      areaCodes,
      []
    );
    expect(mockGetHealthDataForAnIndicator).toHaveBeenCalledTimes(1);
    expect(indicatorData).not.toBeUndefined();
    expect(indicatorData?.indicatorId).toEqual(337);
    expect(indicatorData?.areaHealthData).toEqual(mockHealthData['337']);
    expect(mockGetHealthDataForAnIndicator).toHaveBeenCalledWith(
      {
        indicatorId: 337,
        areaCodes: areaCodes,
        inequalities: [],
      },
      undefined
    );
  });

  it('when an empty areaCodes is given I expect an undefined to be returned', async () => {
    const indicatorData = await fetchIndicatorWithHealthDataForAreaInBatches(
      337,
      [],
      []
    );
    expect(indicatorData).toBeUndefined();
  });
});

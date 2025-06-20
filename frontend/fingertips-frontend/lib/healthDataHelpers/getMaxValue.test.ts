import { getMaxValue } from '@/lib/healthDataHelpers/getMaxValue';
import { mockHealthDataForArea } from '@/mock/data/mockHealthDataForArea';
import { mockHealthDataPoints } from '@/mock/data/mockHealthDataPoint';

const testArea1 = mockHealthDataForArea({
  healthData: mockHealthDataPoints([1, 2, 4, 8, 16, undefined]),
});
const testArea2 = mockHealthDataForArea({
  healthData: mockHealthDataPoints([16, 43, 12]),
});
const testArea3 = mockHealthDataForArea({
  healthData: mockHealthDataPoints([4, 8, 15, 16, 23, 42]),
});

describe('getMaxValue', () => {
  it('should loop over area and health points and return the max value from all of them', () => {
    expect(getMaxValue([testArea1, testArea2, testArea3])).toEqual(43);
  });
});

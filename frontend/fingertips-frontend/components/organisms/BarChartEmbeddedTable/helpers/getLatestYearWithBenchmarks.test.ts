import { getLatestYearWithBenchmarks } from '@/components/organisms/BarChartEmbeddedTable/helpers/getLatestYearWithBenchmarks';
import { mockHealthDataForArea } from '@/mock/data/mockHealthDataForArea';
import { mockHealthDataPoints } from '@/mock/data/mockHealthDataPoint';

const testArea1 = mockHealthDataForArea({
  healthData: mockHealthDataPoints([2021, 2022, 2023, undefined]),
});
const testArea2 = mockHealthDataForArea({
  healthData: mockHealthDataPoints([2022, 2023, 2024]),
});
const testArea3 = mockHealthDataForArea({
  healthData: mockHealthDataPoints([2019, 2022, 2023, 2024, 2025]),
});

describe('getLatestYearWithBenchmarks', () => {
  it('should find the first complete year', () => {
    expect(
      getLatestYearWithBenchmarks(
        [testArea1, testArea2, testArea3],
        undefined,
        undefined
      )
    ).toEqual(2023);
  });
});

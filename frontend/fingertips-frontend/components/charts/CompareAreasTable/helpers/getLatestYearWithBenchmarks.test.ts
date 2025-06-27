import { getLatestYearWithBenchmarks } from '@/components/charts/CompareAreasTable/helpers/getLatestYearWithBenchmarks';
import { areaCodeForEngland } from '@/lib/chartHelpers/constants';
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
const englandDataWithNoPoints = mockHealthDataForArea({
  areaCode: areaCodeForEngland,
  healthData: [],
});
const groupDataWithNoPoints = mockHealthDataForArea({
  areaCode: 'GROUP',
  healthData: [],
});

describe('getLatestYearWithBenchmarks', () => {
  it('should find the first complete year', () => {
    expect(
      getLatestYearWithBenchmarks(
        [testArea1, testArea2, testArea3],
        undefined,
        undefined,
        areaCodeForEngland
      )
    ).toEqual(2023);
  });

  it('should ignore englandData with no healthData points', () => {
    expect(
      getLatestYearWithBenchmarks(
        [testArea1, testArea2, testArea3],
        englandDataWithNoPoints,
        undefined,
        areaCodeForEngland
      )
    ).toEqual(2023);
  });

  it('should ignore groupData with no healthData points', () => {
    expect(
      getLatestYearWithBenchmarks(
        [testArea1, testArea2, testArea3],
        undefined,
        groupDataWithNoPoints,
        'GROUP'
      )
    ).toEqual(2023);
  });

  it('should ignore both englandData and groupData with no healthData points', () => {
    expect(
      getLatestYearWithBenchmarks(
        [testArea1, testArea2, testArea3],
        englandDataWithNoPoints,
        groupDataWithNoPoints,
        areaCodeForEngland
      )
    ).toEqual(2023);
  });
});

import { getLatestPeriodWithBenchmarks } from '@/components/charts/CompareAreasTable/helpers/getLatestPeriodWithBenchmarks';
import { areaCodeForEngland } from '@/lib/chartHelpers/constants';
import { mockHealthDataForArea } from '@/mock/data/mockHealthDataForArea';
import { mockHealthDataPoints } from '@/mock/data/mockHealthDataPoint';
import { Frequency, PeriodType } from '@/generated-sources/ft-api-client';

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

const mockDatePeriod = {
  type: PeriodType.Calendar,
  from: new Date('2023-01-01'),
    to: new Date('2023-12-31'),
}

describe('getLatestPeriodWithBenchmarks', () => {
  it('should find the first complete year', () => {
    expect(
      getLatestPeriodWithBenchmarks(
        [testArea1, testArea2, testArea3],
        undefined,
        undefined,
        areaCodeForEngland
      )
    ).toEqual(mockDatePeriod);
  });

  it('should ignore englandData with no healthData points', () => {
    expect(
      getLatestPeriodWithBenchmarks(
        [testArea1, testArea2, testArea3],
        englandDataWithNoPoints,
        undefined,
        areaCodeForEngland
      )
    ).toEqual(mockDatePeriod);
  });

  it('should ignore groupData with no healthData points', () => {
    expect(
      getLatestPeriodWithBenchmarks(
        [testArea1, testArea2, testArea3],
        undefined,
        groupDataWithNoPoints,
        'GROUP'
      )
    ).toEqual(mockDatePeriod);
  });

  it('should ignore both englandData and groupData with no healthData points', () => {
    expect(
      getLatestPeriodWithBenchmarks(
        [testArea1, testArea2, testArea3],
        englandDataWithNoPoints,
        groupDataWithNoPoints,
        areaCodeForEngland
      )
    ).toEqual(mockDatePeriod);
  });
});

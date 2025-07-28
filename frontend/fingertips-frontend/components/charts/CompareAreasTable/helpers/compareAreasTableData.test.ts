import { compareAreasTableData } from '@/components/charts/CompareAreasTable/helpers/compareAreasTableData';
import { areaCodeForEngland } from '@/lib/chartHelpers/constants';
import { mockIndicatorWithHealthDataForArea } from '@/mock/data/mockIndicatorWithHealthDataForArea';
import {
  mockHealthDataForArea,
  mockHealthDataForArea_England,
  mockHealthDataForArea_Group,
} from '@/mock/data/mockHealthDataForArea';
import {
  BenchmarkComparisonMethod,
  IndicatorPolarity,
} from '@/generated-sources/ft-api-client';
import { expectAnyHealthDataForArea } from '@/mock/data/expectAnyHealthDataForArea';

describe('compareAreasTableData', () => {
  it('extracts England and group data from health data', () => {
    const input = mockIndicatorWithHealthDataForArea({
      areaHealthData: [
        mockHealthDataForArea(),
        mockHealthDataForArea_England(),
        mockHealthDataForArea_Group(),
      ],
    });

    const result = compareAreasTableData(input, 'E12000002', 'BENCHMARK_X');

    expect(result).toEqual({
      benchmarkComparisonMethod:
        BenchmarkComparisonMethod.CIOverlappingReferenceValue95,
      polarity: IndicatorPolarity.LowIsGood,
      englandData: expectAnyHealthDataForArea({ areaCode: areaCodeForEngland }),
      groupData: expectAnyHealthDataForArea({ areaCode: 'E12000002' }),
      healthIndicatorData: [expectAnyHealthDataForArea()],
      benchmarkToUse: 'BENCHMARK_X',
      periodType: 'Calendar',
      frequency: 'Annually',
      latestDataPeriod: {
        to: new Date('2023-12-31'),
        from: new Date('2023-01-01'),
        type: 'Calendar',
      },
    });
  });

  it('handles missing group and benchmark selection gracefully', () => {
    const input = mockIndicatorWithHealthDataForArea();
    const result = compareAreasTableData(input);

    expect(result).toEqual({
      benchmarkComparisonMethod:
        BenchmarkComparisonMethod.CIOverlappingReferenceValue95,
      polarity: IndicatorPolarity.LowIsGood,
      englandData: undefined,
      groupData: undefined,
      healthIndicatorData: [expectAnyHealthDataForArea()],
      benchmarkToUse: areaCodeForEngland,
      periodType: 'Calendar',
      frequency: 'Annually',
    });
  });

  it('should extract the latest England data period', () => {
    const englandHealthData = mockHealthDataForArea_England({
      healthData: [
        {
          ...mockHealthDataForArea_England().healthData[0],
          datePeriod: {
            to: new Date('2022-12-31'),
            from: new Date('2022-01-01'),
            type: 'Unknown',
          },
        },
        {
          ...mockHealthDataForArea_England().healthData[0],
          datePeriod: {
            to: new Date('2023-12-31'),
            from: new Date('2023-01-01'),
            type: 'Unknown',
          },
        },
      ],
    });

    const input = mockIndicatorWithHealthDataForArea({
      areaHealthData: [englandHealthData],
    });

    const result = compareAreasTableData(input);

    expect(result.latestDataPeriod).toEqual({
      to: new Date('2023-12-31'),
      from: new Date('2023-01-01'),
      type: 'Unknown',
    });
  });
});

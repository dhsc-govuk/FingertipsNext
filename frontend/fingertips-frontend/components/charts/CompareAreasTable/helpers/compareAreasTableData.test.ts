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
    });
  });
});

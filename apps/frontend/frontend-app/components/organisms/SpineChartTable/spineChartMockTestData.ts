import { SpineChartIndicatorData } from '@/components/organisms/SpineChartTable/spineChartTableHelpers';
import {
  BenchmarkComparisonMethod,
  BenchmarkOutcome,
  HealthDataForArea,
  HealthDataPointTrendEnum,
  IndicatorPolarity,
  IndicatorWithHealthDataForArea,
  QuartileData,
} from '@/generated-sources/ft-api-client';
import { allAgesAge, noDeprivation, personsSex } from '@/lib/mocks';
import { IndicatorDocument } from '@/lib/search/searchTypes';

export const mockSpineHealthDataForArea: HealthDataForArea = {
  areaCode: 'A1425',
  areaName: 'Greater Manchester ICB - 00T',
  healthData: [
    {
      year: 2025,
      count: 222,
      value: 690.305692,
      lowerCi: 341.69151,
      upperCi: 478.32766,
      ageBand: allAgesAge,
      sex: personsSex,
      trend: HealthDataPointTrendEnum.CannotBeCalculated,
      deprivation: noDeprivation,
      benchmarkComparison: {
        outcome: BenchmarkOutcome.Similar,
      },
    },
  ],
};

export const mockSpineGroupData = {
  areaCode: '90210',
  areaName: 'Manchester',
  healthData: [
    {
      year: 2025,
      count: 3333,
      value: 890.305692,
      lowerCi: 341.69151,
      upperCi: 478.32766,
      ageBand: allAgesAge,
      sex: personsSex,
      trend: HealthDataPointTrendEnum.NotYetCalculated,
      deprivation: noDeprivation,
    },
  ],
};

export const mockSpineQuartileData: QuartileData = {
  indicatorId: 1,
  polarity: IndicatorPolarity.HighIsGood,
  q0Value: 999,
  q1Value: 760,
  q3Value: 500,
  q4Value: 345,
  areaValue: 550,
};

export const mockSpineIndicatorData: SpineChartIndicatorData = {
  indicatorId: '1',
  indicatorName: 'indicator',
  latestDataPeriod: 2025,
  valueUnit: '%',
  benchmarkComparisonMethod:
    BenchmarkComparisonMethod.CIOverlappingReferenceValue95,
  areasHealthData: [mockSpineHealthDataForArea],
  groupData: mockSpineGroupData,
  quartileData: mockSpineQuartileData,
};

export const mockSpineIndicatorWithHealthData: IndicatorWithHealthDataForArea =
  {
    indicatorId: 1,
    name: 'indicator',
    polarity: IndicatorPolarity.HighIsGood,
    benchmarkMethod: BenchmarkComparisonMethod.CIOverlappingReferenceValue95,
    areaHealthData: [mockSpineHealthDataForArea],
  };

export const mockSpineIndicatorWithHealthDataWithGroup: IndicatorWithHealthDataForArea =
  {
    ...mockSpineIndicatorWithHealthData,
    areaHealthData: [mockSpineHealthDataForArea, mockSpineGroupData],
  };

export const mockSpineIndicatorWithNoHealthData: IndicatorWithHealthDataForArea =
  {
    ...mockSpineIndicatorWithHealthData,
    areaHealthData: [],
  };

export const mockSpineIndicatorDocument: IndicatorDocument = {
  // for spine chart we only need indicatorId and unitLabel
  indicatorID: '1',
  unitLabel: '%',
  //
  dataSource: '',
  earliestDataPeriod: '',
  hasInequalities: false,
  indicatorDefinition: '',
  indicatorName: '',
  lastUpdatedDate: new Date(),
  latestDataPeriod: '',
};

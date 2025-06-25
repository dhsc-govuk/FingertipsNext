import { SpineChartIndicatorData } from '@/components/charts/SpineChart/helpers/buildSpineChartIndicatorData';
import {
  BenchmarkComparisonMethod,
  BenchmarkOutcome,
  HealthDataForArea,
  HealthDataPointTrendEnum,
  IndicatorPolarity,
  IndicatorWithHealthDataForArea,
  QuartileData,
} from '@/generated-sources/ft-api-client';
import {
  areaCodeForEngland,
  englandAreaString,
} from '@/lib/chartHelpers/constants';
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
        benchmarkAreaCode: 'E0000001',
        benchmarkAreaName: 'England',
        benchmarkValue: 13.8,
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
      benchmarkComparison: {
        benchmarkAreaCode: 'E0000002',
        benchmarkAreaName: 'Eng',
        benchmarkValue: 13.9,
        outcome: BenchmarkOutcome.Worse,
      },
    },
  ],
};

export const mockSpineEnglandData = {
  ...mockSpineGroupData,
  areaCode: areaCodeForEngland,
  areaName: englandAreaString,
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
  englandData: mockSpineEnglandData,
  quartileData: mockSpineQuartileData,
};

export const mockSpineIndicatorWithHealthData: IndicatorWithHealthDataForArea =
  {
    indicatorId: 1,
    name: 'indicator',
    polarity: IndicatorPolarity.HighIsGood,
    benchmarkMethod: BenchmarkComparisonMethod.CIOverlappingReferenceValue95,
    areaHealthData: [mockSpineHealthDataForArea, mockSpineEnglandData],
  };

export const mockSpineIndicatorWithHealthDataWithGroup: IndicatorWithHealthDataForArea =
  {
    ...mockSpineIndicatorWithHealthData,
    areaHealthData: [
      mockSpineHealthDataForArea,
      mockSpineGroupData,
      mockSpineEnglandData,
    ],
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

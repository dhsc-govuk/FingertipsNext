import {
  BenchmarkComparisonMethod,
  HealthDataForArea,
  QuartileData,
} from '@/generated-sources/ft-api-client';

export const spineChartImproperUsageError =
  'Improper usage: Spine chart should only be shown when 1-2 areas are selected';
export const spineChartIndicatorTitleColumnMinWidth = 240;

export interface SpineChartIndicatorData {
  indicatorId: string;
  indicatorName: string;
  latestDataPeriod: number;
  benchmarkComparisonMethod?: BenchmarkComparisonMethod;
  valueUnit: string;
  areasHealthData: HealthDataForArea[];
  groupData: HealthDataForArea;
  quartileData: QuartileData;
};


export const getHealthDataForArea = (
  areaHealthData: HealthDataForArea[] | undefined,
  areaCode: string
): HealthDataForArea => {
  if (!areaHealthData) {
    throw new Error('Indicator contains no area health data');
  }

  const matchedAreaHealthData = areaHealthData.find(
    (areaHealthDataItem) => areaHealthDataItem.areaCode === areaCode
  );

  if (!matchedAreaHealthData) {
    throw new Error('No health data found for the requested area code');
  }

  return matchedAreaHealthData;
}

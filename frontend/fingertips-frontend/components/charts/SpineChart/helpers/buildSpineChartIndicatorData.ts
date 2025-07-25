import {
  BenchmarkComparisonMethod,
  HealthDataForArea,
  IndicatorWithHealthDataForArea,
  QuartileData,
} from '@/generated-sources/ft-api-client';
import { areaCodeForEngland } from '@/lib/chartHelpers/constants';
import { IndicatorDocument } from '@/lib/search/searchTypes';
import { segmentValues } from '@/lib/healthDataHelpers/segmentValues';
import { segmentCombinations } from '@/lib/healthDataHelpers/segmentCombinations';
import { findHealthDataForArea } from '@/lib/healthDataHelpers/findHealthDataForArea';
import { filterDefined } from '@/lib/chartHelpers/filterDefined';
import { flattenSegment } from '@/lib/healthDataHelpers/flattenSegment';
import { segmentIdFromInfo } from '@/lib/healthDataHelpers/segmentIdFromInfo';
import { searchFromSegmentInfo } from '@/lib/healthDataHelpers/searchFromSegmentInfo';
import { findHealthDataForAreas } from '@/lib/healthDataHelpers/findHealthDataForAreas';
import { findQuartileBySegmentation } from '@/lib/healthDataHelpers/findQuartileBySegmentation';
import { indicatorsSorted } from '@/lib/healthDataHelpers/indicatorsSorted';

export const spineChartIndicatorTitleColumnMinWidth = 240;

export interface SpineChartIndicatorData {
  rowId: string;
  indicatorId: number;
  indicatorName: string;
  latestDataPeriod?: number;
  benchmarkComparisonMethod?: BenchmarkComparisonMethod;
  valueUnit: string;
  areasHealthData: HealthDataForArea[];
  groupData?: HealthDataForArea;
  englandData?: HealthDataForArea;
  quartileData: QuartileData;
}

const onlyMatchingDataPoints = (
  areaHealthData?: HealthDataForArea,
  period?: number
) => {
  if (!areaHealthData) return undefined;
  return {
    ...areaHealthData,
    healthData: areaHealthData.healthData.filter(
      (dataPoint) => dataPoint.year === period
    ),
  };
};

export const buildSpineChartIndicatorData = (
  allIndicatorData: IndicatorWithHealthDataForArea[],
  allIndicatorMetadata: IndicatorDocument[],
  quartileData: QuartileData[],
  areasSelected: string[],
  selectedGroupCode: string
): SpineChartIndicatorData[] => {
  // indicators with names and ids
  const indicators = allIndicatorData.filter(
    (indicator) => indicator.indicatorId && indicator.name
  );

  const indicatorsInOrder = indicatorsSorted(indicators);

  // split into segments
  const segmented = indicatorsInOrder.flatMap((indicator) => {
    const indicatorId = indicator.indicatorId as number;
    const name = indicator.name as string;
    const { benchmarkMethod } = indicator;

    const metaData = allIndicatorMetadata.find(
      (meta) => Number(meta.indicatorID) === indicatorId
    );

    const segValues = segmentValues(indicator);
    const combinations = segmentCombinations(segValues);

    return combinations.map((segmentInfo) => {
      const search = searchFromSegmentInfo(segmentInfo);
      const extractedSegment = flattenSegment(indicator, search);
      const segmentId = segmentIdFromInfo(indicatorId, segmentInfo);

      const matchedQuartileData = findQuartileBySegmentation(
        quartileData,
        indicatorId,
        segmentInfo
      );

      const latestDataPeriod = matchedQuartileData?.year;

      if (!matchedQuartileData || !latestDataPeriod) return;

      const areasHealthData = findHealthDataForAreas(
        extractedSegment,
        areasSelected
      )
        .map((areaHealthData) =>
          onlyMatchingDataPoints(areaHealthData, latestDataPeriod)
        )
        .filter(filterDefined) as HealthDataForArea[];

      const groupData = onlyMatchingDataPoints(
        findHealthDataForArea(extractedSegment, selectedGroupCode),
        latestDataPeriod
      );

      const englandData = onlyMatchingDataPoints(
        findHealthDataForArea(extractedSegment, areaCodeForEngland),
        latestDataPeriod
      );

      const result: SpineChartIndicatorData = {
        rowId: segmentId,
        indicatorId,
        indicatorName: extractedSegment.name ?? name,
        valueUnit: metaData?.unitLabel ?? '',
        benchmarkComparisonMethod: benchmarkMethod,
        latestDataPeriod,
        areasHealthData,
        groupData,
        englandData,
        quartileData: matchedQuartileData,
      };
      return result;
    });
  });

  // return without any undefined rows
  return segmented.filter(filterDefined) as SpineChartIndicatorData[];
};
